-- 修复函数参数类型
CREATE OR REPLACE FUNCTION increment_upvotes(tool_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE tools SET upvotes = upvotes + 1 WHERE id = tool_uuid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_upvotes(tool_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE tools SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = tool_uuid;
END;
$$ LANGUAGE plpgsql;

-- 修复表结构中的外键类型
ALTER TABLE upvotes ALTER COLUMN tool_id TYPE UUID;
ALTER TABLE bookmarks ALTER COLUMN tool_id TYPE UUID;

-- 添加upvotes和bookmarks表
CREATE TABLE IF NOT EXISTS upvotes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id INTEGER REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id INTEGER REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- 为tools表添加upvotes字段
ALTER TABLE tools ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0;