#!/bin/bash

# 设置管理员权限的Shell脚本

# 检查是否提供了Supabase URL和Service Role Key
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "使用方法: ./set-admin.sh <SUPABASE_URL> <SERVICE_ROLE_KEY> [EMAIL]"
  echo "示例: ./set-admin.sh https://xxxxxxxxxxxx.supabase.co eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxx dasean@yeah.com"
  exit 1
fi

# 设置环境变量
export NEXT_PUBLIC_SUPABASE_URL="$1"
export SUPABASE_SERVICE_ROLE_KEY="$2"

# 检查是否提供了邮箱参数
if [ ! -z "$3" ]; then
  # 如果提供了邮箱参数，则修改脚本中的邮箱
  EMAIL="$3"
  echo "将使用邮箱: $EMAIL"
  
  # 使用sed替换脚本中的邮箱
  sed -i "" "s/const adminEmail = 'dasean@yeah.net';/const adminEmail = '$EMAIL';/g" update-admin-role.js
else
  echo "将使用默认邮箱: dasean@yeah.net"
fi

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
  echo "错误: 未找到Node.js，请先安装Node.js"
  exit 1
fi

# 检查是否安装了必要的npm包
if [ ! -d "../node_modules/@supabase/supabase-js" ]; then
  echo "正在安装必要的依赖..."
  cd ..
  npm install @supabase/supabase-js
  cd scripts
fi

# 运行脚本
echo "正在运行更新管理员权限脚本..."
node update-admin-role.js

# 恢复默认邮箱
if [ ! -z "$3" ]; then
  sed -i "" "s/const adminEmail = '$EMAIL';/const adminEmail = 'dasean@yeah.net';/g" update-admin-role.js
fi

# 清除环境变量
unset NEXT_PUBLIC_SUPABASE_URL
unset SUPABASE_SERVICE_ROLE_KEY