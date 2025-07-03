export class ErrorTracker {
  static async logError(error: Error, context?: any) {
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'server'
      };

      // 发送到后端记录
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      });
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }

  static trackUserAction(action: string, data?: any) {
    try {
      const actionData = {
        action,
        data,
        timestamp: new Date().toISOString(),
        userId: data?.userId || 'anonymous'
      };

      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionData)
      }).catch(console.error);
    } catch (e) {
      console.error('Failed to track action:', e);
    }
  }
}