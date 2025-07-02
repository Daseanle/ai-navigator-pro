'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Edit, Trash2, Plus, Search, Filter, Eye, Calendar, Clock, MessageSquare, ThumbsUp } from 'lucide-react';

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
  status: 'published' | 'draft' | 'scheduled';
  likes: number;
  comments: number;
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
    tags: ['AI趋势', '生成式AI', '行业分析'],
    status: 'published',
    likes: 128,
    comments: 32
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
    tags: ['ChatGPT', 'Claude', 'LLM对比'],
    status: 'published',
    likes: 95,
    comments: 28
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
    tags: ['AI创作', '内容工具', '评测'],
    status: 'published',
    likes: 87,
    comments: 19
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
    tags: ['AI伦理', '技术责任', '未来展望'],
    status: 'published',
    likes: 112,
    comments: 45
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
    tags: ['企业AI', '商业应用', '实践指南'],
    status: 'draft',
    likes: 0,
    comments: 0
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
    published_at: '2023-12-10',
    reading_time: 7,
    tags: ['AI图像', 'Midjourney', 'DALL-E'],
    status: 'scheduled',
    likes: 0,
    comments: 0
  }
];

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);

  // 获取所有标签
  const allTags = Array.from(new Set(MOCK_BLOG_POSTS.flatMap(post => post.tags)));

  // 搜索和过滤文章
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    
    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesStatus && matchesTag;
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

  // 处理状态过滤
  const handleStatusFilter = (status: 'all' | 'published' | 'draft' | 'scheduled') => {
    setStatusFilter(status);
  };

  // 处理编辑文章
  const handleEditPost = (post: BlogPost) => {
    setCurrentPost(post);
    setShowEditModal(true);
  };

  // 处理删除文章
  const handleDeletePost = (postId: number) => {
    if (confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  // 处理创建文章
  const handleCreatePost = () => {
    setCurrentPost(null);
    setShowCreateModal(true);
  };

  // 处理预览文章
  const handlePreviewPost = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank');
  };

  // 博客统计数据
  const stats = {
    total: posts.length,
    published: posts.filter(post => post.status === 'published').length,
    draft: posts.filter(post => post.status === 'draft').length,
    scheduled: posts.filter(post => post.status === 'scheduled').length,
    totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
    totalComments: posts.reduce((sum, post) => sum + post.comments, 0),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">博客管理</h1>
        <button
          onClick={handleCreatePost}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          创建新文章
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <p className="text-neutral-400 text-sm">总文章数</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <p className="text-neutral-400 text-sm">已发布</p>
          <p className="text-2xl font-bold text-green-500">{stats.published}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <p className="text-neutral-400 text-sm">草稿</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.draft}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <p className="text-neutral-400 text-sm">计划发布</p>
          <p className="text-2xl font-bold text-blue-500">{stats.scheduled}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <p className="text-neutral-400 text-sm">总点赞数</p>
          <p className="text-2xl font-bold text-pink-500">{stats.totalLikes}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <p className="text-neutral-400 text-sm">总评论数</p>
          <p className="text-2xl font-bold text-purple-500">{stats.totalComments}</p>
        </div>
      </div>

      {/* 搜索和过滤区域 */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
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
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusFilter('all')}
            className={`px-3 py-2 rounded-lg text-sm ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
          >
            全部
          </button>
          <button
            onClick={() => handleStatusFilter('published')}
            className={`px-3 py-2 rounded-lg text-sm ${statusFilter === 'published' ? 'bg-green-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
          >
            已发布
          </button>
          <button
            onClick={() => handleStatusFilter('draft')}
            className={`px-3 py-2 rounded-lg text-sm ${statusFilter === 'draft' ? 'bg-yellow-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
          >
            草稿
          </button>
          <button
            onClick={() => handleStatusFilter('scheduled')}
            className={`px-3 py-2 rounded-lg text-sm ${statusFilter === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
          >
            计划发布
          </button>
        </div>
      </div>

      {/* 标签过滤 */}
      <div className="mb-8">
        <p className="text-neutral-400 mb-2">按标签筛选：</p>
        <div className="flex flex-wrap gap-2">
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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-900 border-b border-neutral-800">
                <th className="py-3 px-4 text-left text-neutral-400 font-medium">标题</th>
                <th className="py-3 px-4 text-left text-neutral-400 font-medium">状态</th>
                <th className="py-3 px-4 text-left text-neutral-400 font-medium">发布日期</th>
                <th className="py-3 px-4 text-left text-neutral-400 font-medium">标签</th>
                <th className="py-3 px-4 text-left text-neutral-400 font-medium">互动</th>
                <th className="py-3 px-4 text-left text-neutral-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map(post => (
                <tr key={post.id} className="border-b border-neutral-800 hover:bg-neutral-900/50">
                  <td className="py-4 px-4">
                    <div className="flex items-start gap-3">
                      <img 
                        src={post.cover_image} 
                        alt={post.title} 
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium text-white">{post.title}</h3>
                        <p className="text-sm text-neutral-400 line-clamp-1">{post.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${post.status === 'published' ? 'bg-green-900/30 text-green-400' : post.status === 'draft' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-blue-900/30 text-blue-400'}`}>
                      {post.status === 'published' ? '已发布' : post.status === 'draft' ? '草稿' : '计划发布'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-neutral-300">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{post.published_at}</span>
                    </div>
                    <div className="flex items-center text-neutral-500 text-sm mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{post.reading_time}分钟</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-neutral-800 text-xs text-neutral-300 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3 text-neutral-300">
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handlePreviewPost(post.slug)}
                        className="p-2 text-neutral-400 hover:text-white transition-colors"
                        title="预览"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleEditPost(post)}
                        className="p-2 text-neutral-400 hover:text-blue-500 transition-colors"
                        title="编辑"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                        title="删除"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 创建/编辑模态框（实际应用中需要实现） */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {showCreateModal ? '创建新文章' : '编辑文章'}
            </h2>
            
            <p className="text-neutral-400 text-center py-8">
              博客文章编辑器将在这里实现，包括标题、内容、封面图片、标签等字段的编辑功能。
            </p>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                }}
                className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
              >
                取消
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {showCreateModal ? '创建' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}