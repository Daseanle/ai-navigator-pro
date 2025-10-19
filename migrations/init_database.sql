-- 创建基础表结构
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  tagline TEXT,
  logo_url TEXT,
  website_url TEXT UNIQUE,
  pricing VARCHAR(50) DEFAULT 'Free',
  has_api BOOLEAN DEFAULT false,
  upvotes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建工具标签关联表
CREATE TABLE IF NOT EXISTS tool_tags (
  id SERIAL PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(tool_id, tag_id)
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户资料表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  username VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建评测表
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  conclusion TEXT,
  pros JSONB DEFAULT '[]'::jsonb,
  cons JSONB DEFAULT '[]'::jsonb,
  score_overall DECIMAL(3,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入示例标签
INSERT INTO tags (name) VALUES 
('AI视频生成'),
('内容创作'),
('图像生成'),
('文本生成'),
('代码辅助'),
('数据分析'),
('设计工具'),
('音频处理'),
('自动化'),
('机器学习')
ON CONFLICT (name) DO NOTHING;

-- 插入示例工具数据
INSERT INTO tools (slug, name, tagline, logo_url, website_url, pricing, has_api, upvotes_count) VALUES 
('runway', 'Runway ML', '下一代创意工具套件，由机器学习驱动', 'https://placehold.co/200x200?text=Runway', 'https://runwayml.com', 'Freemium', true, 1250),
('midjourney', 'Midjourney', '通过AI创造令人惊叹的艺术作品', 'https://placehold.co/200x200?text=Midjourney', 'https://midjourney.com', 'Paid', true, 2100),
('chatgpt', 'ChatGPT', '强大的AI对话助手，帮助你完成各种任务', 'https://placehold.co/200x200?text=ChatGPT', 'https://chat.openai.com', 'Freemium', true, 3500),
('github-copilot', 'GitHub Copilot', 'AI编程助手，提升开发效率', 'https://placehold.co/200x200?text=Copilot', 'https://github.com/features/copilot', 'Paid', true, 1800),
('stable-diffusion', 'Stable Diffusion', '开源的AI图像生成模型', 'https://placehold.co/200x200?text=SD', 'https://stability.ai', 'Free', true, 1600),
('notion-ai', 'Notion AI', '智能笔记和知识管理工具', 'https://placehold.co/200x200?text=Notion', 'https://notion.so', 'Freemium', true, 1400),
('claude', 'Claude', 'Anthropic开发的AI助手', 'https://placehold.co/200x200?text=Claude', 'https://claude.ai', 'Freemium', true, 1300),
('figma-ai', 'Figma AI', '设计工具中的AI功能', 'https://placehold.co/200x200?text=Figma', 'https://figma.com', 'Freemium', false, 900)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  logo_url = EXCLUDED.logo_url,
  pricing = EXCLUDED.pricing,
  has_api = EXCLUDED.has_api,
  upvotes_count = EXCLUDED.upvotes_count;

-- 插入工具标签关联
INSERT INTO tool_tags (tool_id, tag_id)
SELECT t.id, tag.id
FROM tools t, tags tag
WHERE 
  (t.slug = 'runway' AND tag.name IN ('AI视频生成', '内容创作')) OR
  (t.slug = 'midjourney' AND tag.name IN ('图像生成', '内容创作')) OR
  (t.slug = 'chatgpt' AND tag.name IN ('文本生成', '内容创作')) OR
  (t.slug = 'github-copilot' AND tag.name IN ('代码辅助', '自动化')) OR
  (t.slug = 'stable-diffusion' AND tag.name IN ('图像生成', '机器学习')) OR
  (t.slug = 'notion-ai' AND tag.name IN ('文本生成', '自动化')) OR
  (t.slug = 'claude' AND tag.name IN ('文本生成', '内容创作')) OR
  (t.slug = 'figma-ai' AND tag.name IN ('设计工具', '自动化'))
ON CONFLICT (tool_id, tag_id) DO NOTHING;

-- 插入示例评测数据
INSERT INTO reviews (tool_id, conclusion, pros, cons, score_overall)
SELECT 
  t.id,
  CASE t.slug
    WHEN 'runway' THEN 'Runway ML是一个功能强大的AI视频生成平台，特别适合创意工作者和内容创作者。'
    WHEN 'midjourney' THEN 'Midjourney在AI艺术生成领域表现出色，能够创造出令人惊叹的视觉作品。'
    WHEN 'chatgpt' THEN 'ChatGPT是目前最受欢迎的AI对话助手之一，在多个领域都有出色表现。'
    WHEN 'github-copilot' THEN 'GitHub Copilot显著提升了开发者的编程效率，是优秀的AI编程助手。'
    ELSE '这是一个优秀的AI工具，值得尝试。'
  END,
  CASE t.slug
    WHEN 'runway' THEN '["强大的视频生成能力", "用户界面友好", "持续更新功能"]'::jsonb
    WHEN 'midjourney' THEN '["艺术质量极高", "社区活跃", "风格多样"]'::jsonb
    WHEN 'chatgpt' THEN '["对话自然流畅", "知识面广泛", "响应速度快"]'::jsonb
    WHEN 'github-copilot' THEN '["代码建议准确", "支持多种语言", "集成度高"]'::jsonb
    ELSE '["功能丰富", "易于使用"]'::jsonb
  END,
  CASE t.slug
    WHEN 'runway' THEN '["价格较高", "需要学习成本"]'::jsonb
    WHEN 'midjourney' THEN '["需要Discord使用", "商业使用限制"]'::jsonb
    WHEN 'chatgpt' THEN '["有时会产生错误信息", "知识截止时间限制"]'::jsonb
    WHEN 'github-copilot' THEN '["需要付费订阅", "偶尔建议不准确"]'::jsonb
    ELSE '["学习成本", "价格考虑"]'::jsonb
  END,
  CASE t.slug
    WHEN 'runway' THEN 8.5
    WHEN 'midjourney' THEN 9.0
    WHEN 'chatgpt' THEN 9.2
    WHEN 'github-copilot' THEN 8.8
    ELSE 8.0
  END
FROM tools t
WHERE t.slug IN ('runway', 'midjourney', 'chatgpt', 'github-copilot', 'stable-diffusion', 'notion-ai', 'claude', 'figma-ai')
ON CONFLICT DO NOTHING;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_created_at ON tools(created_at);
CREATE INDEX IF NOT EXISTS idx_tool_tags_tool_id ON tool_tags(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_tags_tag_id ON tool_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_comments_tool_id ON comments(tool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON reviews(tool_id);