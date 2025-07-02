'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function TutorialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'beginner', name: '入门教程' },
    { id: 'advanced', name: '高级技巧' },
    { id: 'use-cases', name: '应用案例' },
    { id: 'comparisons', name: '工具对比' },
  ];
  
  const tutorials = [
    {
      id: 1,
      title: 'ChatGPT 入门：从零开始掌握 AI 对话',
      description: '本教程将指导您如何设置和使用 ChatGPT，包括提示工程的基础知识和最佳实践。',
      image: '/images/tutorials/chatgpt-basics.jpg',
      category: 'beginner',
      readTime: 10,
      date: '2023-11-15',
      author: '李明',
      authorAvatar: '/images/avatars/author1.jpg',
      slug: 'chatgpt-basics'
    },
    {
      id: 2,
      title: 'Midjourney 图像生成完全指南',
      description: '学习如何使用 Midjourney 创建令人惊叹的 AI 生成图像，从基本提示到高级技术。',
      image: '/images/tutorials/midjourney-guide.jpg',
      category: 'beginner',
      readTime: 15,
      date: '2023-11-10',
      author: '王芳',
      authorAvatar: '/images/avatars/author2.jpg',
      slug: 'midjourney-guide'
    },
    {
      id: 3,
      title: '高级提示工程：优化 GPT-4 输出',
      description: '深入了解提示工程技术，学习如何构建复杂提示以获得更精确、更有用的 GPT-4 响应。',
      image: '/images/tutorials/advanced-prompting.jpg',
      category: 'advanced',
      readTime: 20,
      date: '2023-11-05',
      author: '张伟',
      authorAvatar: '/images/avatars/author3.jpg',
      slug: 'advanced-prompting'
    },
    {
      id: 4,
      title: '使用 AI 工具自动化内容创作工作流程',
      description: '学习如何结合多种 AI 工具创建高效的内容创作流程，从研究到发布。',
      image: '/images/tutorials/content-automation.jpg',
      category: 'use-cases',
      readTime: 18,
      date: '2023-10-28',
      author: '刘洋',
      authorAvatar: '/images/avatars/author4.jpg',
      slug: 'content-automation'
    },
    {
      id: 5,
      title: 'ChatGPT vs Claude：哪个 AI 助手更适合您？',
      description: '详细比较 ChatGPT 和 Claude 的功能、性能和使用场景，帮助您选择最适合的 AI 助手。',
      image: '/images/tutorials/chatgpt-vs-claude.jpg',
      category: 'comparisons',
      readTime: 12,
      date: '2023-10-20',
      author: '赵静',
      authorAvatar: '/images/avatars/author5.jpg',
      slug: 'chatgpt-vs-claude'
    },
    {
      id: 6,
      title: 'AI 图像生成器对比：Midjourney、DALL-E 和 Stable Diffusion',
      description: '比较三大顶级 AI 图像生成器的优缺点、特点和最佳用例。',
      image: '/images/tutorials/image-generators-comparison.jpg',
      category: 'comparisons',
      readTime: 15,
      date: '2023-10-15',
      author: '孙明',
      authorAvatar: '/images/avatars/author6.jpg',
      slug: 'image-generators-comparison'
    },
    {
      id: 7,
      title: '使用 AI 工具提升营销策略',
      description: '探索如何利用 AI 工具优化营销活动，从受众分析到内容创作和绩效跟踪。',
      image: '/images/tutorials/ai-marketing.jpg',
      category: 'use-cases',
      readTime: 14,
      date: '2023-10-08',
      author: '陈红',
      authorAvatar: '/images/avatars/author7.jpg',
      slug: 'ai-marketing'
    },
    {
      id: 8,
      title: 'Stable Diffusion 本地部署指南',
      description: '学习如何在自己的计算机上设置和运行 Stable Diffusion，包括硬件要求和优化技巧。',
      image: '/images/tutorials/stable-diffusion-local.jpg',
      category: 'advanced',
      readTime: 25,
      date: '2023-10-01',
      author: '杨光',
      authorAvatar: '/images/avatars/author8.jpg',
      slug: 'stable-diffusion-local'
    },
    {
      id: 9,
      title: 'AI 辅助编程：使用 GitHub Copilot 提高开发效率',
      description: '了解如何有效使用 GitHub Copilot 加速编码过程，包括最佳实践和常见陷阱。',
      image: '/images/tutorials/github-copilot.jpg',
      category: 'beginner',
      readTime: 16,
      date: '2023-09-25',
      author: '吴强',
      authorAvatar: '/images/avatars/author9.jpg',
      slug: 'github-copilot'
    },
    {
      id: 10,
      title: 'AI 在教育中的应用：教师指南',
      description: '探索教师如何利用 AI 工具改进课程设计、个性化学习和评估过程。',
      image: '/images/tutorials/ai-education.jpg',
      category: 'use-cases',
      readTime: 20,
      date: '2023-09-18',
      author: '林小红',
      authorAvatar: '/images/avatars/author10.jpg',
      slug: 'ai-education'
    },
    {
      id: 11,
      title: 'LangChain 框架入门：构建 AI 应用',
      description: '学习如何使用 LangChain 框架构建复杂的 AI 应用程序，从基础概念到实际项目。',
      image: '/images/tutorials/langchain-intro.jpg',
      category: 'advanced',
      readTime: 22,
      date: '2023-09-10',
      author: '郑伟',
      authorAvatar: '/images/avatars/author11.jpg',
      slug: 'langchain-intro'
    },
    {
      id: 12,
      title: 'AI 语音助手比较：Whisper、Speechify 和 Murf',
      description: '比较不同 AI 语音识别和合成工具的功能、准确性和使用场景。',
      image: '/images/tutorials/voice-assistants.jpg',
      category: 'comparisons',
      readTime: 14,
      date: '2023-09-05',
      author: '黄晓明',
      authorAvatar: '/images/avatars/author12.jpg',
      slug: 'voice-assistants'
    },
  ];
  
  // 过滤教程
  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">AI 工具教程</h1>
        <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
          探索我们的教程库，学习如何有效使用 AI 工具，掌握最佳实践，并发现创新应用场景。
        </p>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="搜索教程..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category.id ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* 教程网格 */}
      {filteredTutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTutorials.map((tutorial) => (
            <Link href={`/tutorials/${tutorial.slug}`} key={tutorial.id}>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-colors h-full flex flex-col">
                <div className="aspect-video bg-neutral-800 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center mb-3">
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-900/30 text-blue-400">
                      {categories.find(c => c.id === tutorial.category)?.name}
                    </span>
                    <span className="text-neutral-500 text-sm ml-auto">{tutorial.readTime} 分钟阅读</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">{tutorial.title}</h2>
                  <p className="text-neutral-400 mb-4 line-clamp-3">{tutorial.description}</p>
                  
                  <div className="mt-auto flex items-center">
                    <div className="w-8 h-8 bg-neutral-800 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{tutorial.author}</p>
                      <p className="text-xs text-neutral-500">{tutorial.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-xl">
          <svg className="w-16 h-16 text-neutral-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">没有找到匹配的教程</h3>
          <p className="text-neutral-400 mb-6">尝试使用不同的搜索词或筛选条件</p>
          <button 
            onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            清除筛选
          </button>
        </div>
      )}
      
      {/* 订阅教程更新 */}
      <div className="mt-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">获取最新 AI 教程和技巧</h2>
          <p className="text-lg text-neutral-300 mb-8">
            订阅我们的通讯，定期获取最新的 AI 工具教程、技巧和最佳实践。
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="您的电子邮件"
              className="flex-grow bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            />
            <button 
              type="submit"
              className="whitespace-nowrap px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              订阅
            </button>
          </form>
          
          <p className="text-neutral-500 text-sm mt-4">
            我们尊重您的隐私，您可以随时取消订阅。
          </p>
        </div>
      </div>
    </div>
  );
}

// 注意：在客户端组件中不能导出 metadata
// 元数据应该在 layout.tsx 文件中定义