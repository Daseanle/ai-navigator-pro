'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSearchParams } from 'next/navigation';
import ToolCard from '@/components/ToolCard';
import { Search, Filter, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, Tag, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ToolDetail } from '@/types';

// 将使用 useSearchParams 的逻辑提取到单独的组件中
function ToolsContent() {
  const [tools, setTools] = useState<Partial<ToolDetail>[]>([]);
  const [filteredTools, setFilteredTools] = useState<Partial<ToolDetail>[]>([]);
  const [paginatedTools, setPaginatedTools] = useState<Partial<ToolDetail>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<{name: string, count: number}[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState<string>('default');
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // 每页显示12个工具
  const [totalPages, setTotalPages] = useState(1);
  const [showPageSizeOptions, setShowPageSizeOptions] = useState(false);
  
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  
  // 从URL获取初始标签、价格筛选条件、排序选项、页码和每页显示数量
  useEffect(() => {
    const tagParam = searchParams.get('tag');
    const pricingParam = searchParams.get('pricing');
    const pageParam = searchParams.get('page');
    const pageSizeParam = searchParams.get('pageSize');
    const sortParam = searchParams.get('sort');
    
    if (tagParam) {
      setSelectedTags([tagParam]);
    }
    
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    if (pricingParam) {
      setSelectedPricing([pricingParam]);
    }
    
    if (sortParam) {
      const validSortOptions = ['rating_high_to_low', 'rating_low_to_high', 'name_asc', 'name_desc', 'newest'];
      if (validSortOptions.includes(sortParam)) {
        setSortOption(sortParam);
      }
    }
    
    if (pageParam) {
      const page = parseInt(pageParam);
      if (!isNaN(page) && page > 0) {
        setCurrentPage(page);
      }
    }
    
    if (pageSizeParam) {
      const size = parseInt(pageSizeParam);
      if (!isNaN(size) && [6, 12, 24, 48].includes(size)) {
        setItemsPerPage(size);
      }
    }
  }, [searchParams]);
  
  // 获取工具数据
  useEffect(() => {
    async function fetchTools() {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('tools')
        .select(`
          id, slug, name, tagline, logo_url, pricing, upvotes_count,
          reviews ( score_overall ),
          tags ( name )
        `);
      
      if (error) {
        console.error('Error fetching tools:', error);
      } else if (data) {
        setTools(data);
        
        // 提取所有可用标签及其计数
        const tagsMap = new Map<string, number>();
        data.forEach(tool => {
          tool.tags?.forEach(tag => {
            const count = tagsMap.get(tag.name) || 0;
            tagsMap.set(tag.name, count + 1);
          });
        });
        
        const tagsArray = Array.from(tagsMap.entries()).map(([name, count]) => ({ name, count }));
        tagsArray.sort((a, b) => b.count - a.count); // 按计数降序排序
        setAvailableTags(tagsArray);
      }
      
      setLoading(false);
    }
    
    fetchTools();
  }, [supabase]);
  
  // 筛选和排序工具
  useEffect(() => {
    let results = [...tools];
    
    // 按搜索词筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(tool => 
        tool.name?.toLowerCase().includes(query) || 
        tool.tagline?.toLowerCase().includes(query)
      );
    }
    
    // 按标签筛选
    if (selectedTags.length > 0) {
      results = results.filter(tool => 
        tool.tags?.some(tag => selectedTags.includes(tag.name))
      );
    }
    
    // 按价格筛选
    if (selectedPricing.length > 0) {
      results = results.filter(tool => 
        selectedPricing.includes(tool.pricing || '')
      );
    }
    
    // 排序工具
    switch (sortOption) {
      case 'rating-high':
        results.sort((a, b) => {
          const ratingA = a.reviews?.[0]?.score_overall || 0;
          const ratingB = b.reviews?.[0]?.score_overall || 0;
          return ratingB - ratingA;
        });
        break;
      case 'rating-low':
        results.sort((a, b) => {
          const ratingA = a.reviews?.[0]?.score_overall || 0;
          const ratingB = b.reviews?.[0]?.score_overall || 0;
          return ratingA - ratingB;
        });
        break;
      case 'name-asc':
        results.sort((a, b) => {
          const nameA = a.name?.toLowerCase() || '';
          const nameB = b.name?.toLowerCase() || '';
          return nameA.localeCompare(nameB);
        });
        break;
      case 'name-desc':
        results.sort((a, b) => {
          const nameA = a.name?.toLowerCase() || '';
          const nameB = b.name?.toLowerCase() || '';
          return nameB.localeCompare(nameA);
        });
        break;
      case 'newest':
        results.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
      default:
        // 默认排序，保持原顺序
        break;
    }
    
    setFilteredTools(results);
    
    // 计算总页数
    const totalPagesCount = Math.ceil(results.length / itemsPerPage);
    setTotalPages(totalPagesCount || 1); // 确保至少有1页
    
    // 当筛选条件变化时，重置为第一页
    setCurrentPage(1);
  }, [tools, searchQuery, selectedTags, selectedPricing, sortOption, itemsPerPage]);
  
  // 处理分页
  useEffect(() => {
    if (filteredTools.length === 0) return;
    
    // 计算当前页的工具
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageTools = filteredTools.slice(startIndex, endIndex);
    
    setPaginatedTools(currentPageTools);
    
    // 如果当前页超出了总页数，则重置为第一页
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredTools, currentPage, itemsPerPage, totalPages]);
  
  // 处理标签选择
  const handleTagSelect = (tagName: string) => {
    let newTags: string[];
    if (selectedTags.includes(tagName)) {
      newTags = selectedTags.filter(tag => tag !== tagName);
      setSelectedTags(newTags);
    } else {
      newTags = [...selectedTags, tagName];
      setSelectedTags(newTags);
    }
    
    setCurrentPage(1); // 重置到第一页
    
    // 更新URL参数
    if (newTags.length === 1) {
      updateUrlParams({ tag: newTags[0], page: '1' });
    } else if (newTags.length > 1) {
      // 多个标签时，只保留第一个在URL中
      updateUrlParams({ tag: newTags[0], page: '1' });
    } else {
      updateUrlParams({ tag: null, page: '1' });
    }
  };
  
  // 处理价格筛选
  const handlePricingSelect = (pricing: string) => {
    let newPricing: string[];
    if (selectedPricing.includes(pricing)) {
      newPricing = selectedPricing.filter(p => p !== pricing);
      setSelectedPricing(newPricing);
    } else {
      newPricing = [...selectedPricing, pricing];
      setSelectedPricing(newPricing);
    }
    
    setCurrentPage(1); // 重置到第一页
    
    // 更新URL参数
    if (newPricing.length === 1) {
      updateUrlParams({ pricing: newPricing[0], page: '1' });
    } else if (newPricing.length > 1) {
      // 多个价格筛选时，只保留第一个在URL中
      updateUrlParams({ pricing: newPricing[0], page: '1' });
    } else {
      updateUrlParams({ pricing: null, page: '1' });
    }
  };
  
  // 清除所有筛选条件
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedPricing([]);
    setSortOption('default');
    setCurrentPage(1);
    
    // 清除URL中的所有筛选参数
    updateUrlParams({
      tag: null,
      pricing: null,
      search: null,
      sort: null,
      page: null,
      pageSize: null
    });
  };
  
  // 分页控制函数
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // 更新URL参数
      updateUrlParams({ page: page.toString() });
      // 滚动到页面顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };
  
  // 处理每页显示数量变更
  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1); // 重置到第一页
    setShowPageSizeOptions(false);
    updateUrlParams({ pageSize: size.toString(), page: '1' });
  };
  
  // 更新URL参数
  const updateUrlParams = (params: Record<string, string | null>) => {
    const url = new URL(window.location.href);
    
    // 更新或删除参数
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    });
    
    // 使用 history API 更新 URL，不刷新页面
    window.history.pushState({}, '', url);
  };
  
  // 点击外部关闭页面大小选项
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.page-size-dropdown')) {
        setShowPageSizeOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 获取排序选项的显示文本
  const getSortOptionText = (option: string) => {
    switch (option) {
      case 'rating-high': return '评分（高到低）';
      case 'rating-low': return '评分（低到高）';
      case 'name-asc': return '名称（A-Z）';
      case 'name-desc': return '名称（Z-A）';
      case 'newest': return '最新添加';
      default: return '默认排序';
    }
  };
  
  // 处理排序选项变更
  const handleSortOptionChange = (option: string) => {
    setSortOption(option);
    setShowSortOptions(false);
    setCurrentPage(1); // 重置到第一页
    updateUrlParams({ 
      sort: option === 'default' ? null : option,
      page: '1' // 重置页码
    });
  };
  
  // 点击外部关闭排序下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.sort-dropdown')) {
        setShowSortOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">AI工具导航</h1>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                setCurrentPage(1); // 重置到第一页
                
                // 延迟更新URL，避免频繁更新
                const delayDebounceFn = setTimeout(() => {
                  updateUrlParams({ 
                    search: value ? value : null,
                    page: '1' // 重置页码
                  });
                }, 500);
              }}
              placeholder="搜索工具..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
          </div>
          
          {/* 排序按钮 */}
          <div className="relative sort-dropdown">
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="flex items-center gap-1.5 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white hover:bg-neutral-700 transition-colors"
            >
              <ArrowUpDown size={18} />
              {sortOption === 'default' ? '排序' : getSortOptionText(sortOption)}
            </button>
            
            {/* 排序选项下拉菜单 */}
            {showSortOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSortOption('default');
                      setShowSortOptions(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${sortOption === 'default' ? 'text-blue-400 bg-neutral-700' : 'text-white hover:bg-neutral-700'}`}
                  >
                    默认排序
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('rating-high');
                      setShowSortOptions(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${sortOption === 'rating-high' ? 'text-blue-400 bg-neutral-700' : 'text-white hover:bg-neutral-700'} flex items-center justify-between`}
                  >
                    <span>评分（高到低）</span>
                    {sortOption === 'rating-high' && <ArrowDown size={14} />}
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('rating-low');
                      setShowSortOptions(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${sortOption === 'rating-low' ? 'text-blue-400 bg-neutral-700' : 'text-white hover:bg-neutral-700'} flex items-center justify-between`}
                  >
                    <span>评分（低到高）</span>
                    {sortOption === 'rating-low' && <ArrowUp size={14} />}
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('name-asc');
                      setShowSortOptions(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${sortOption === 'name-asc' ? 'text-blue-400 bg-neutral-700' : 'text-white hover:bg-neutral-700'} flex items-center justify-between`}
                  >
                    <span>名称（A-Z）</span>
                    {sortOption === 'name-asc' && <ArrowUp size={14} />}
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('name-desc');
                      setShowSortOptions(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${sortOption === 'name-desc' ? 'text-blue-400 bg-neutral-700' : 'text-white hover:bg-neutral-700'} flex items-center justify-between`}
                  >
                    <span>名称（Z-A）</span>
                    {sortOption === 'name-desc' && <ArrowDown size={14} />}
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('newest');
                      setShowSortOptions(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${sortOption === 'newest' ? 'text-blue-400 bg-neutral-700' : 'text-white hover:bg-neutral-700'} flex items-center justify-between`}
                  >
                    <span>最新添加</span>
                    {sortOption === 'newest' && <ArrowDown size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white hover:bg-neutral-700 transition-colors"
          >
            <Filter size={18} />
            筛选
          </button>
        </div>
      </div>
      
      {/* 筛选条件标签 */}
      {(selectedTags.length > 0 || selectedPricing.length > 0 || sortOption !== 'default') && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-neutral-400 text-sm">已选筛选条件:</span>
          
          {selectedTags.map(tag => (
            <span 
              key={tag} 
              className="flex items-center gap-1 bg-blue-900/30 text-blue-400 text-xs px-2.5 py-1 rounded-full border border-blue-800/30"
            >
              <Tag size={12} />
              {tag}
              <button onClick={() => handleTagSelect(tag)} className="ml-1">
                <X size={12} />
              </button>
            </span>
          ))}
          
          {selectedPricing.map(pricing => (
            <span 
              key={pricing} 
              className="flex items-center gap-1 bg-purple-900/30 text-purple-400 text-xs px-2.5 py-1 rounded-full border border-purple-800/30"
            >
              {pricing === 'Free' ? '免费' : 
               pricing === 'Freemium' ? '免费增值' : 
               pricing === 'Paid' ? '付费' : pricing}
              <button onClick={() => handlePricingSelect(pricing)} className="ml-1">
                <X size={12} />
              </button>
            </span>
          ))}
          
          {/* 排序条件标签 */}
          {sortOption !== 'default' && (
            <span 
              className="flex items-center gap-1 bg-green-900/30 text-green-400 text-xs px-2.5 py-1 rounded-full border border-green-800/30"
            >
              <ArrowUpDown size={12} />
              {getSortOptionText(sortOption)}
              <button onClick={() => setSortOption('default')} className="ml-1">
                <X size={12} />
              </button>
            </span>
          )}
          
          <button 
            onClick={clearAllFilters}
            className="text-neutral-400 text-xs underline hover:text-white ml-2"
          >
            清除全部
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 筛选侧边栏 */}
        {showFilters && (
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">筛选条件</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-neutral-500 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* 价格筛选 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-neutral-400 mb-3">价格</h4>
                <div className="space-y-2">
                  {['Free', 'Freemium', 'Paid'].map(pricing => (
                    <label key={pricing} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPricing.includes(pricing)}
                        onChange={() => handlePricingSelect(pricing)}
                        className="rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-neutral-800 border-neutral-700"
                      />
                      <span className="text-neutral-300">
                        {pricing === 'Free' ? '免费' : 
                         pricing === 'Freemium' ? '免费增值' : 
                         pricing === 'Paid' ? '付费' : pricing}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* 标签筛选 */}
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-3">标签</h4>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {availableTags.map(tag => (
                    <label key={tag.name} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.name)}
                        onChange={() => handleTagSelect(tag.name)}
                        className="rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-neutral-800 border-neutral-700"
                      />
                      <span className="text-neutral-300">{tag.name}</span>
                      <span className="text-neutral-500 text-xs ml-auto">{tag.count}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 工具列表 */}
        <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {/* 排序指示器 */}
          {filteredTools.length > 0 && sortOption !== 'default' && (
            <div className="flex items-center gap-2 mb-4 text-sm text-neutral-400">
              <span>排序方式:</span>
              <span className="text-green-400">{getSortOptionText(sortOption)}</span>
            </div>
          )}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="mt-4 text-neutral-400">正在加载工具...</p>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-xl">
              <p className="text-neutral-400 mb-4">没有找到符合条件的工具</p>
              <button 
                onClick={clearAllFilters}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                清除筛选条件
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTools.map(tool => (
                  <div key={tool.id}>
                    <ToolCard 
                      id={tool.id}
                      slug={tool.slug || ''}
                      name={tool.name || ''}
                      tagline={tool.tagline || ''}
                      logo_url={tool.logo_url || ''}
                      tags={tool.tags || []}
                      rating={tool.reviews?.[0]?.score_overall}
                    />
                  </div>
                ))}
              </div>
              
              {/* 分页导航 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-2">
                  {/* 上一页按钮 */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg ${currentPage === 1 ? 'text-neutral-600 bg-neutral-800 cursor-not-allowed' : 'text-white bg-neutral-800 hover:bg-neutral-700'}`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {/* 页码按钮 */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // 计算要显示的页码
                    let pageNum;
                    if (totalPages <= 5) {
                      // 如果总页数小于等于5，直接显示1到totalPages
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // 如果当前页在前3页，显示1到5
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // 如果当前页在后3页，显示totalPages-4到totalPages
                      pageNum = totalPages - 4 + i;
                    } else {
                      // 否则显示currentPage-2到currentPage+2
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`flex items-center justify-center w-10 h-10 rounded-lg ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {/* 下一页按钮 */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg ${currentPage === totalPages ? 'text-neutral-600 bg-neutral-800 cursor-not-allowed' : 'text-white bg-neutral-800 hover:bg-neutral-700'}`}
                  >
                    <ChevronRight size={18} />
                  </button>
                  
                  {/* 跳转到指定页面 */}
                  {totalPages > 5 && (
                    <div className="flex items-center ml-2">
                      <span className="text-sm text-neutral-400 mr-2">跳转到</span>
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => {
                          const page = parseInt(e.target.value);
                          if (!isNaN(page) && page >= 1 && page <= totalPages) {
                            setCurrentPage(page);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const page = parseInt((e.target as HTMLInputElement).value);
                            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                              goToPage(page);
                            }
                          }
                        }}
                        className="w-12 h-10 bg-neutral-800 border border-neutral-700 rounded-lg text-center text-white"
                      />
                      <span className="text-sm text-neutral-400 ml-2">/ {totalPages}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* 显示工具总数和当前页信息 */}
              <div className="flex justify-center items-center mt-4 text-sm text-neutral-400 space-x-4">
                <div>
                  显示 {filteredTools.length} 个工具中的 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTools.length)} 个
                </div>
                
                {/* 每页显示数量选择器 */}
                <div className="relative page-size-dropdown">
                  <button 
                    onClick={() => setShowPageSizeOptions(!showPageSizeOptions)}
                    className="flex items-center space-x-1 px-2 py-1 bg-neutral-800 rounded-md hover:bg-neutral-700 transition-colors"
                  >
                    <span>每页 {itemsPerPage} 个</span>
                    <ChevronDown size={14} className={`transition-transform ${showPageSizeOptions ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showPageSizeOptions && (
                    <div className="absolute right-0 bottom-full mb-1 bg-neutral-800 rounded-md shadow-lg overflow-hidden z-10">
                      {[6, 12, 24, 48].map(size => (
                        <button
                          key={size}
                          onClick={() => handlePageSizeChange(size)}
                          className={`block w-full text-left px-4 py-2 ${itemsPerPage === size ? 'bg-blue-600' : 'hover:bg-neutral-700'}`}
                        >
                          {size} 个/页
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// 加载组件
function ToolsPageFallback() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-neutral-400">正在加载工具...</p>
        </div>
      </div>
    </div>
  );
}

// 主页面组件
export default function ToolsPage() {
  return (
    <Suspense fallback={<ToolsPageFallback />}>
      <ToolsContent />
    </Suspense>
  );
}