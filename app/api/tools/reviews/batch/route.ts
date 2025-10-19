import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

interface BatchReviewRequest {
  apiKey?: string;
  categoryFilter?: string[];
  limit?: number;
  skipExisting?: boolean;
}

interface ToolData {
  id: number;
  name: string;
  tagline: string;
  website_url: string;
  tags: { name: string }[];
}

export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json() as BatchReviewRequest;
    const { apiKey, categoryFilter, limit = 5, skipExisting = true } = body;
    
    // 验证API密钥
    const validApiKey = process.env.OPENROUTER_API_KEY || apiKey;
    if (!validApiKey) {
      return NextResponse.json(
        { error: '未配置OpenRouter API密钥，请在.env.local文件中添加OPENROUTER_API_KEY或在请求中提供apiKey' },
        { status: 401 }
      );
    }
    
    // 查询需要生成评测的工具
    let query = supabase
      .from('tools')
      .select(`
        id, name, tagline, website_url,
        tags (name),
        reviews (id)
      `);
    
    // 如果需要跳过已有评测的工具
    if (skipExisting) {
      query = query.is('reviews.id', null);
    }
    
    // 如果有分类过滤
    if (categoryFilter && categoryFilter.length > 0) {
      query = query.in('tags.name', categoryFilter);
    }
    
    // 限制数量
    query = query.limit(limit);
    
    const { data: tools, error: toolsError } = await query;
    
    if (toolsError) {
      console.error('获取工具列表失败:', toolsError);
      return NextResponse.json(
        { error: `获取工具列表失败: ${toolsError.message}` },
        { status: 500 }
      );
    }
    
    if (!tools || tools.length === 0) {
      return NextResponse.json({
        success: true,
        message: '没有找到需要生成评测的工具',
        processed: 0,
        tools: []
      });
    }
    
    // 批量生成评测
    const results = [];
    const errors = [];
    
    for (const tool of tools) {
      try {
        // 调用生成评测的API
        const response = await fetch(`${request.nextUrl.origin}/api/tools/reviews/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            toolId: tool.id,
            toolName: tool.name,
            toolDescription: tool.tagline,
            toolWebsite: tool.website_url,
            toolCategories: tool.tags.map((tag: any) => tag.name),
            apiKey: validApiKey
          })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          results.push({
            toolId: tool.id,
            toolName: tool.name,
            success: true,
            reviewId: result.review?.id
          });
        } else {
          errors.push({
            toolId: tool.id,
            toolName: tool.name,
            error: result.error || '未知错误'
          });
        }
        
        // 添加延迟，避免API限制
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`为工具 ${tool.name} (ID: ${tool.id}) 生成评测失败:`, error);
        errors.push({
          toolId: tool.id,
          toolName: tool.name,
          error: (error as Error).message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `批量生成评测完成: 成功 ${results.length} 个, 失败 ${errors.length} 个`,
      processed: tools.length,
      results,
      errors
    });
    
  } catch (error) {
    console.error('批量生成工具评测错误:', error);
    return NextResponse.json(
      { error: `批量生成工具评测错误: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}