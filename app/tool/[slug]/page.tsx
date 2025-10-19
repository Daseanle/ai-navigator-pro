// app/tool/[slug]/page.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState, useOptimistic, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import type { ToolDetail, Comment as CommentType } from '@/types';
import { submitComment, toggleBookmark, toggleUpvote } from '@/lib/actions';
import ToolReview from '@/components/ToolReview';
import ToolTutorial from '@/components/ToolTutorial';
import ToolComparison from '@/components/ToolComparison';
import { Star, ThumbsUp, MessageSquare, Share2, Bookmark, ExternalLink, Tag } from 'lucide-react';
import RelatedTools from '@/components/RelatedTools';
import Link from 'next/link';
import ShareButton from '@/components/ShareButton';
import Advertisement from '@/components/Advertisement';

// --- 组件：评论表单 ---
function CommentForm({ toolId, user, addOptimisticComment }: {
  toolId: number;
  user: User | null;
  addOptimisticComment: (newComment: CommentType) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    if (!user) {
      alert('请先登录！');
      return;
    }
    
    const content = formData.get('comment') as string;
    if (!content.trim()) return;

    // 乐观更新：立即在UI上显示新评论
    addOptimisticComment({
      id: Math.random(), // 临时ID
      content: content.trim(),
      created_at: new Date().toISOString(),
      user_id: user.id,
      tool_id: toolId, // 添加必需的 tool_id 字段
      profiles: { // 乐观地使用当前用户信息
        id: user.id,
        username: user.email?.split('@')[0] || '你',
      }
    });
    
    formRef.current?.reset(); // 清空表单
    await submitComment(toolId, formData);
  };

  if (!user) {
    return (
      <div className="mt-8 p-4 bg-neutral-800 rounded-lg text-center">
        <p>
          <a href="/login" className="text-blue-400 hover:underline">登录</a>
          {' '}后才能发表评论
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mt-8">
      <textarea
        name="comment"
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        placeholder="发表你的看法..."
        required
      ></textarea>
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-neutral-600"
        >
          提交评论
        </button>
      </div>
    </form>
  );
}

// --- 组件：评论列表 ---
function CommentList({ comments }: { comments: CommentType[] }) {
  if (comments.length === 0) {
    return <p className="text-neutral-400 mt-4">暂无评论，快来抢沙发！</p>;
  }

  // 辅助函数，从 profiles 中获取用户名
  const getUsernameFromProfiles = (profiles: any): string => {
    if (!profiles) return '匿名用户';
    
    // 如果 profiles 是数组，取第一个元素
    if (Array.isArray(profiles)) {
      return profiles[0]?.username || '匿名用户';
    }
    
    // 如果 profiles 是对象，直接获取 username
    return profiles.username || '匿名用户';
  };

  return (
    <div className="space-y-6 mt-6">
      {comments.map((comment) => {
        const username = getUsernameFromProfiles(comment.profiles);
        
        return (
          <div key={comment.id} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex-shrink-0 flex items-center justify-center font-bold text-white">
              {username.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">
                  {username}
                </span>
                <span className="text-xs text-neutral-500">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-neutral-300 mt-1">{comment.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- 页面主组件 ---
export default function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [tool, setTool] = useState<ToolDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'review' | 'tutorial' | 'comparison'>('overview');
  const [upvoted, setUpvoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [relatedTools, setRelatedTools] = useState<Partial<ToolDetail>[]>([]);

  const supabase = createClientComponentClient();
  
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    tool?.comments || [],
    (state: CommentType[], newComment: CommentType) => [
      newComment,
      ...state,
    ]
  );

  useEffect(() => {
    async function getToolData() {
      setLoading(true);
      setError(null);
      
      try {
        const resolvedParams = await params;
        const toolSlug = resolvedParams.slug;
        
        const { data, error } = await supabase
          .from('tools')
          .select(`
            id, slug, name, tagline, logo_url, website_url, pricing, has_api, upvotes_count,
            reviews ( id, conclusion, pros, cons, score_overall ),
            tool_tags ( tags ( name ) ),
            comments ( id, content, created_at, user_id, profiles ( id, username ) )
          `)
          .eq('slug', toolSlug)
          .order('created_at', { referencedTable: 'comments', ascending: false })
          .single();

        if (error) {
          console.error('Error fetching tool data:', error);
          setError(`工具 "${toolSlug}" 不存在或暂时无法访问`);
        } else {
          // 转换数据格式
          const formattedTool = {
            ...data,
            tags: data.tool_tags?.map(tt => tt.tags).filter(Boolean) || [],
            reviews: data.reviews?.[0] || null
          };
          setTool(formattedTool as ToolDetail);
          
          if (data.tool_tags?.length > 0) {
            getRelatedTools(data.id, data.tool_tags.map(tt => tt.tags?.name).filter(Boolean));
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('加载工具信息时发生错误');
      } finally {
        setLoading(false);
      }
    }

    async function getRelatedTools(toolId: string, tags: string[]) {
      if (!tags.length) return;
      
      const { data, error } = await supabase
        .from('tools')
        .select(`
          id, slug, name, tagline, logo_url,
          reviews ( score_overall )
        `)
        .neq('id', toolId)
        .limit(5);

      if (!error && data) {
        setRelatedTools(data);
      }
    }

    getToolData();
  }, [params, supabase]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-neutral-700 rounded w-2/3 mb-8"></div>
          <div className="h-64 bg-neutral-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">页面未找到</h1>
        <p className="text-neutral-400 mb-8">{error || '请求的工具不存在'}</p>
        <Link href="/tools" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          浏览所有工具
        </Link>
      </div>
    );
  }

  // ... rest of the component remains the same ...
}