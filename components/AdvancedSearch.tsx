'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface SearchFilters {
  category: string;
  pricing: string;
  features: string[];
  rating: number;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  categories: string[];
}

export default function AdvancedSearch({ onSearch, categories }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    pricing: 'all',
    features: [],
    rating: 0
  });

  const features = [
    'API支持', '免费试用', '开源', '云端部署', 
    '移动端支持', '团队协作', '数据导出', '自定义模型'
  ];

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.length > 2) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, filters]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 搜索框 */}
      <div className="relative">
        <div className="flex">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索AI工具、功能、用例..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
          >
            <FunnelIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 高级筛选 */}
      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 分类筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部分类</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* 价格筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                价格
              </label>
              <select
                value={filters.pricing}
                onChange={(e) => setFilters(prev => ({ ...prev, pricing: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部价格</option>
                <option value="free">免费</option>
                <option value="freemium">免费增值</option>
                <option value="paid">付费</option>
              </select>
            </div>

            {/* 评分筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最低评分
              </label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>不限</option>
                <option value={3}>3星以上</option>
                <option value={4}>4星以上</option>
                <option value={4.5}>4.5星以上</option>
              </select>
            </div>
          </div>

          {/* 功能特性 */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              功能特性
            </label>
            <div className="flex flex-wrap gap-2">
              {features.map(feature => (
                <button
                  key={feature}
                  onClick={() => handleFeatureToggle(feature)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.features.includes(feature)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}