import { NextRequest, NextResponse } from 'next/server';
import { runAutoOperation } from '@/lib/autoOperationService';

// 环境变量
const apiKey = process.env.API_KEY || '';

// 执行自动化操作
export async function POST(request: NextRequest) {
  // 验证API密钥
  const authHeader = request.headers.get('authorization');
  const providedApiKey = authHeader ? authHeader.split(' ')[1] : null;
  
  // 如果在生产环境中且API密钥不匹配，则拒绝访问
  if (process.env.NODE_ENV === 'production' && providedApiKey !== apiKey) {
    return NextResponse.json(
      { error: '无效的API密钥' },
      { status: 401 }
    );
  }

  try {
    // 执行自动化操作
    console.log('开始执行自动化操作...');
    const result = await runAutoOperation();
    
    return NextResponse.json({
      message: result.success ? '自动化操作已成功完成' : '部分自动化操作失败',
      result
    });
  } catch (error) {
    console.error('执行自动化操作错误:', error);
    return NextResponse.json(
      { error: '执行自动化操作失败: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}