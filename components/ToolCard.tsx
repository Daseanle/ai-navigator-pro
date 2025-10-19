'use client';

import { Star, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toggleBookmark } from '@/lib/actions';

// --- 类型定义 ---
type ToolCardProps = {
  id?: number; // 改为 number 类型，与数据库 ID 类型一致
  slug: string;
  name: string;
  tagline?: string;
  logo_url?: string;
  tags?: { name: string }[];
  rating?: number;
  compact?: boolean;
  className?: string;
  showBookmark?: boolean;
};

export default function ToolCard({ 
  id, 
  slug, 
  name, 
  tagline, 
  logo_url, 
  tags = [], 
  rating, 
  compact = false,
  className = '',
  showBookmark = true
}: ToolCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState('');
  const supabase = createClientComponentClient();
  
  // 获取用户信息和收藏状态
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // 如果用户已登录且有工具ID，检查是否已收藏
      if (user && id) {
        const { data } = await supabase
          .from('bookmarks')
          .select('id')
          .eq('user_id', user.id)
          .eq('tool_id', id) // id 现在是 number 类型，与数据库匹配
          .maybeSingle();
        
        setIsBookmarked(!!data);
      }
    };
    
    getUser();
  }, [id, supabase]);
  
  // 处理收藏/取消收藏
  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault(); // 阻止链接跳转
    e.stopPropagation(); // 阻止事件冒泡
    
    if (!user) {
      setMessage('请先登录后再收藏');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    if (!id) {
      setMessage('无法收藏，工具ID缺失');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 乐观更新UI
      setIsBookmarked(!isBookmarked);
      
      // 调用收藏/取消收藏的Server Action - id 现在是 number 类型
      const result = await toggleBookmark(id, isBookmarked);
      setMessage(result.message);
      
      // 显示消息3秒后清除
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // 如果失败，恢复原状态
      setIsBookmarked(isBookmarked);
      setMessage('操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="relative">
      {/* 消息提示 */}
      {message && (
        <div className="absolute -top-10 left-0 right-0 bg-blue-600 text-white text-center py-2 px-4 rounded-lg text-sm z-10 animate-fade-in-down">
          {message}
        </div>
      )}
      
      <a 
        href={`/tool/${slug}`}
        className={`block bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/5 ${className}`}
      >
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className={`${compact ? 'w-10 h-10' : 'w-14 h-14'} bg-neutral-800 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
            {logo_url ? (
              <img src={logo_url} alt={`${name} logo`} className="h-full w-full object-contain p-2" />
            ) : (
              <img src="/images/tools/default-tool.svg" alt={`${name} logo`} className="h-full w-full object-contain p-2" />
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-white">{name}</h3>
              
              <div className="flex items-center gap-2">
                {rating !== undefined && (
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="text-sm text-neutral-300">{rating.toFixed(1)}</span>
                  </div>
                )}
                
                {/* 收藏按钮 */}
                {showBookmark && id && (
                  <button 
                    onClick={handleBookmark}
                    disabled={isLoading}
                    className="ml-2 p-1.5 rounded-full hover:bg-neutral-800 transition-colors"
                    title={isBookmarked ? '取消收藏' : '收藏'}
                  >
                    <Bookmark 
                      size={16} 
                      className={`${isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-400'} transition-colors`} 
                    />
                  </button>
                )}
              </div>
            </div>
            
            {tagline && !compact && (
              <p className="text-neutral-400 mt-1 text-sm line-clamp-2">{tagline}</p>
            )}
            
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {tags.slice(0, compact ? 1 : 3).map(tag => (
                  <span 
                    key={tag.name} 
                    className="px-2 py-0.5 bg-neutral-800 text-xs text-neutral-300 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
                {tags.length > (compact ? 1 : 3) && (
                  <span className="px-2 py-0.5 bg-neutral-800 text-xs text-neutral-400 rounded-full">
                    +{tags.length - (compact ? 1 : 3)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </a>
    </div>
  );
}