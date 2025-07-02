-- 创建工具评测历史记录表
CREATE TABLE IF NOT EXISTS tool_review_history (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  tools_added INTEGER NOT NULL DEFAULT 0,
  tools_skipped INTEGER NOT NULL DEFAULT 0,
  tools_error INTEGER NOT NULL DEFAULT 0,
  error_details TEXT
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tool_review_history_created_at ON tool_review_history(created_at);
CREATE INDEX IF NOT EXISTS idx_tool_review_history_status ON tool_review_history(status);

-- 创建设置表（如果不存在）
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加工具表的评测相关字段（如果不存在）
DO $$ 
BEGIN
  -- 添加 review_id 字段
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tools' AND column_name = 'review_id') THEN
    ALTER TABLE tools ADD COLUMN review_id UUID;
  END IF;
  
  -- 添加 last_reviewed_at 字段
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tools' AND column_name = 'last_reviewed_at') THEN
    ALTER TABLE tools ADD COLUMN last_reviewed_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  -- 添加 next_review_at 字段
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tools' AND column_name = 'next_review_at') THEN
    ALTER TABLE tools ADD COLUMN next_review_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- 创建工具评测表
CREATE TABLE IF NOT EXISTS tool_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  conclusion TEXT NOT NULL,
  pros JSONB NOT NULL DEFAULT '[]'::jsonb,
  cons JSONB NOT NULL DEFAULT '[]'::jsonb,
  overall_rating DECIMAL(3,1) NOT NULL CHECK (overall_rating >= 0 AND overall_rating <= 10),
  usability_rating DECIMAL(3,1) NOT NULL CHECK (usability_rating >= 0 AND usability_rating <= 10),
  features_rating DECIMAL(3,1) NOT NULL CHECK (features_rating >= 0 AND features_rating <= 10),
  performance_rating DECIMAL(3,1) NOT NULL CHECK (performance_rating >= 0 AND performance_rating <= 10),
  innovation_rating DECIMAL(3,1) NOT NULL CHECK (innovation_rating >= 0 AND innovation_rating <= 10),
  pricing_rating DECIMAL(3,1) NOT NULL CHECK (pricing_rating >= 0 AND pricing_rating <= 10),
  use_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
  expert_opinion TEXT,
  pricing_note TEXT
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tool_reviews_tool_id ON tool_reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_reviews_overall_rating ON tool_reviews(overall_rating);

-- 添加外键约束
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'tools' AND column_name = 'review_id'
  ) THEN
    ALTER TABLE tools 
    ADD CONSTRAINT fk_tools_review_id 
    FOREIGN KEY (review_id) 
    REFERENCES tool_reviews(id) 
    ON DELETE SET NULL;
  END IF;
END $$;