import { supabase } from './supabaseClient';

// 同步历史记录接口
export interface SyncHistory {
  id?: number;
  added: number;
  skipped: number;
  errors: number;
  status: 'success' | 'error';
  error_message?: string;
  created_at?: string;
}

// 添加同步历史记录
export async function addSyncHistory(result: {
  added: number;
  skipped: number;
  errors: number;
}, status: 'success' | 'error' = 'success', errorMessage?: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tool_sync_history')
      .insert({
        added: result.added,
        skipped: result.skipped,
        errors: result.errors,
        status: status,
        error_message: errorMessage
      });
    
    if (error) {
      console.error('添加同步历史记录失败:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('添加同步历史记录时发生错误:', err);
    return false;
  }
}

// 获取最近的同步历史记录
export async function getLatestSyncHistory(): Promise<SyncHistory | null> {
  try {
    const { data, error } = await supabase
      .from('tool_sync_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('获取最近同步历史记录失败:', error);
      return null;
    }
    
    return data as SyncHistory;
  } catch (err) {
    console.error('获取最近同步历史记录时发生错误:', err);
    return null;
  }
}

// 获取同步历史记录列表
export async function getSyncHistoryList(page: number = 1, pageSize: number = 10): Promise<{
  data: SyncHistory[];
  total: number;
  totalPages: number;
}> {
  try {
    // 计算偏移量
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // 查询同步历史记录
    const { data, error, count } = await supabase
      .from('tool_sync_history')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) {
      console.error('获取同步历史记录列表失败:', error);
      return { data: [], total: 0, totalPages: 0 };
    }
    
    return {
      data: data as SyncHistory[],
      total: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (err) {
    console.error('获取同步历史记录列表时发生错误:', err);
    return { data: [], total: 0, totalPages: 0 };
  }
}