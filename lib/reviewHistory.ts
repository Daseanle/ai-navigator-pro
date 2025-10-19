import { supabase } from './supabaseClient';

export interface ReviewHistory {
  id: number;
  created_at: string;
  status: 'success' | 'error';
  tools_added: number;
  tools_skipped: number;
  tools_error: number;
  error_details?: string;
}

// 添加评测历史记录
export async function addReviewHistory(
  result: { added: number; skipped: number; errors: number },
  status: 'success' | 'error' = 'success',
  errorDetails?: string
) {
  try {
    const { data, error } = await supabase
      .from('tool_review_history')
      .insert({
        status,
        tools_added: result.added,
        tools_skipped: result.skipped,
        tools_error: result.errors,
        error_details: errorDetails,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('添加评测历史记录失败:', error);
      return null;
    }

    return data as ReviewHistory;
  } catch (error) {
    console.error('添加评测历史记录异常:', error);
    return null;
  }
}

// 获取最新的评测历史记录
export async function getLatestReviewHistory(): Promise<ReviewHistory | null> {
  try {
    const { data, error } = await supabase
      .from('tool_review_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('获取最新评测历史记录失败:', error);
      return null;
    }

    return data as ReviewHistory;
  } catch (error) {
    console.error('获取最新评测历史记录异常:', error);
    return null;
  }
}

// 获取评测历史记录列表
export async function getReviewHistoryList(
  page: number = 1,
  pageSize: number = 10
): Promise<{ data: ReviewHistory[]; count: number }> {
  try {
    // 计算分页偏移量
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // 获取评测历史记录和总数
    const { data, error, count } = await supabase
      .from('tool_review_history')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('获取评测历史记录列表失败:', error);
      return { data: [], count: 0 };
    }

    return { data: data as ReviewHistory[], count: count || 0 };
  } catch (error) {
    console.error('获取评测历史记录列表异常:', error);
    return { data: [], count: 0 };
  }
}

// 计算下次评测时间
export function calculateNextReviewTime(frequency: string): Date {
  const now = new Date();
  
  switch (frequency) {
    case 'daily':
      return new Date(now.setDate(now.getDate() + 1));
    case 'weekly':
      return new Date(now.setDate(now.getDate() + 7));
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() + 1));
    case 'quarterly':
      return new Date(now.setMonth(now.getMonth() + 3));
    default:
      return new Date(now.setDate(now.getDate() + 7)); // 默认一周
  }
}