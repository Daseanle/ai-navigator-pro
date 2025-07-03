export class Analytics {
  static trackPageView(url: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }
  }

  static trackEvent(action: string, category: string, label?: string, value?: number) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  }

  static trackToolUsage(toolId: string, action: 'view' | 'bookmark' | 'rate') {
    this.trackEvent(action, 'tool_interaction', toolId);
  }

  // 新增：用户行为追踪
  static trackUserBehavior(userId: string, behavior: string, metadata?: any) {
    this.trackEvent('user_behavior', 'engagement', `${userId}_${behavior}`);
    
    // 发送到后端进行深度分析
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/behavior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          behavior,
          metadata,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(console.error);
    }
  }

  // 新增：搜索行为分析
  static trackSearch(query: string, results: number, filters?: any) {
    this.trackEvent('search', 'query', query, results);
    
    // 记录搜索模式用于优化
    this.trackUserBehavior('anonymous', 'search', {
      query,
      resultsCount: results,
      filters,
      searchTime: new Date().toISOString()
    });
  }

  // 新增：推荐系统效果追踪
  static trackRecommendation(type: string, toolId: string, position: number, clicked: boolean) {
    this.trackEvent('recommendation', clicked ? 'click' : 'view', `${type}_${toolId}`, position);
  }

  // 新增：性能监控
  static trackPerformance(metric: string, value: number, context?: string) {
    this.trackEvent('performance', metric, context, value);
    
    // 记录性能数据
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = {
        metric,
        value,
        context,
        timestamp: Date.now(),
        navigation: window.performance.getEntriesByType('navigation')[0],
        memory: (window.performance as any).memory
      };
      
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perfData)
      }).catch(console.error);
    }
  }
}