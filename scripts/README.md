# 管理员权限设置脚本

这个目录包含了几个用于设置用户管理员权限的脚本。你可以选择其中一个脚本来运行，以将指定邮箱的用户设置为管理员角色。

## 快速开始（推荐方式）

使用提供的shell脚本可以快速设置管理员权限：

```bash
# 给脚本添加执行权限
chmod +x set-admin.sh

# 运行脚本（使用默认邮箱 dasean@yeah.com）
./set-admin.sh <SUPABASE_URL> <SERVICE_ROLE_KEY>

# 或者指定其他邮箱
./set-admin.sh <SUPABASE_URL> <SERVICE_ROLE_KEY> <YOUR_EMAIL>
```

## 前提条件

1. 确保已安装 Node.js
2. 确保已设置以下环境变量（如果不使用shell脚本）：
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase项目URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase服务角色密钥（具有管理员权限）

## 可用脚本

### 1. update-admin-role.js (推荐)

这个脚本使用Supabase Admin API来更新用户元数据，将用户角色设置为管理员。

```bash
# 运行脚本
node update-admin-role.js
```

### 2. set-admin-role.js

这个脚本尝试通过查询auth.users表来查找用户，然后使用Admin API更新用户元数据。

```bash
# 运行脚本
node set-admin-role.js
```

### 3. set-admin-role-sql.js

这个脚本使用SQL存储过程来更新用户元数据。它会先创建必要的数据库函数，然后执行更新操作。

```bash
# 运行脚本
node set-admin-role-sql.js
```

## 修改目标邮箱

默认情况下，这些脚本会将邮箱为 `dasean@yeah.net` 的用户设置为管理员。如果你需要设置其他邮箱，请编辑脚本文件并修改 `adminEmail` 变量的值。

## 故障排除

如果遇到问题，请检查：

1. 环境变量是否正确设置
2. 用户邮箱是否存在于Supabase Auth中
3. Supabase服务角色密钥是否有足够的权限
4. 查看控制台输出的错误信息

## 注意事项

- 这些脚本使用Supabase服务角色密钥，该密钥具有管理员权限，请妥善保管
- 运行脚本后，用户需要重新登录才能使新的角色设置生效