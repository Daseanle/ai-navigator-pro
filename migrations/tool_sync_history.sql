-- 创建工具同步历史记录表
CREATE TABLE IF NOT EXISTS tool_sync_history (
  id SERIAL PRIMARY KEY,
  added INTEGER NOT NULL DEFAULT 0,
  skipped INTEGER NOT NULL DEFAULT 0,
  errors INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(10) NOT NULL CHECK (status IN ('success', 'error')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_tool_sync_history_created_at ON tool_sync_history(created_at);
CREATE INDEX IF NOT EXISTS idx_tool_sync_history_status ON tool_sync_history(status);

-- 添加初始数据（可选）
INSERT INTO tool_sync_history (added, skipped, errors, status, created_at)
VALUES 
  (5, 10, 0, 'success', NOW() - INTERVAL '7 days'),
  (3, 12, 0, 'success', NOW() - INTERVAL '6 days'),
  (0, 15, 1, 'error', NOW() - INTERVAL '5 days'),
  (8, 7, 0, 'success', NOW() - INTERVAL '4 days'),
  (2, 13, 0, 'success', NOW() - INTERVAL '3 days'),
  (4, 11, 0, 'success', NOW() - INTERVAL '2 days'),
  (6, 9, 0, 'success', NOW() - INTERVAL '1 day');