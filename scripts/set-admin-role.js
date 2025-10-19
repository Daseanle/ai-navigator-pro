// 设置管理员权限脚本
const { createClient } = require('@supabase/supabase-js');

// 创建Supabase客户端（使用service role key）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('错误：环境变量未设置。请确保设置了NEXT_PUBLIC_SUPABASE_URL和SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 要设置为管理员的邮箱
const adminEmail = 'dasean@yeah.net';

async function setAdminRole() {
  try {
    // 1. 通过邮箱查找用户
    const { data: users, error: userError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', adminEmail)
      .single();

    if (userError) {
      if (userError.code === 'PGRST116') {
        console.error(`错误：未找到邮箱为 ${adminEmail} 的用户`);
      } else {
        console.error('查询用户时出错:', userError.message);
      }
      process.exit(1);
    }

    if (!users) {
      console.error(`错误：未找到邮箱为 ${adminEmail} 的用户`);
      process.exit(1);
    }

    const userId = users.id;
    console.log(`找到用户 ID: ${userId}, 邮箱: ${adminEmail}`);

    // 2. 更新用户元数据，设置角色为admin
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: { role: 'admin' } }
    );

    if (updateError) {
      console.error('更新用户角色时出错:', updateError.message);
      process.exit(1);
    }

    console.log(`成功将用户 ${adminEmail} 的角色设置为管理员！`);
  } catch (error) {
    console.error('发生未知错误:', error.message);
    process.exit(1);
  }
}

setAdminRole();