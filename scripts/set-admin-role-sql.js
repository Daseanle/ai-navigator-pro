// 使用SQL设置管理员权限脚本
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
    // 使用SQL直接更新用户元数据
    const { data, error } = await supabase.rpc('set_admin_role', { 
      admin_email: adminEmail 
    });

    if (error) {
      console.error('更新用户角色时出错:', error.message);
      process.exit(1);
    }

    if (data && data.success) {
      console.log(`成功将用户 ${adminEmail} 的角色设置为管理员！`);
    } else {
      console.log(`未找到用户 ${adminEmail} 或更新失败`);
    }
  } catch (error) {
    console.error('发生未知错误:', error.message);
    process.exit(1);
  }
}

// 首先创建存储过程
async function createStoredProcedure() {
  try {
    const { error } = await supabase.rpc('create_set_admin_role_function');
    
    if (error) {
      // 如果函数已存在，忽略错误
      if (error.message.includes('already exists')) {
        console.log('存储过程已存在，继续执行...');
        return true;
      }
      console.error('创建存储过程时出错:', error.message);
      return false;
    }
    
    console.log('成功创建存储过程');
    return true;
  } catch (error) {
    console.error('创建存储过程时发生未知错误:', error.message);
    return false;
  }
}

// 创建存储过程的SQL
async function setupDatabase() {
  try {
    // 创建存储过程
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE OR REPLACE FUNCTION public.set_admin_role(admin_email TEXT)
        RETURNS json
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          user_id UUID;
          success BOOLEAN := false;
        BEGIN
          -- 查找用户ID
          SELECT id INTO user_id FROM auth.users WHERE email = admin_email;
          
          -- 如果找到用户，更新其元数据
          IF user_id IS NOT NULL THEN
            UPDATE auth.users
            SET raw_user_meta_data = 
              CASE 
                WHEN raw_user_meta_data IS NULL THEN jsonb_build_object('role', 'admin')
                ELSE raw_user_meta_data || jsonb_build_object('role', 'admin')
              END
            WHERE id = user_id;
            
            success := true;
          END IF;
          
          RETURN json_build_object('success', success, 'user_id', user_id);
        END;
        $$;
        
        -- 创建辅助函数执行SQL
        CREATE OR REPLACE FUNCTION public.exec_sql(sql_query TEXT)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE sql_query;
        END;
        $$;
      `
    });

    if (error) {
      console.error('设置数据库时出错:', error.message);
      return false;
    }
    
    console.log('成功设置数据库函数');
    return true;
  } catch (error) {
    console.error('设置数据库时发生未知错误:', error.message);
    return false;
  }
}

async function main() {
  const dbSetupSuccess = await setupDatabase();
  if (dbSetupSuccess) {
    await setAdminRole();
  }
}

main();