#!/bin/bash
echo "🔧 开始修复构建问题..."

# 1. 修复图标导入
echo "📝 修复图标导入..."
sed -i '' 's/import { Search, Filter, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, Tag, X } from/import { Search, Filter, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, Tag, X, ChevronLeft, ChevronRight } from/' app/tools/page.tsx

# 2. 运行构建测试
echo "🏗️ 测试构建..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo "🚀 提交更改..."
    git add .
    git commit -m "fix: resolve all build errors - fix variable scope, add missing icons, update ESLint config"
    git push
    echo "🎉 部署完成！"
else
    echo "❌ 构建仍有问题，请检查错误信息"
fi