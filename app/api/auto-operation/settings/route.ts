import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAutoOperationSettings, saveAutoOperationSettings } from '@/lib/autoOperationService';

// 环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const apiKey = process.env.API_KEY || '';

// 获取自动化操作设置
export async function GET(request: NextRequest) {
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
    // 获取设置
    const settings = await getAutoOperationSettings();
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('获取自动化操作设置错误:', error);
    return NextResponse.json(
      { error: '获取自动化操作设置失败' },
      { status: 500 }
    );
  }
}

// 更新自动化操作设置
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
    // 获取请求体
    const body = await request.json();
    const { settings } = body;
    
    if (!settings) {
      return NextResponse.json(
        { error: '缺少设置数据' },
        { status: 400 }
      );
    }
    
    // 保存设置
    const success = await saveAutoOperationSettings(settings);
    
    if (!success) {
      return NextResponse.json(
        { error: '保存设置失败' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: '设置已成功保存',
      settings
    });
  } catch (error) {
    console.error('更新自动化操作设置错误:', error);
    return NextResponse.json(
      { error: '更新自动化操作设置失败' },
      { status: 500 }
    );
  }
}