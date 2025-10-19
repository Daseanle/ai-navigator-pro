// 更新用户为管理员角色的脚本
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

async function updateAdminRole() {
  try {
    // 1. 获取用户列表
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('获取用户列表时出错:', listError.message);
      process.exit(1);
    }
    
    // 2. 查找目标用户
    const user = users.find(u => u.email === adminEmail);
    
    if (!user) {
      console.error(`未找到邮箱为 ${adminEmail} 的用户`);
      process.exit(1);
    }
    
    console.log(`找到用户: ${user.id}, 邮箱: ${user.email}`);
    
    // 3. 更新用户元数据
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { user_metadata: { role: 'admin' } }
    );
    
    if (updateError) {
      console.error('更新用户角色时出错:', updateError.message);
      process.exit(1);
    }
    
    console.log(`成功将用户 ${adminEmail} 的角色设置为管理员！`);
    console.log('更新后的用户数据:', data);
    
  } catch (error) {
    console.error('发生未知错误:', error.message);
    process.exit(1);
  }
}

updateAdminRole();