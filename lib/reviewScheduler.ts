import { scheduleReviewGeneration } from './reviewService';

/**
 * 初始化评测调度器
 * 在应用启动时调用此函数以启动自动评测服务
 */
export function initReviewScheduler() {
  // 仅在生产环境和服务器端运行
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('🔄 初始化工具评测调度器...');
    
    // 启动评测调度服务
    scheduleReviewGeneration();
    
    console.log('✅ 工具评测调度器已启动');
  }
}

/**
 * 手动触发评测生成
 * @param categoryFilter 可选的分类过滤器
 * @param limit 生成数量限制
 * @returns 生成结果
 */
export async function triggerReviewGeneration(categoryFilter?: string[], limit?: number) {
  try {
    // 调用批量生成API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/tools/reviews/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY || ''}`
      },
      body: JSON.stringify({
        categoryFilter: categoryFilter || [],
        limit: limit || 5,
        skipExisting: true
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '触发评测生成失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('触发评测生成错误:', error);
    throw error;
  }
}