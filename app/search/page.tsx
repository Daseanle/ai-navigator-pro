'use client';

import { useState, useEffect } from 'react';
import AdvancedSearch from '@/components/AdvancedSearch';
import ToolCard from '@/components/ToolCard';
import { ErrorTracker } from '@/lib/errorTracking';

interface SearchFilters {
  category: string;
  pricing: string;
  features: string[];
  rating: number;
}

export default function SearchPage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);

  // 获取分类列表
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/tools/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      ErrorTracker.logError(error as Error, { context: 'fetchCategories' });
    }
  };

  const handleSearch = async (query: string, filters: SearchFilters) => {
    setLoading(true);
    try {
      // 构建查询参数
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.pricing !== 'all') params.append('pricing', filters.pricing);
      if (filters.rating > 0) params.append('rating', filters.rating.toString());
      if (filters.features.length > 0) {
        params.append('features', filters.features.join(','));
      }
      params.append('limit', '20');
      params.append('offset', '0');

      const response = await fetch(`/api/search/fulltext?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setTools(data.tools || []);
        setTotal(data.total || 0);
        setHasMore(data.hasMore || false);
        
        // 记录搜索行为
        ErrorTracker.trackUserAction('search', {
          query,
          filters,
          resultCount: data.tools?.length || 0
        });
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      ErrorTracker.logError(error as Error, { context: 'search', query, filters });
      setTools([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          智能搜索
        </h1>
        <p className="text-gray-600 mb-6">
          使用高级筛选功能找到最适合你的AI工具
        </p>
        
        <AdvancedSearch 
          onSearch={handleSearch}
          categories={categories}
        />
      </div>

      {/* 搜索结果 */}
      <div className="mb-6">
        {total > 0 && (
          <p className="text-gray-600">
            找到 {total} 个相关工具
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">搜索中...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool: any) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}

      {tools.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            没有找到相关工具
          </p>
          <p className="text-gray-400">
            尝试调整搜索条件或浏览所有工具
          </p>
        </div>
      )}
    </div>
  );
}