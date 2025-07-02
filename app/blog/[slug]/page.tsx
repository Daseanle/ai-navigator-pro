'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, User, Tag, ArrowLeft, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import Advertisement from '@/components/Advertisement';
import ShareButton from '@/components/ShareButton';

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
    bio?: string;
  };
  published_at: string;
  reading_time: number;
  tags: string[];
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
    content: `# 2023年AI行业趋势分析

人工智能技术在2023年迎来了爆发式增长，尤其是生成式AI的突破性进展引领了整个行业的发展方向。本文将深入分析2023年AI行业的主要趋势，并探讨这些趋势对未来的影响。

## 生成式AI的崛起

ChatGPT的爆火标志着生成式AI进入大众视野，这一领域在2023年取得了显著进展：

- **大型语言模型(LLM)的规模和能力持续提升**：从GPT-4到Claude 2，再到Llama 2，模型的参数规模、训练数据和推理能力都有了质的飞跃。
- **多模态能力的增强**：新一代AI模型不再局限于文本，而是能够理解和生成图像、音频等多种模态的内容。
- **定制化微调的普及**：企业和开发者可以通过微调技术，将通用大模型适配到特定领域和应用场景。

## 多模态模型的融合

2023年，AI模型打破了单一模态的限制，向着真正的多模态智能迈进：

- **文本到图像生成技术的成熟**：DALL-E 3、Midjourney V5和Stable Diffusion XL等工具使得高质量图像生成变得触手可及。
- **视频生成技术的突破**：从静态图像到动态视频的生成技术取得重要进展，如Runway的Gen-2和Google的Imagen Video。
- **跨模态理解能力的提升**：新一代模型能够理解图像内容并生成相关文本，或根据文本描述生成相应的视觉内容。

## AI监管框架的形成

随着AI技术的快速发展，监管框架也在逐步形成：

- **欧盟AI法案的推进**：作为全球首个综合性AI监管框架，欧盟AI法案的制定和实施将对全球AI治理产生深远影响。
- **内容版权问题的争议**：AI模型训练数据中的版权内容引发了广泛讨论，多起法律诉讼正在挑战AI公司的数据使用方式。
- **安全与伦理准则的建立**：各大AI研究机构和公司纷纷建立自己的AI安全与伦理准则，以应对技术发展带来的潜在风险。

## 企业AI应用的普及

AI技术正从研究领域走向广泛的商业应用：

- **AI助手的企业级应用**：从客服到内部知识管理，AI助手正在企业各个环节发挥作用。
- **垂直领域解决方案的涌现**：针对医疗、法律、金融等特定行业的AI解决方案正在快速发展。
- **开发工具链的完善**：围绕AI应用开发的工具链日益成熟，降低了企业采用AI技术的门槛。

## 未来展望

展望未来，AI技术将继续以惊人的速度发展：

- **模型效率的提升**：在保持性能的同时，模型将变得更小、更快、更节能。
- **个性化AI体验的普及**：用户将能够拥有个人定制的AI助手，适应个人习惯和需求。
- **AI创作工具的民主化**：创意工作者将能够利用AI工具辅助内容创作，提高生产效率。

2023年的AI发展已经超出了许多人的预期，而这仅仅是开始。随着技术的不断成熟和应用场景的拓展，AI将继续重塑我们的工作和生活方式。`,
    cover_image: 'https://via.placeholder.com/1200x600',
    author: {
      name: '张明',
      avatar: 'https://via.placeholder.com/100',
      bio: 'AI研究员，专注于大型语言模型和生成式AI的研究与应用。'
    },
    published_at: '2023-11-15',
    reading_time: 8,
    tags: ['AI趋势', '生成式AI', '行业分析'],
    likes: 128,
    comments: 32
  },
  {
    id: 2,
    slug: 'chatgpt-vs-claude',
    title: 'ChatGPT与Claude：大型语言模型对比',
    excerpt: '详细对比两款领先的大型语言模型ChatGPT和Claude的性能、特点和适用场景。',
    content: '这是文章的完整内容...',
    cover_image: 'https://via.placeholder.com/1200x600',
    author: {
      name: '李华',
      avatar: 'https://via.placeholder.com/100',
      bio: '技术评测专家，擅长AI工具评测和比较分析。'
    },
    published_at: '2023-10-28',
    reading_time: 12,
    tags: ['ChatGPT', 'Claude', 'LLM对比'],
    likes: 95,
    comments: 28
  },
  {
    id: 3,
    slug: 'ai-content-creation',
    title: 'AI内容创作工具全面评测',
    excerpt: '对市面上主流AI内容创作工具进行全面评测，帮助创作者选择最适合的工具。',
    content: '这是文章的完整内容...',
    cover_image: 'https://via.placeholder.com/1200x600',
    author: {
      name: '王芳',
      avatar: 'https://via.placeholder.com/100',
      bio: '内容创作者，AI工具爱好者，专注于探索AI辅助创作的新方法。'
    },
    published_at: '2023-10-15',
    reading_time: 10,
    tags: ['AI创作', '内容工具', '评测'],
    likes: 87,
    comments: 19
  },
  {
    id: 4,
    slug: 'ai-ethics',
    title: 'AI伦理与责任：技术发展的边界',
    excerpt: '探讨人工智能发展中的伦理问题，以及如何建立负责任的AI开发和应用框架。',
    content: '这是文章的完整内容...',
    cover_image: 'https://via.placeholder.com/1200x600',
    author: {
      name: '赵强',
      avatar: 'https://via.placeholder.com/100',
      bio: '科技伦理学者，关注AI发展中的伦理和社会问题。'
    },
    published_at: '2023-09-30',
    reading_time: 15,
    tags: ['AI伦理', '技术责任', '未来展望'],
    likes: 112,
    comments: 45
  }
];

// 相关文章推荐
const getRelatedPosts = (currentPost: BlogPost, allPosts: BlogPost[], count: number = 3) => {
  // 简单实现：基于标签匹配的相关文章推荐
  return allPosts
    .filter(post => post.id !== currentPost.id) // 排除当前文章
    .sort((a, b) => {
      // 计算标签匹配度
      const aMatchCount = a.tags.filter(tag => currentPost.tags.includes(tag)).length;
      const bMatchCount = b.tags.filter(tag => currentPost.tags.includes(tag)).length;
      return bMatchCount - aMatchCount;
    })
    .slice(0, count);
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    // 在实际应用中，这里应该从API获取文章数据
    const slug = params.slug as string;
    const foundPost = MOCK_BLOG_POSTS.find(p => p.slug === slug);
    
    if (foundPost) {
      setPost(foundPost);
      setLikeCount(foundPost.likes);
      setRelatedPosts(getRelatedPosts(foundPost, MOCK_BLOG_POSTS));
    }
    
    setLoading(false);
  }, [params.slug]);

  const handleLike = () => {
    if (!liked) {
      setLikeCount(prev => prev + 1);
    } else {
      setLikeCount(prev => prev - 1);
    }
    setLiked(!liked);
  };

  const handleBack = () => {
    router.push('/blog');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-neutral-400">加载中...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">文章未找到</h1>
        <p className="text-neutral-400 mb-6">抱歉，您请求的文章不存在或已被移除。</p>
        <button 
          onClick={handleBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回博客首页
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button 
        onClick={handleBack}
        className="flex items-center text-neutral-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        返回博客列表
      </button>

      <article className="max-w-4xl mx-auto">
        {/* 文章头部 */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-neutral-800 text-sm text-neutral-300 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
          
          <div className="flex items-center mb-6">
            <img 
              src={post.author.avatar || 'https://via.placeholder.com/40'} 
              alt={post.author.name} 
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="text-white font-medium">{post.author.name}</p>
              <div className="flex items-center text-sm text-neutral-400 mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-3">{post.published_at}</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.reading_time}分钟阅读</span>
              </div>
            </div>
          </div>
          
          <img 
            src={post.cover_image} 
            alt={post.title} 
            className="w-full h-auto rounded-xl object-cover mb-8"
          />
        </header>

        {/* 顶部广告 */}
        <div className="mb-8">
          <Advertisement 
            type="banner"
            position="center"
            size="medium"
            title="AI开发者工具包"
            description="获取专业AI开发者工具包，加速你的AI项目开发"
            imageUrl="https://via.placeholder.com/800x150"
            ctaText="免费下载"
            ctaUrl="/resources/ai-dev-toolkit"
            sponsorName="DevTools Pro"
            className="w-full"
          />
        </div>
        
        {/* 文章内容 */}
        <div className="prose prose-invert prose-lg max-w-none mb-10">
          {post.content.split('\n\n').map((paragraph, index) => {
            // 简单的Markdown处理
            if (paragraph.startsWith('# ')) {
              return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.substring(2)}</h1>;
            } else if (paragraph.startsWith('## ')) {
              return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.substring(3)}</h2>;
            } else if (paragraph.startsWith('- ')) {
              return (
                <ul key={index} className="list-disc pl-5 my-4">
                  {paragraph.split('\n').map((item, i) => (
                    <li key={i} className="mb-2">{item.substring(2)}</li>
                  ))}
                </ul>
              );
            } else {
              return <p key={index} className="mb-4">{paragraph}</p>;
            }
          })}
        </div>

        {/* 中间广告 */}
        <div className="my-10">
          <Advertisement 
            type="inline"
            position="center"
            size="medium"
            title="AI实战课程"
            description="从入门到精通，全面掌握AI应用开发技能"
            imageUrl="https://via.placeholder.com/600x200"
            ctaText="了解详情"
            ctaUrl="/courses/ai-development"
            sponsorName="AI学院"
            className="w-full"
          />
        </div>
        
        {/* 文章底部互动区 */}
        <div className="border-t border-neutral-800 pt-6 mt-10 flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${liked ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'} transition-colors`}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{likeCount}</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-neutral-300 rounded-full hover:bg-neutral-700 transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments}</span>
            </button>
          </div>
          
          <ShareButton 
            url={`https://ai-navigator-pro.com/blog/${post.slug}`} 
            title={post.title} 
            description={post.excerpt}
          />
        </div>
      </article>

      {/* 作者信息 */}
      <div className="max-w-4xl mx-auto mt-12 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <img 
            src={post.author.avatar || 'https://via.placeholder.com/80'} 
            alt={post.author.name} 
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">关于作者</h3>
            <p className="text-white font-medium mb-1">{post.author.name}</p>
            <p className="text-neutral-400">{post.author.bio || '暂无作者简介'}</p>
          </div>
        </div>
      </div>

      {/* 相关文章 */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">相关文章</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map(relatedPost => (
            <a 
              key={relatedPost.id} 
              href={`/blog/${relatedPost.slug}`}
              className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/5"
            >
              <img 
                src={relatedPost.cover_image} 
                alt={relatedPost.title} 
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{relatedPost.title}</h3>
                <div className="flex items-center text-sm text-neutral-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{relatedPost.published_at}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 侧边栏广告 - 在移动端显示在底部 */}
      <div className="mt-12 lg:float-right lg:w-1/4 lg:-mt-[1200px] lg:ml-8">
        <div className="sticky top-24">
          <Advertisement 
            type="sidebar"
            position="right"
            size="small"
            title="AI编程助手"
            description="使用我们的AI编程助手，提高代码质量和开发效率"
            imageUrl="https://via.placeholder.com/300x600"
            ctaText="免费试用"
            ctaUrl="/tools/ai-coding-assistant"
            sponsorName="CodeAI"
            className="mb-6"
          />
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">热门标签</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(MOCK_BLOG_POSTS.flatMap(p => p.tags))).map(tag => (
                <a 
                  key={tag} 
                  href={`/blog?tag=${tag}`}
                  className="px-3 py-1 bg-neutral-800 text-sm text-neutral-300 rounded-full hover:bg-neutral-700 transition-colors"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}