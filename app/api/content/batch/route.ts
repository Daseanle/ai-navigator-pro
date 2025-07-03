import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/apiKeyValidation';
import { generateContent, ContentType } from '@/lib/contentGenerationService';

// 请求接口
interface BatchContentGenerationRequest {
  contentTypes?: ContentType[];
  limit?: number;
  apiKey?: string;
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
    const requestData: BatchContentGenerationRequest = await request.json();
    
    // 验证OpenRouter API密钥
    if (!process.env.OPENROUTER_API_KEY && !requestData.apiKey) {
      return NextResponse.json({ error: '未配置OpenRouter API密钥' }, { status: 400 });
    }
    
    // 如果提供了API密钥，临时设置环境变量
    let originalApiKey;
    if (requestData.apiKey) {
      originalApiKey = process.env.OPENROUTER_API_KEY;
      process.env.OPENROUTER_API_KEY = requestData.apiKey;
    }
    
    try {
      // 执行批量内容生成
      const result = await generateContent(
        undefined,
        requestData.contentTypes,
        requestData.limit || 5
      );
      
      // 返回生成结果
      return NextResponse.json(result);
    } finally {
      // 恢复原始API密钥
      if (requestData.apiKey && originalApiKey !== undefined) {
        process.env.OPENROUTER_API_KEY = originalApiKey;
      }
    }
  } catch (error) {
    console.error('批量内容生成错误:', error);
    return NextResponse.json({ error: '批量内容生成失败' }, { status: 500 });
  }
}