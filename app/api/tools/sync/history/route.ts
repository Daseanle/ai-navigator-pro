import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// 获取工具同步历史记录
export async function GET(request: NextRequest) {
  try {
    // 检查API密钥（简单的安全措施）
    const apiKey = request.nextUrl.searchParams.get('key');
    const validApiKey = process.env.TOOLS_SYNC_API_KEY || 'default-sync-key';
    
    if (apiKey !== validApiKey) {
      return NextResponse.json(
        { error: '无效的API密钥' },
        { status: 401 }
      );
    }
    
    // 获取分页参数
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const pageSize = parseInt(request.nextUrl.searchParams.get('pageSize') || '10');
    
    // 计算偏移量
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // 查询同步历史记录
    const { data, error, count } = await supabase
      .from('tool_sync_history')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) {
      console.error('获取同步历史记录失败:', error);
      return NextResponse.json(
        { 
          error: '获取同步历史记录失败', 
          details: error.message,
          code: error.code
        },
        { status: 500 }
      );
    }
    
    // 返回同步历史记录和分页信息
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    });
  } catch (error) {
    console.error('获取同步历史记录错误:', error);
    
    return NextResponse.json(
      { 
        error: '获取同步历史记录时发生错误', 
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substring(2, 15)
      },
      { status: 500 }
    );
  }
}