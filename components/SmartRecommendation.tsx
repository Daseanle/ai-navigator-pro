'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import ToolCard from './ToolCard';

type Tool = {
  id: number;
  slug: string;
  name: string;
  tagline?: string;
  logo_url?: string;
  tags?: { name: string }[];
  rating?: number;
};

type SmartRecommendationProps = {
  initialTools?: Tool[];
  userId?: string;
  title?: string;
  description?: string;
  className?: string;
  maxTools?: number;
};

export default function SmartRecommendation({
  initialTools = [],
  userId,
  title = '为您推荐',
  description = '基于您的浏览历史和偏好，我们为您精选了以下AI工具',
  className = '',
  maxTools = 4
}: SmartRecommendationProps) {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [loading, setLoading] = useState(false);
  const [userFeedback, setUserFeedback] = useState<Record<number, 'like' | 'dislike' | null>>({});
  const [refreshCount, setRefreshCount] = useState(0);

  // 模拟获取推荐工具
  const fetchRecommendations = async () => {
    setLoading(true);
    
    try {
      // 在实际实现中，这里应该调用后端API获取推荐
      // 可以传递用户ID、用户反馈和刷新次数等参数
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟数据
      const mockTools: Tool[] = [
        { id: 1, slug: 'chatgpt', name: 'ChatGPT', tagline: 'OpenAI的对话式AI助手', logo_url: '', tags: [{ name: 'chatbot' }], rating: 4.8 },
        { id: 2, slug: 'midjourney', name: 'Midjourney', tagline: '高质量AI图像生成工具', logo_url: '', tags: [{ name: 'image-generation' }], rating: 4.7 },
        { id: 3, slug: 'claude', name: 'Claude', tagline: 'Anthropic的对话式AI助手', logo_url: '', tags: [{ name: 'chatbot' }], rating: 4.6 },
        { id: 4, slug: 'stable-diffusion', name: 'Stable Diffusion', tagline: '开源AI图像生成模型', logo_url: '', tags: [{ name: 'image-generation' }], rating: 4.5 },
        { id: 5, slug: 'github-copilot', name: 'GitHub Copilot', tagline: 'AI代码助手', logo_url: '', tags: [{ name: 'coding' }], rating: 4.9 },
        { id: 6, slug: 'jasper', name: 'Jasper', tagline: 'AI内容创作平台', logo_url: '', tags: [{ name: 'writing' }], rating: 4.4 },
        { id: 7, slug: 'synthesia', name: 'Synthesia', tagline: 'AI视频生成平台', logo_url: '', tags: [{ name: 'video' }], rating: 4.3 },
        { id: 8, slug: 'descript', name: 'Descript', tagline: 'AI音频和视频编辑工具', logo_url: '', tags: [{ name: 'audio' }], rating: 4.5 },
      ];
      
      // 随机选择工具，模拟个性化推荐
      const shuffled = [...mockTools].sort(() => 0.5 - Math.random());
      setTools(shuffled.slice(0, maxTools));
    } catch (error) {
      console.error('获取推荐失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和刷新时获取推荐
  useEffect(() => {
    if (initialTools.length === 0 || refreshCount > 0) {
      fetchRecommendations();
    }
  }, [refreshCount, initialTools.length]);

  // 处理用户反馈
  const handleFeedback = async (toolId: number, feedback: 'like' | 'dislike') => {
    // 更新本地状态
    setUserFeedback(prev => ({
      ...prev,
      [toolId]: prev[toolId] === feedback ? null : feedback
    }));
    
    // 在实际实现中，这里应该将用户反馈发送到后端
    // 例如：await api.sendFeedback(userId, toolId, feedback);
  };

  // 刷新推荐
  const refreshRecommendations = () => {
    setRefreshCount(prev => prev + 1);
  };

  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl p-6 ${className}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-400" />
            {title}
          </h3>
          <p className="text-neutral-400 mt-1">{description}</p>
        </div>
        
        <button 
          onClick={refreshRecommendations}
          disabled={loading}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          title="刷新推荐"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(maxTools)].map((_, index) => (
            <div key={index} className="bg-neutral-800 animate-pulse rounded-xl h-48"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map(tool => (
            <div key={tool.id} className="relative group">
              <ToolCard
                slug={tool.slug}
                name={tool.name}
                tagline={tool.tagline}
                logo_url={tool.logo_url}
                tags={tool.tags}
                rating={tool.rating}
              />
              
              {/* 反馈按钮 */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => handleFeedback(tool.id, 'like')}
                  className={`p-1.5 rounded-full ${userFeedback[tool.id] === 'like' ? 'bg-green-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
                  title="喜欢这个推荐"
                >
                  <ThumbsUp size={14} />
                </button>
                <button
                  onClick={() => handleFeedback(tool.id, 'dislike')}
                  className={`p-1.5 rounded-full ${userFeedback[tool.id] === 'dislike' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
                  title="不喜欢这个推荐"
                >
                  <ThumbsDown size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 个性化提示 */}
      {userId && (
        <div className="mt-6 text-center text-sm text-neutral-500">
          这些推荐是基于您的使用习惯和偏好生成的。继续使用平台，推荐将变得更加精准。
        </div>
      )}
    </div>
  );
}