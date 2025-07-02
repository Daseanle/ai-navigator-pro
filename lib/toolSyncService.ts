import { scheduleToolSync } from './autoTools';
import { addSyncHistory } from './syncHistory';

let syncTimer: NodeJS.Timeout | null = null;

// 启动工具同步服务
export async function startToolSyncService() {
  // 检查是否已经启动
  if (syncTimer) {
    console.log('工具同步服务已经在运行中');
    return;
  }
  
  try {
    // 获取同步间隔时间（小时）
    const intervalHours = parseInt(process.env.TOOLS_SYNC_INTERVAL_HOURS || '24', 10);
    
    console.log(`启动工具同步服务，间隔时间: ${intervalHours}小时`);
    
    // 启动定时同步
    syncTimer = await scheduleToolSync(intervalHours);
    
    // 记录服务启动信息
    await addSyncHistory(
      { added: 0, skipped: 0, errors: 0 },
      'success',
      '工具同步服务已启动'
    );
    
    console.log('工具同步服务已成功启动');
  } catch (error) {
    console.error('启动工具同步服务失败:', error);
  }
}

// 停止工具同步服务
export function stopToolSyncService() {
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = null;
    console.log('工具同步服务已停止');
  }
}