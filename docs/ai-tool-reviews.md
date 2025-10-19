# AI工具评测自动化功能

## 功能概述

AI工具评测自动化功能允许系统自动为AI工具生成专业评测和评分，提高平台内容质量和用户体验。该功能包括：

- **自动评测生成**：根据设定的频率自动为工具生成评测内容
- **评测管理界面**：查看评测历史、手动触发评测生成
- **评测设置**：配置评测频率、每次处理的工具数量等参数
- **数据库集成**：将评测结果存储在数据库中，与工具信息关联

## 技术架构

### 核心组件

1. **评测生成API**：`/api/tools/reviews/generate` - 为单个工具生成评测
2. **批量评测API**：`/api/tools/reviews/batch` - 批量生成多个工具的评测
3. **评测历史API**：`/api/tools/reviews/history` - 获取评测历史记录
4. **评测状态API**：`/api/tools/reviews/status` - 获取和更新评测设置
5. **评测服务**：`lib/reviewService.ts` - 管理评测生成和调度
6. **评测历史管理**：`lib/reviewHistory.ts` - 管理评测历史记录
7. **评测调度器**：`lib/reviewScheduler.ts` - 初始化和触发评测任务

### 数据库结构

- **tool_review_history**：记录评测历史和状态
- **tool_reviews**：存储详细的评测内容
- **settings**：存储评测自动化设置
- **tools表扩展**：添加review_id、last_reviewed_at和next_review_at字段

## 管理界面

### 评测管理页面

路径：`/admin/tools/reviews`

功能：
- 查看评测历史记录
- 手动触发评测生成
- 按分类过滤评测生成
- 设置生成数量限制

### 评测设置页面

路径：`/admin/tools/reviews/settings`

功能：
- 启用/禁用自动评测
- 设置评测频率（每日/每周/每月）
- 配置每次处理的分类数量
- 配置每个分类处理的工具数量
- 查看当前自动化状态和下次计划运行时间

## 使用指南

### 配置自动评测

1. 访问 `/admin/tools/reviews/settings`
2. 启用自动评测
3. 选择适当的评测频率
4. 设置每次处理的分类数和工具数
5. 保存设置

### 手动生成评测

1. 访问 `/admin/tools/reviews`
2. 选择要处理的分类（或选择"所有分类"）
3. 设置要生成的评测数量
4. 点击"生成评测"按钮

### 查看评测历史

1. 访问 `/admin/tools/reviews`
2. 在页面下方查看评测历史记录表格
3. 使用分页控件浏览历史记录

## 开发者指南

### 环境变量

需要配置以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
API_KEY=your_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 自定义评测生成逻辑

要自定义评测生成逻辑，修改 `app/api/tools/reviews/generate/route.ts` 文件中的 `generateToolReview` 函数，替换模拟实现为实际的OpenAI API调用。

### 扩展评测字段

如需添加新的评测字段：

1. 更新 `migrations/tool_review_history.sql` 中的 `tool_reviews` 表结构
2. 修改 `app/api/tools/reviews/generate/route.ts` 中的 `ToolReviewResponse` 接口
3. 更新生成和保存评测的逻辑

## 故障排除

### 常见问题

1. **评测生成失败**
   - 检查OpenAI API密钥是否正确配置
   - 确保数据库连接正常
   - 验证工具表结构是否正确

2. **自动评测未运行**
   - 确认自动评测已启用
   - 检查服务器日志中是否有错误信息
   - 验证环境变量是否正确设置

3. **评测质量问题**
   - 调整 `generateToolReview` 函数中的提示词
   - 考虑使用更高级的OpenAI模型
   - 增加更多工具元数据以提高评测质量

## 未来计划

- 添加更多评测维度和评分标准
- 实现评测质量反馈机制
- 支持多语言评测生成
- 添加评测A/B测试功能
- 集成更多AI模型选项