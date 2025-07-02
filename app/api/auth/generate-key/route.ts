import { NextRequest, NextResponse } from 'next/server';
import { generateApiKey } from '@/lib/apiKeyValidation';
import { createClient } from '@supabase/supabase-js';

// 创建Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 请求接口
interface GenerateKeyRequest {
  userId?: string;
  expiresInDays?: number;
}

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '未提供授权头' }, { status: 401 });
    }
    
    const sessionToken = authHeader.replace('Bearer ', '');
    
    // 验证会话
    const { data: { user }, error: authError } = await supabase.auth.getUser(sessionToken);
    
    if (authError || !user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    
    // 检查用户是否为管理员
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 });
    }
    
    // 解析请求体
    const requestData: GenerateKeyRequest = await request.json();
    
    // 生成新的API密钥
    const targetUserId = requestData.userId || user.id;
    const expiresInDays = requestData.expiresInDays || 365;
    
    const apiKey = await generateApiKey(targetUserId, expiresInDays);
    
    return NextResponse.json({
      key: apiKey.key,
      expiresAt: apiKey.expires_at
    });
  } catch (error) {
    console.error('生成API密钥时出错:', error);
    return NextResponse.json({ error: '生成API密钥时出错' }, { status: 500 });
  }
}