'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Analytics } from '@/lib/analytics';

interface UserStats {
  toolsViewed: number;
  toolsBookmarked: number;
  searchesPerformed: number;
  recommendationsClicked: number;
  lastActiveDate: string;
  favoriteCategories: string[];
  usagePattern: 'heavy' | 'moderate' | 'light';
}

export default function UserDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchUserStats();
    Analytics.trackPageView('/dashboard');
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch('/api/user/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">个人仪表板</h1>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="浏览工具"
          value={stats?.toolsViewed || 0}
          icon="👁️"
          color="blue"
        />
        <StatCard
          title="收藏工具"
          value={stats?.toolsBookmarked || 0}
          icon="⭐"
          color="yellow"
        />
        <StatCard
          title="搜索次数"
          value={stats?.searchesPerformed || 0}
          icon="🔍"
          color="green"
        />
        <StatCard
          title="推荐点击"
          value={stats?.recommendationsClicked || 0}
          icon="🎯"
          color="purple"
        />
      </div>

      {/* 使用模式分析 */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">使用模式分析</h2>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm ${
            stats?.usagePattern === 'heavy' ? 'bg-red-100 text-red-800' :
            stats?.usagePattern === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {stats?.usagePattern === 'heavy' ? '重度用户' :
             stats?.usagePattern === 'moderate' ? '中度用户' : '轻度用户'}
          </div>
          <span className="text-gray-600">
            最后活跃：{stats?.lastActiveDate ? new Date(stats.lastActiveDate).toLocaleDateString() : '未知'}
          </span>
        </div>
      </div>

      {/* 偏好分析 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">偏好分析</h2>
        <div className="space-y-2">
          <p className="text-gray-600">您最感兴趣的工具类别：</p>
          <div className="flex flex-wrap gap-2">
            {stats?.favoriteCategories?.map((category, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {category}
              </span>
            )) || <span className="text-gray-400">暂无数据</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}