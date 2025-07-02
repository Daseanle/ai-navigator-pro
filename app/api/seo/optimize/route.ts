import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/apiKeyValidation';
import { generateWithOpenRouter } from '@/lib/openRouterService';

// 请求接口
interface SeoOptimizationRequest {
  content_id: string;
  content_title: string;
  content_body: string;
  content_url: string;
  keywords: string[];
  apiKey: string;
}

// 响应接口
interface SeoOptimizationResponse {
  title: string;
  meta_description: string;
  keywords: string[];
  h1: string;
  suggestions: string[];
}

export async function POST(request: NextRequest) {
  try {
    // 验证API密钥
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '未提供授权头' }, { status: 401 });
    }
    
    const apiKey = authHeader.replace('Bearer ', '');
    const isValidKey = await validateApiKey(apiKey);
    if (!isValidKey) {
      return NextResponse.json({ error: 'API密钥无效' }, { status: 401 });
    }
    
    // 解析请求体
    const requestData: SeoOptimizationRequest = await request.json();
    
    // 验证请求数据
    if (!requestData.content_id || !requestData.content_title || !requestData.content_body || !requestData.content_url) {
      return NextResponse.json({ error: '请求数据不完整' }, { status: 400 });
    }
    
    // 检查OpenRouter API密钥是否已配置
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: '未配置OpenRouter API密钥，请在.env.local文件中添加OPENROUTER_API_KEY' }, { status: 500 });
    }
    
    // 调用OpenAI API生成SEO优化建议
    const optimizationResult = await generateSeoOptimizationWithAI(requestData);
    
    // 返回优化结果
    return NextResponse.json(optimizationResult);
  } catch (error) {
    console.error('SEO优化错误:', error);
    return NextResponse.json({ error: 'SEO优化失败' }, { status: 500 });
  }
}

/**
 * 使用AI生成SEO优化建议
 */
async function generateSeoOptimizationWithAI(requestData: SeoOptimizationRequest): Promise<SeoOptimizationResponse> {
  try {
    // 构建提示词
    const prompt = `
      你是一个SEO优化专家。请分析以下内容并提供SEO优化建议：
      
      内容标题: ${requestData.content_title}
      
      内容URL: ${requestData.content_url}
      
      目标关键词: ${requestData.keywords.join(', ')}
      
      内容正文:
      ${requestData.content_body.substring(0, 1500)}... (内容已截断)
      
      请提供以下SEO优化建议，以JSON格式返回：
      1. title: 优化后的标题标签内容（不超过60个字符）
      2. meta_description: 优化后的元描述（不超过160个字符）
      3. keywords: 优化后的关键词数组（包括原关键词和建议的额外关键词）
      4. h1: 优化后的H1标题
      5. suggestions: 其他SEO优化建议数组
      
      确保优化建议：
      - 包含主要关键词
      - 具有吸引力和相关性
      - 符合SEO最佳实践
      - 保持内容的原意
    `;
    
    // 调用OpenRouter API
    const systemPrompt = '你是一个SEO优化专家，擅长提供具体、可操作的SEO优化建议。';
    const aiResponse = await generateWithOpenRouter(prompt, systemPrompt, 'openai/gpt-4', 0.5, 1000);
    
    // 解析AI响应
    let parsedResponse: SeoOptimizationResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (err) {
      console.error('解析AI响应失败:', err);
      console.log('原始响应:', aiResponse);
      
      // 尝试从文本中提取信息
      const titleMatch = aiResponse.match(/title[：:] *(.+)/i);
      const descriptionMatch = aiResponse.match(/meta_description[：:] *(.+)/i);
      const h1Match = aiResponse.match(/h1[：:] *(.+)/i);
      
      parsedResponse = {
        title: titleMatch ? titleMatch[1].trim() : requestData.content_title,
        meta_description: descriptionMatch ? descriptionMatch[1].trim() : `${requestData.content_title} - 了解更多关于${requestData.keywords[0]}的信息。`,
        keywords: requestData.keywords,
        h1: h1Match ? h1Match[1].trim() : requestData.content_title,
        suggestions: []
      };
    }
    
    // 确保所有必要字段都存在
    if (!parsedResponse.title) {
      parsedResponse.title = requestData.content_title;
    }
    
    if (!parsedResponse.meta_description) {
      parsedResponse.meta_description = `${requestData.content_title} - 了解更多关于${requestData.keywords[0]}的信息。`;
    }
    
    if (!parsedResponse.keywords || !Array.isArray(parsedResponse.keywords)) {
      parsedResponse.keywords = requestData.keywords;
    }
    
    if (!parsedResponse.h1) {
      parsedResponse.h1 = requestData.content_title;
    }
    
    if (!parsedResponse.suggestions || !Array.isArray(parsedResponse.suggestions)) {
      parsedResponse.suggestions = [];
    }
    
    // 确保标题和描述不超过限制
    if (parsedResponse.title.length > 60) {
      parsedResponse.title = parsedResponse.title.substring(0, 57) + '...';
    }
    
    if (parsedResponse.meta_description.length > 160) {
      parsedResponse.meta_description = parsedResponse.meta_description.substring(0, 157) + '...';
    }
    
    return parsedResponse;
  } catch (error) {
    console.error('生成SEO优化建议失败:', error);
    throw error;
  }
}