export class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // 请求通知权限
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // 发送新工具通知
  async notifyNewTool(tool: any) {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    const notification = new Notification('发现新的AI工具！', {
      body: `${tool.name} - ${tool.description}`,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: `new-tool-${tool.id}`,
      data: { toolId: tool.id, type: 'new-tool' },
      actions: [
        { action: 'view', title: '查看详情' },
        { action: 'bookmark', title: '收藏' }
      ]
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = `/tool/${tool.slug}`;
      notification.close();
    };
  }

  // 发送个性化推荐通知
  async notifyRecommendation(recommendations: any[]) {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    const notification = new Notification('为您推荐新工具', {
      body: `基于您的使用习惯，我们为您推荐了 ${recommendations.length} 个新工具`,
      icon: '/icons/icon-192x192.png',
      tag: 'recommendations',
      data: { type: 'recommendations', count: recommendations.length }
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = '/recommendations';
      notification.close();
    };
  }

  // 发送使用提醒
  async notifyUsageReminder() {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    const notification = new Notification('探索更多AI工具', {
      body: '发现新的AI工具，提升您的工作效率！',
      icon: '/icons/icon-192x192.png',
      tag: 'usage-reminder'
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = '/tools';
      notification.close();
    };
  }
}