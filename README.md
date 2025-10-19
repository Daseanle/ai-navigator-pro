# AI Navigator Pro

一个现代化的AI工具导航平台，帮助用户发现、比较和使用最新的AI工具。

这是一个基于 [Next.js](https://nextjs.org) 的项目，使用 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 创建。

## 功能特点

- **AI工具导航**：浏览、搜索和过滤各种AI工具
- **工具详情**：查看工具的详细信息、评价和评论
- **工具比较**：并排比较不同AI工具的功能和性能
- **用户管理**：用户注册、登录和个人资料管理
- **收藏功能**：用户可以收藏喜欢的工具
- **管理后台**：完整的管理员控制台
- **工具同步**：自动从外部API获取并添加新工具
- **SEO自动化**：自动生成和优化内容

## 安装和设置

### 前提条件

- Node.js 16+
- npm 或 yarn
- Supabase 账户

### 环境变量

创建一个 `.env.local` 文件，并添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
TOOLS_SYNC_API_KEY=your-custom-api-key-for-tools-sync
TOOLS_SYNC_INTERVAL_HOURS=24
```

### 数据库迁移

在Supabase中执行 `migrations` 目录下的SQL文件，按照以下顺序：

- 首先执行基础表结构创建脚本
- 然后执行 `tool_sync_history.sql` 创建工具同步历史记录表

## 开始使用

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 工具同步功能

### 自动同步

系统会根据 `TOOLS_SYNC_INTERVAL_HOURS` 环境变量设置的间隔时间自动同步工具。默认为24小时。

### 手动同步

1. 访问管理员控制台：`/admin`
2. 点击「工具同步管理」
3. 输入API密钥（在环境变量 `TOOLS_SYNC_API_KEY` 中设置）
4. 点击「开始同步」按钮

### 同步历史记录

同步页面会显示：

- 同步状态（上次同步时间、状态、下次计划同步）
- 同步结果（新增工具、已存在工具、错误数量）
- 同步历史记录（包含所有历史同步操作的详细信息）

## 了解更多

要了解更多关于Next.js的信息，请查看以下资源：

- [Next.js文档](https://nextjs.org/docs) - 了解Next.js的功能和API。
- [学习Next.js](https://nextjs.org/learn) - 一个交互式Next.js教程。

你可以查看[Next.js GitHub仓库](https://github.com/vercel/next.js) - 欢迎你的反馈和贡献！

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# ai-navigator-pro
