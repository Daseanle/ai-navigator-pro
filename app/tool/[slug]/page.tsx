// app/tool/[slug]/page.tsx
'use client'; // 因为需要用户交互和状态管理，改为客户端组件

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState, useOptimistic, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import type { ToolDetail, Comment as CommentType } from '@/types'; // 引入我们创建的类型
import { submitComment, toggleBookmark, toggleUpvote } from '@/lib/actions'; // 引入我们的 Server Action
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
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'review' | 'tutorial' | 'comparison'>('overview');
  const [upvoted, setUpvoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [relatedTools, setRelatedTools] = useState<Partial<ToolDetail>[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const supabase = createClientComponentClient();
  
  // 使用 useOptimistic 来处理UI的即时反馈
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    tool?.comments || [],
    (state: CommentType[], newComment: CommentType) => [
      newComment,
      ...state,
    ]
  );

  useEffect(() => {
    // 获取工具数据
    async function getToolData() {
      setLoading(true);
      // 解析 params Promise 获取 slug
      const resolvedParams = await params;
      const toolSlug = resolvedParams.slug;
      
      const { data, error } = await supabase
        .from('tools')
        .select(`
          id, slug, name, tagline, logo_url, website_url, pricing, has_api, upvotes_count,
          reviews ( conclusion, pros, cons, score_overall ),
          tags ( name ),
          comments ( id, content, created_at, user_id, profiles ( id, username ) )
        `)
        .eq('slug', toolSlug)
        .order('created_at', { referencedTable: 'comments', ascending: false })
        .single();

      if (error) {
        console.error('Error fetching tool data:', error);
      } else {
        setTool(data as ToolDetail);
        // 获取相关工具
        getRelatedTools(data.id, data.tags.map(tag => tag.name));
      }
      setLoading(false);
    }

    // 获取相关工具
    async function getRelatedTools(toolId: number, tags: string[]) {
      if (!tags.length) return;
      
      const { data, error } = await supabase
        .from('tools')
        .select(`
          id, slug, name, tagline, logo_url,
          reviews ( score_overall )
        `)
        .neq('id', toolId)
        .in('tags.name', tags)
        .limit(5);

      if (error) {
        console.error('Error fetching related tools:', error);
      } else {
        setRelatedTools(data || []);
      }
    }

    // 获取当前用户
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // 如果用户已登录，检查是否已收藏和点赞
      if (user) {
        const { data: bookmarkData } = await supabase
          .from('bookmarks')
          .select('id')
          .eq('user_id', user.id)
          .eq('tool_id', tool?.id || 0)
          .maybeSingle();
        
        setBookmarked(!!bookmarkData);
        
        const { data: upvoteData } = await supabase
          .from('upvotes')
          .select('id')
          .eq('user_id', user.id)
          .eq('tool_id', tool?.id || 0)
          .maybeSingle();
        
        setUpvoted(!!upvoteData);
      }
    }
    
    getToolData();
    getCurrentUser();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();

  }, [params, supabase]);

  // 处理点赞
  const handleUpvote = async () => {
    if (!user) {
      alert('请先登录！');
      return;
    }
    
    if (!tool) return;
    
    setIsSubmitting(true);
    // 乐观更新UI
    setUpvoted(!upvoted);
    
    try {
      const result = await toggleUpvote(tool.id, upvoted);
      setActionMessage(result.message);
      
      // 显示消息3秒后清除
      setTimeout(() => setActionMessage(''), 3000);
    } catch (error) {
      console.error('Error toggling upvote:', error);
      // 如果失败，恢复原状态
      setUpvoted(upvoted);
      setActionMessage('操作失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理收藏
  const handleBookmark = async () => {
    if (!user) {
      alert('请先登录！');
      return;
    }
    
    if (!tool) return;
    
    setIsSubmitting(true);
    // 乐观更新UI
    setBookmarked(!bookmarked);
    
    try {
      const result = await toggleBookmark(tool.id, bookmarked);
      setActionMessage(result.message);
      
      // 显示消息3秒后清除
      setTimeout(() => setActionMessage(''), 3000);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // 如果失败，恢复原状态
      setBookmarked(bookmarked);
      setActionMessage('操作失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">正在加载工具信息...</div>;
  }

  if (!tool) {
    return <div className="text-center py-20">未找到该工具。</div>;
  }

  // 模拟工具评测数据
  const reviewData = {
    toolName: tool.name,
    conclusion: tool.reviews[0]?.conclusion || '这是一个功能强大的AI工具，适合多种场景使用。',
    pros: tool.reviews[0]?.pros?.split('\n') || ['易于使用的界面', '强大的AI功能', '良好的文档支持'],
    cons: tool.reviews[0]?.cons?.split('\n') || ['免费版功能有限', '某些高级功能学习曲线较陡'],
    overallScore: tool.reviews[0]?.score_overall || 8.5,
    detailedScores: [
      { category: '易用性', score: 9.0 },
      { category: '功能', score: 8.5 },
      { category: '性能', score: 8.0 },
      { category: '创新性', score: 9.0 },
      { category: '价格', score: 7.5 },
    ],
    useCases: ['内容创作', '数据分析', '自动化工作流', '客户支持'],
    expertOpinion: '这款工具在AI领域展现出色，尤其适合需要快速生成高质量内容的团队。',
    pricingNote: tool.pricing === 'Free' ? '完全免费使用' : 
                tool.pricing === 'Freemium' ? '提供免费版本，高级功能需付费' : 
                tool.pricing === 'Paid' ? '付费使用，提供多种套餐选择' : 
                '请联系官方获取价格信息',
  };

  // 模拟工具教程数据
  const tutorialData = {
    toolName: tool.name,
    toolLogo: tool.logo_url,
    difficulty: 'beginner' as const,
    estimatedTime: '15分钟',
    steps: [
      {
        id: '1',
        title: '注册账号',
        description: `首先，访问${tool.name}官方网站并注册一个账号。填写您的电子邮件地址、设置密码，然后验证您的邮箱。`,
        tips: ['使用强密码以保护您的账户安全', '某些功能可能需要验证您的手机号码'],
      },
      {
        id: '2',
        title: '探索界面',
        description: '登录后，花些时间熟悉工具的界面和主要功能区域。了解菜单结构和常用功能的位置。',
        tips: ['查看官方的新手指南视频', '使用内置的教程功能'],
      },
      {
        id: '3',
        title: '创建第一个项目',
        description: '点击"新建项目"按钮，选择适合您需求的模板，然后为项目命名并设置基本参数。',
        code: {
          language: 'javascript',
          content: `// 示例API调用
const response = await fetch('https://api.example.com/v1/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    name: '我的第一个项目',
    template: 'basic',
    settings: {
      language: 'zh-CN',
      mode: 'creative'
    }
  })
});`
        },
      },
      {
        id: '4',
        title: '使用核心功能',
        description: `学习如何使用${tool.name}的核心功能来完成您的任务。根据界面提示操作，并尝试不同的设置以获得最佳结果。`,
        tips: ['保存您的工作进度', '尝试使用键盘快捷键提高效率'],
      },
      {
        id: '5',
        title: '导出和分享',
        description: '完成项目后，学习如何导出您的作品并与他人分享。您可以选择多种导出格式，或直接通过链接分享。',
        tips: ['检查导出设置以确保质量', '使用内置的协作功能邀请团队成员'],
      },
    ],
  };

  // 模拟工具比较数据
  const comparisonData = {
    tools: [
      {
        id: '1',
        name: tool.name,
        logo: tool.logo_url,
        pricing: {
          free: tool.pricing === 'Free' || tool.pricing === 'Freemium',
          freeTrial: true,
          startingPrice: '$9.99',
          hasPremium: tool.pricing === 'Freemium' || tool.pricing === 'Paid',
        },
        rating: 4.5,
        url: tool.website_url,
      },
      {
        id: '2',
        name: '竞品A',
        logo: '/images/tools/default-tool.svg',
        pricing: {
          free: false,
          freeTrial: true,
          startingPrice: '$19.99',
          hasPremium: true,
        },
        rating: 4.2,
        url: 'https://example.com',
      },
      {
        id: '3',
        name: '竞品B',
        logo: '/images/tools/default-tool.svg',
        pricing: {
          free: true,
          freeTrial: false,
          startingPrice: '$14.99',
          hasPremium: true,
        },
        rating: 3.8,
        url: 'https://example.com',
      },
    ],
    features: [
      { id: 'f1', name: 'AI生成内容', description: '使用AI自动生成高质量内容', category: '核心功能' },
      { id: 'f2', name: '多语言支持', description: '支持多种语言的内容生成和翻译', category: '核心功能' },
      { id: 'f3', name: 'API访问', description: '提供API接口以便集成到其他系统', category: '集成' },
      { id: 'f4', name: '团队协作', description: '支持多人同时编辑和协作', category: '协作' },
      { id: 'f5', name: '自定义模板', description: '允许用户创建和保存自定义模板', category: '自定义' },
      { id: 'f6', name: '数据导出', description: '支持多种格式的数据导出', category: '数据管理' },
    ],
    toolFeatures: [
      { toolId: '1', featureId: 'f1', supported: true },
      { toolId: '1', featureId: 'f2', supported: true },
      { toolId: '1', featureId: 'f3', supported: tool.has_api },
      { toolId: '1', featureId: 'f4', supported: true, notes: '高级版功能' },
      { toolId: '1', featureId: 'f5', supported: true },
      { toolId: '1', featureId: 'f6', supported: true },
      
      { toolId: '2', featureId: 'f1', supported: true },
      { toolId: '2', featureId: 'f2', supported: false },
      { toolId: '2', featureId: 'f3', supported: true },
      { toolId: '2', featureId: 'f4', supported: true },
      { toolId: '2', featureId: 'f5', supported: true, notes: '企业版功能' },
      { toolId: '2', featureId: 'f6', supported: true },
      
      { toolId: '3', featureId: 'f1', supported: true, notes: '功能有限' },
      { toolId: '3', featureId: 'f2', supported: true, notes: '仅支持主要语言' },
      { toolId: '3', featureId: 'f3', supported: false },
      { toolId: '3', featureId: 'f4', supported: false },
      { toolId: '3', featureId: 'f5', supported: true },
      { toolId: '3', featureId: 'f6', supported: true },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* 操作反馈消息 */}
      {actionMessage && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {actionMessage}
        </div>
      )}
      {/* 工具头部信息 */}
      <header className="flex flex-col md:flex-row md:items-center gap-6 pb-8 border-b border-neutral-800">
        <div className="w-24 h-24 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center p-2">
            {tool.logo_url ? (
              <img src={tool.logo_url} alt={`${tool.name} logo`} className="object-contain max-w-full max-h-full" />
            ) : (
              <img src="/images/tools/default-tool.svg" alt={`${tool.name} logo`} className="object-contain max-w-full max-h-full" />
            )}
        </div>
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white">{tool.name}</h1>
            <div className="flex items-center bg-neutral-800 px-2 py-1 rounded text-sm">
              <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-white font-medium">{tool.reviews[0]?.score_overall?.toFixed(1) || '4.5'}</span>
            </div>
          </div>
          <p className="text-lg text-neutral-300 mb-3">{tool.tagline}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {tool.tags.map((tag, index) => (
              <span key={index} className="bg-blue-900/30 text-blue-400 text-xs px-2.5 py-1 rounded-full border border-blue-800/30">
                {tag.name}
              </span>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-4">
            <a 
              href={tool.website_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300"
            >
              <ExternalLink size={16} />
              访问官网
            </a>
            
            <button 
              onClick={handleUpvote}
              disabled={isSubmitting}
              className={`flex items-center gap-1.5 ${upvoted ? 'text-green-400' : 'text-neutral-400 hover:text-white'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ThumbsUp size={16} fill={upvoted ? 'currentColor' : 'none'} />
              点赞 ({tool.upvotes_count + (upvoted ? 1 : 0)})
            </button>
            
            <button 
              onClick={handleBookmark}
              disabled={isSubmitting}
              className={`flex items-center gap-1.5 ${bookmarked ? 'text-yellow-400' : 'text-neutral-400 hover:text-white'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
              收藏
            </button>
            
            <ShareButton 
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={`${tool.name} - AI工具导航`}
              description={tool.tagline}
            />
          </div>
        </div>
      </header>

      {/* 标签页导航 */}
      <div className="flex border-b border-neutral-800 mt-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-neutral-400 hover:text-white'}`}
        >
          工具概览
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'review' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-neutral-400 hover:text-white'}`}
        >
          专业评测
        </button>
        <button
          onClick={() => setActiveTab('tutorial')}
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'tutorial' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-neutral-400 hover:text-white'}`}
        >
          使用教程
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'comparison' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-neutral-400 hover:text-white'}`}
        >
          竞品对比
        </button>
      </div>

      {/* 标签页内容 */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <div>
            {/* 工具信息卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <h3 className="text-white font-medium mb-3">价格</h3>
                <p className="text-neutral-300">
                  {tool.pricing === 'Free' ? '免费' : 
                   tool.pricing === 'Freemium' ? '基础功能免费，高级功能付费' : 
                   tool.pricing === 'Paid' ? '付费' : 
                   tool.pricing === 'Contact for pricing' ? '联系获取价格' : 
                   '未知'}
                </p>
              </div>
              
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <h3 className="text-white font-medium mb-3">API支持</h3>
                <p className="text-neutral-300">
                  {tool.has_api ? '提供API接口' : '暂不提供API'}
                </p>
              </div>
              
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <h3 className="text-white font-medium mb-3">用户评分</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={18} 
                      className={`${star <= Math.round(tool.reviews[0]?.score_overall || 4.5) ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'} mr-1`} 
                    />
                  ))}
                  <span className="ml-2 text-white font-medium">
                    {tool.reviews[0]?.score_overall?.toFixed(1) || '4.5'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* 评论区 */}
                <section className="mb-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">用户评论 ({optimisticComments.length})</h2>
                    <div className="flex items-center text-neutral-400 text-sm">
                      <MessageSquare size={16} className="mr-1.5" />
                      {optimisticComments.length} 条评论
                    </div>
                  </div>
                  <CommentForm toolId={tool.id} user={user} addOptimisticComment={addOptimisticComment} />
                  <CommentList comments={optimisticComments} />
                </section>
              </div>
              
              <div>
                {/* 相关工具推荐 */}
                <RelatedTools 
                  currentToolId={tool.id} 
                  tools={relatedTools} 
                  className="mb-6"
                />

                {/* 内嵌广告 */}
                <Advertisement 
                  type="inline"
                  size="small"
                  title="AI开发者工具"
                  description="专为AI开发者设计的高效工具集"
                  imageUrl="https://via.placeholder.com/200x200"
                  ctaText="免费试用"
                  ctaUrl="/tools/developer"
                  sponsorName="开发工具公司"
                  className="mb-6"
                />
                
                {/* 工具标签 */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                  <div className="p-5 border-b border-neutral-800">
                    <h3 className="text-lg font-bold text-white">工具标签</h3>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag, index) => (
                        <Link 
                          key={index} 
                          href={`/tools?tag=${encodeURIComponent(tag.name)}`}
                          className="bg-blue-900/30 text-blue-400 text-xs px-2.5 py-1.5 rounded-full border border-blue-800/30 hover:bg-blue-800/40 transition-colors"
                        >
                          <Tag size={12} className="inline mr-1" />
                          {tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'review' && (
          <ToolReview 
            toolName={reviewData.toolName}
            conclusion={reviewData.conclusion}
            pros={reviewData.pros}
            cons={reviewData.cons}
            overallScore={reviewData.overallScore}
            detailedScores={reviewData.detailedScores}
            useCases={reviewData.useCases}
            expertOpinion={reviewData.expertOpinion}
            pricingNote={reviewData.pricingNote}
          />
        )}
        
        {activeTab === 'tutorial' && (
          <ToolTutorial 
            toolName={tutorialData.toolName}
            toolLogo={tutorialData.toolLogo}
            steps={tutorialData.steps}
            difficulty={tutorialData.difficulty}
            estimatedTime={tutorialData.estimatedTime}
          />
        )}
        
        {activeTab === 'comparison' && (
          <ToolComparison 
            tools={comparisonData.tools}
            features={comparisonData.features}
            toolFeatures={comparisonData.toolFeatures}
          />
        )}
      </div>
    </div>
  );
}