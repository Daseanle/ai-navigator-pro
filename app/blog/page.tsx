'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Calendar, Clock, User, Tag, Search } from 'lucide-react';
import Advertisement from '@/components/Advertisement';

// 博客文章类型定义
type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: {
    name: string;
    avatar?: string;
  };
  published_at: string;
  reading_time: number;
  tags: string[];
};

// 模拟博客数据
const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: 'ai-trends-2023',
    title: '2023年AI行业趋势分析',
    excerpt: '探索2023年人工智能领域的主要发展趋势，包括生成式AI、多模态模型和AI监管等热点话题。',
    content: '这是文章的完整内容...',
    cover_image: 'https://via.placeholder.com/800x400',
    author: {
      name: '张明',
      avatar: 'https://via.placeholder.com/100'
    },
    published_at: '2023-11-15',
    reading_time: 8,
    tags: ['AI趋势', '生成式AI', '行业分析']
  },
  {
    id: 2,
    slug: 'chatgpt-vs-claude',
    title: 'ChatGPT与Claude：大型语言模型对比',
    excerpt: '详细对比两款领先的大型语言模型ChatGPT和Claude的性能、特点和适用场景。',
    content: '这是文章的完整内容...',
    cover_image: 'https://via.placeholder.com/800x400',
    author: {
      name: '李华',
      avatar: 'https://via.placeholder.com/100'
    },
    published_at: '2023-10-28',
    reading_time: 12,
    tags: ['ChatGPT', 'Claude', 'LLM对比']
  },
  {
    id: 3,
    slug: 'ai-content-creation',
    title: 'AI内容创作工具全面评测',
    excerpt: '对市面上主流AI内容创作工具进行全面评测，帮助创作者选择最适合的工具。',
    content: '这是文章的完整内容...',
    cover_image: 'https://via.placeholder.com/800x400',
    author: {
      name: '王芳',
      avatar: 'https://via.placeholder.com/100'
    },
    published_at: '2023-10-15',
    reading_time: 10,
    tags: ['AI创作', '内容工具', '评测']
  },
  {
    id: 4,
    slug: 'ai-ethics',
    title: 'AI伦理与责任：技术发展的边界',
    excerpt: '探讨人工智能发展中的伦理问题，以及如何建立负责任的AI开发和应用框架。',
    content: '这是文章的完整内容...',
    cover_image: 'https://via.placeholder.com/800x400',
    author: {
      name: '赵强',
      avatar: 'https://via.placeholder.com/100'
    },
    published_at: '2023-09-30',
    reading_time: 15,
    tags: ['AI伦理', '技术责任', '未来展望']
  },
  {
    id: 5,
    slug: 'ai-for-business',
    title: '企业AI应用实践指南',
    excerpt: '为企业提供实用的AI应用策略和最佳实践，帮助企业有效利用AI技术提升业务。',
    content: '这是文章的完整内容...',
    cover_image: 'https://via.placeholder.com/800x400',
    author: {
      name: '陈静',
      avatar: 'https://via.placeholder.com/100'
    },
    published_at: '2023-09-15',
    reading_time: 9,
    tags: ['企业AI', '商业应用', '实践指南']
  },
  {
    id: 6,
    slug: 'ai-image-generation',
    title: 'AI图像生成技术的突破与应用',
    excerpt: '解析最新的AI图像生成技术突破，以及这些技术在设计、艺术和营销领域的创新应用。',
    content: '这是文章的完整内容...',
    cover_image: 'https://via.placeholder.com/800x400',
    author: {
      name: '林小明',
      avatar: 'https://via.placeholder.com/100'
    },
    published_at: '2023-08-28',
    reading_time: 7,
    tags: ['AI图像', 'Midjourney', 'DALL-E']
  }
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取所有标签
  const allTags = Array.from(new Set(MOCK_BLOG_POSTS.flatMap(post => post.tags)));

  // 搜索和过滤文章
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 实际应用中可能需要从API获取数据
    setLoading(true);
    setTimeout(() => setLoading(false), 500); // 模拟加载
  };

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">AI导航博客</h1>
        <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
          探索AI领域的最新趋势、工具评测和实用指南
        </p>
      </header>

      {/* 搜索和过滤区域 */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="w-full md:w-1/2">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
          </div>
        </form>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1.5 rounded-full text-sm ${selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 顶部广告 */}
      <div className="mb-10">
        <Advertisement 
          type="banner"
          position="center"
          size="large"
          title="AI开发者大会"
          description="参加年度AI开发者大会，了解行业最新动态和技术趋势"
          imageUrl="https://via.placeholder.com/1200x300"
          ctaText="立即报名"
          ctaUrl="/events/ai-dev-conference"
          sponsorName="TechConf组织"
          className="w-full"
        />
      </div>

      {/* 博客文章列表 */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-neutral-400">加载中...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900 rounded-xl border border-neutral-800">
          <p className="text-neutral-400 text-lg">没有找到匹配的文章</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => {
            // 在第3篇文章后插入广告
            if (index === 2) {
              return (
                <>
                  <BlogPostCard key={post.id} post={post} />
                  <div key="ad-mid-blog" className="md:col-span-2 lg:col-span-3">
                    <Advertisement 
                      type="inline"
                      position="center"
                      size="medium"
                      title="AI学习资源"
                      description="获取我们精选的AI学习资源，助力你的AI技能提升"
                      imageUrl="https://via.placeholder.com/600x200"
                      ctaText="免费获取"
                      ctaUrl="/resources/ai-learning"
                      sponsorName="AI学院"
                      className="w-full"
                    />
                  </div>
                </>
              );
            }
            return <BlogPostCard key={post.id} post={post} />;
          })}
        </div>
      )}

      {/* 侧边栏广告 - 在移动端显示在底部 */}
      <div className="mt-12 lg:float-right lg:w-1/3 lg:-mt-[800px] lg:ml-8 lg:mb-8">
        <Advertisement 
          type="sidebar"
          position="right"
          size="medium"
          title="AI工具专业版"
          description="升级到专业版，解锁更多高级AI功能和资源"
          imageUrl="https://via.placeholder.com/300x500"
          ctaText="立即升级"
          ctaUrl="/pricing"
          sponsorName="AI Navigator Pro"
          className="sticky top-24"
        />
      </div>
    </div>
  );
}

// 博客文章卡片组件
function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/5">
      <img 
        src={post.cover_image} 
        alt={post.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-1 bg-neutral-800 text-xs text-neutral-300 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-2">
          <a href={`/blog/${post.slug}`} className="hover:text-blue-400 transition-colors">
            {post.title}
          </a>
        </h2>
        
        <p className="text-neutral-400 mb-4">{post.excerpt}</p>
        
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{post.author.name}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{post.published_at}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.reading_time}分钟</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}