import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/apiKeyValidation';
import { runSeoOptimization } from '@/lib/seoService';

// 请求接口
interface BatchSeoOptimizationRequest {
  contentTypes?: string[];
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
    const requestData: BatchSeoOptimizationRequest = await request.json();
    
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
      // 执行批量SEO优化
      // 将 contentTypes 数组转换为单个类型，如果有多个类型，只使用第一个
      let contentType: 'category' | 'blog' | 'page' | 'tool' | undefined = undefined;
      
      if (requestData.contentTypes && requestData.contentTypes.length > 0) {
        const type = requestData.contentTypes[0];
        if (type === 'category' || type === 'blog' || type === 'page' || type === 'tool') {
          contentType = type;
        }
      }
      
      const result = await runSeoOptimization(
        contentType,
        requestData.limit || 5
      );
      
      // 返回优化结果
      return NextResponse.json(result);
    } finally {
      // 恢复原始API密钥
      if (requestData.apiKey && originalApiKey !== undefined) {
        process.env.OPENROUTER_API_KEY = originalApiKey;
      }
    }
  } catch (error) {
    console.error('批量SEO优化错误:', error);
    return NextResponse.json({ error: '批量SEO优化失败' }, { status: 500 });
  }
}