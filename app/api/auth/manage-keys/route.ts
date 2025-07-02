import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 创建Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 请求接口
interface ManageKeyRequest {
  action: 'list' | 'revoke' | 'update';
  keyId?: string;
  userId?: string;
  active?: boolean;
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
    const requestData: ManageKeyRequest = await request.json();
    
    // 根据操作类型执行不同的操作
    switch (requestData.action) {
      case 'list':
        // 列出API密钥
        const query = supabase.from('api_keys').select('*');
        
        // 如果指定了用户ID，则只列出该用户的密钥
        if (requestData.userId) {
          query.eq('user_id', requestData.userId);
        }
        
        const { data: keys, error: listError } = await query;
        
        if (listError) {
          throw listError;
        }
        
        return NextResponse.json({ keys });
        
      case 'revoke':
        // 撤销API密钥
        if (!requestData.keyId) {
          return NextResponse.json({ error: '未提供密钥ID' }, { status: 400 });
        }
        
        const { error: revokeError } = await supabase
          .from('api_keys')
          .update({ active: false })
          .eq('id', requestData.keyId);
        
        if (revokeError) {
          throw revokeError;
        }
        
        return NextResponse.json({ success: true, message: '密钥已撤销' });
        
      case 'update':
        // 更新API密钥状态
        if (!requestData.keyId) {
          return NextResponse.json({ error: '未提供密钥ID' }, { status: 400 });
        }
        
        if (requestData.active === undefined) {
          return NextResponse.json({ error: '未提供活跃状态' }, { status: 400 });
        }
        
        const { error: updateError } = await supabase
          .from('api_keys')
          .update({ active: requestData.active })
          .eq('id', requestData.keyId);
        
        if (updateError) {
          throw updateError;
        }
        
        return NextResponse.json({ 
          success: true, 
          message: requestData.active ? '密钥已激活' : '密钥已禁用' 
        });
        
      default:
        return NextResponse.json({ error: '不支持的操作' }, { status: 400 });
    }
  } catch (error) {
    console.error('管理API密钥时出错:', error);
    return NextResponse.json({ error: '管理API密钥时出错' }, { status: 500 });
  }
}