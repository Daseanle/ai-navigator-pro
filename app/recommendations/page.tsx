'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ToolCard from '@/components/ToolCard';
import { ErrorTracker } from '@/lib/errorTracking';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hybrid');
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkAuthAndFetch();
  }, [activeTab]);

  const checkAuthAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    fetchRecommendations();
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/recommendations?type=${activeTab}&limit=20`);
      const data = await response.json();
      
      if (response.ok) {
        setRecommendations(data.recommendations || []);
      } else {
        throw new Error(data.error || 'Failed to fetch recommendations');
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      ErrorTracker.logError(error as Error, { context: 'fetchRecommendations', type: activeTab });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'hybrid', name: '智能推荐', description: '基于多种算法的综合推荐' },
    { id: 'collaborative', name: '协同过滤', description: '基于相似用户的推荐' },
    { id: 'content', name: '内容推荐', description: '基于你的偏好推荐' },
    { id: 'popular', name: '热门推荐', description: '当前最受欢迎的工具' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          个性化推荐
        </h1>
        <p className="text-gray-600">
          基于你的使用习惯和偏好，为你推荐最适合的AI工具
        </p>
      </div>

      {/* 推荐类型标签 */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* 推荐结果 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((tool: any) => (
            <div key={tool.id} className="relative">
              <ToolCard tool={tool} />
              {tool.recommendationReasons && (
                <div className="absolute top-2 right-2">
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {tool.recommendationReasons[0]}
                  </div>
                </div>
              )}
              {tool.recommendationScore && (
                <div className="absolute top-2 left-2">
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    匹配度: {Math.round(tool.recommendationScore)}%
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            暂无推荐内容
          </p>
          <p className="text-gray-400 mb-6">
            多使用平台功能，我们会为你提供更精准的推荐
          </p>
          <a
            href="/tools"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            浏览所有工具
          </a>
        </div>
      )}
    </div>
  );
}