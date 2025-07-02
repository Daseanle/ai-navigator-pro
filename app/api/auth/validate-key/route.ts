import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/apiKeyValidation';

export async function POST(request: NextRequest) {
  try {
    // 从请求头中获取API密钥
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ valid: false, error: '未提供授权头' }, { status: 401 });
    }
    
    const apiKey = authHeader.replace('Bearer ', '');
    
    // 验证API密钥
    const isValid = await validateApiKey(apiKey);
    
    if (isValid) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false, error: 'API密钥无效' }, { status: 401 });
    }
  } catch (error) {
    console.error('验证API密钥时出错:', error);
    return NextResponse.json({ valid: false, error: '验证API密钥时出错' }, { status: 500 });
  }
}