import { createClient } from '@supabase/supabase-js';

// 创建Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 验证API密钥是否有效
 * @param apiKey 需要验证的API密钥
 * @returns 密钥是否有效
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey) return false;
  
  try {
    // 从数据库中查询API密钥
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .eq('active', true)
      .single();
    
    if (error || !data) {
      console.error('API密钥验证错误:', error);
      return false;
    }
    
    // 检查密钥是否过期
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      console.log('API密钥已过期:', apiKey);
      return false;
    }
    
    // 更新最后使用时间
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id);
    
    return true;
  } catch (error) {
    console.error('API密钥验证过程中出错:', error);
    return false;
  }
}

/**
 * 生成新的API密钥
 * @param userId 用户ID
 * @param expiresInDays 过期天数，默认为365天
 * @returns 生成的API密钥对象
 */
export async function generateApiKey(userId: string, expiresInDays = 365) {
  try {
    // 生成随机密钥
    const key = `nap_${generateRandomString(32)}`;
    
    // 计算过期时间
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    
    // 存储到数据库
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        key,
        user_id: userId,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        active: true
      })
      .select()
      .single();
    
    if (error) {
      console.error('生成API密钥错误:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('生成API密钥过程中出错:', error);
    throw error;
  }
}

/**
 * 生成指定长度的随机字符串
 * @param length 字符串长度
 * @returns 随机字符串
 */
function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}