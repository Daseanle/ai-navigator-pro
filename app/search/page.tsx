'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Search, X, Loader2 } from 'lucide-react';
import Advertisement from '@/components/Advertisement';
import ToolCard from '@/components/ToolCard';

// --- 类型定义 ---
type SearchResult = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  logo_url: string;
  tags: { name: string }[];
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // 当URL参数变化时执行搜索
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // 使用Supabase全文搜索（需要在Supabase中设置全文搜索索引）
      // 或者使用简单的ILIKE查询作为替代
      const { data, error } = await supabase
        .from('tools')
        .select(`
          id,
          slug,
          name,
          tagline,
          logo_url,
          tags (name)
        `)
        .or(`name.ilike.%${query}%,tagline.ilike.%${query}%`);

      if (error) {
        console.error('Search error:', error);
        setResults([]);
      } else {
        setResults(data as SearchResult[]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 更新URL参数
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery);
    }
    router.push(`/search?${params.toString()}`);
    performSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setSearched(false);
    router.push('/search');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">搜索 AI 工具</h1>
      
      {/* 搜索表单 */}
      <form onSubmit={handleSearch} className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索工具名称、描述或功能..."
            className="w-full px-5 py-4 pl-12 bg-neutral-900 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white text-lg"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          
          {searchQuery && (
            <button 
              type="button" 
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {/* 搜索结果 */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : searched ? (
          results.length > 0 ? (
            <>
              <p className="text-neutral-400 mb-6">找到 {results.length} 个结果</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((tool, index) => {
                  // 在第4个结果后插入广告
                  if (index === 4 && results.length > 5) {
                    return (
                      <>
                        <ToolCard
                          key={tool.id}
                          id={tool.id.toString()}
                          slug={tool.slug}
                          name={tool.name}
                          tagline={tool.tagline}
                          logo_url={tool.logo_url}
                          tags={tool.tags}
                        />
                        <div key="ad-mid-search" className="md:col-span-2">
                          <Advertisement 
                            type="banner"
                            position="center"
                            size="medium"
                            title="限时优惠"
                            description="所有AI课程限时8折优惠，仅限本周"
                            imageUrl="https://via.placeholder.com/400x300"
                            ctaText="查看优惠"
                            ctaUrl="/courses?discount=true"
                            sponsorName="学习平台"
                            className="w-full"
                          />
                        </div>
                      </>
                    );
                  }
                  return (
                    <ToolCard
                      key={tool.id}
                      id={tool.id.toString()}
                      slug={tool.slug}
                      name={tool.name}
                      tagline={tool.tagline}
                      logo_url={tool.logo_url}
                      tags={tool.tags}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-neutral-900 rounded-xl border border-neutral-800">
              <p className="text-neutral-400 text-lg">没有找到匹配 "{searchQuery}" 的结果</p>
              <p className="text-neutral-500 mt-2">尝试使用不同的关键词或浏览我们的分类</p>
              <div className="mt-6 flex justify-center gap-4">
                <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  浏览所有工具
                </a>
                <button 
                  onClick={clearSearch}
                  className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  清除搜索
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg">输入关键词开始搜索</p>
          </div>
        )}
      </div>
    </div>
  );
}