'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, ArrowRight, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';

type Tool = {
  id: string;
  name: string;
  logo: string;
  url: string;
};

type UseCaseStep = {
  title: string;
  description: string;
  image?: string;
  tool?: Tool;
};

type UseCase = {
  id: string;
  title: string;
  description: string;
  industry: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  steps: UseCaseStep[];
  results: string[];
};

type UseCaseShowcaseProps = {
  useCases: UseCase[];
  className?: string;
};

export default function UseCaseShowcase({
  useCases,
  className = ''
}: UseCaseShowcaseProps) {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase>(useCases[0]);
  const [expandedUseCase, setExpandedUseCase] = useState<string | null>(useCases[0].id);
  const [feedbackGiven, setFeedbackGiven] = useState<{[key: string]: 'up' | 'down' | null}>({});
  
  // 切换展开/折叠状态
  const toggleExpand = (useCaseId: string) => {
    setExpandedUseCase(prev => prev === useCaseId ? null : useCaseId);
    
    // 如果展开，则设置为选中的用例
    if (expandedUseCase !== useCaseId) {
      const useCase = useCases.find(uc => uc.id === useCaseId);
      if (useCase) {
        setSelectedUseCase(useCase);
      }
    }
  };
  
  // 提供反馈
  const giveFeedback = (useCaseId: string, type: 'up' | 'down') => {
    setFeedbackGiven(prev => {
      // 如果已经给了相同的反馈，则取消
      if (prev[useCaseId] === type) {
        const newFeedback = {...prev};
        delete newFeedback[useCaseId];
        return newFeedback;
      }
      
      // 否则设置新的反馈
      return {
        ...prev,
        [useCaseId]: type
      };
    });
  };
  
  // 获取难度标签
  const getDifficultyBadge = (difficulty: 'easy' | 'medium' | 'hard') => {
    const badges = {
      easy: { text: '简单', class: 'bg-green-500' },
      medium: { text: '中等', class: 'bg-yellow-500' },
      hard: { text: '困难', class: 'bg-red-500' }
    };
    
    const badge = badges[difficulty];
    
    return (
      <span className={`${badge.class} text-white text-xs px-2 py-1 rounded`}>
        {badge.text}
      </span>
    );
  };
  
  // 获取行业标签
  const getIndustryBadge = (industry: string) => {
    return (
      <span className="bg-blue-900/50 text-blue-400 text-xs px-2 py-1 rounded border border-blue-800/50">
        {industry}
      </span>
    );
  };

  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden ${className}`}>
      <div className="p-6 border-b border-neutral-800">
        <h2 className="text-xl font-bold text-white mb-1">AI工具应用场景</h2>
        <p className="text-neutral-400 text-sm">探索AI工具在不同场景中的实际应用案例</p>
      </div>
      
      <div className="flex flex-col lg:flex-row">
        {/* 左侧用例列表 */}
        <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-neutral-800">
          <div className="p-4">
            <div className="text-sm text-neutral-400 mb-2">选择应用场景</div>
            <div className="space-y-3">
              {useCases.map(useCase => (
                <div 
                  key={useCase.id}
                  className={`
                    border rounded-lg overflow-hidden cursor-pointer transition-all
                    ${expandedUseCase === useCase.id 
                      ? 'border-blue-500 bg-blue-900/20' 
                      : 'border-neutral-700 hover:border-neutral-600'}
                  `}
                >
                  <div 
                    className="p-4"
                    onClick={() => toggleExpand(useCase.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-white font-medium">{useCase.title}</h3>
                      <ChevronRight 
                        size={18} 
                        className={`text-neutral-400 transition-transform ${expandedUseCase === useCase.id ? 'rotate-90' : ''}`} 
                      />
                    </div>
                    
                    <p className="text-neutral-400 text-sm mt-1 line-clamp-2">
                      {useCase.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {getIndustryBadge(useCase.industry)}
                      {getDifficultyBadge(useCase.difficulty)}
                      <span className="bg-neutral-800 text-neutral-400 text-xs px-2 py-1 rounded">
                        {useCase.estimatedTime}
                      </span>
                    </div>
                  </div>
                  
                  {/* 展开的内容预览 */}
                  {expandedUseCase === useCase.id && (
                    <div className="border-t border-neutral-800 p-4 bg-neutral-800/30">
                      <div className="text-sm text-neutral-400 mb-2">步骤概览</div>
                      <div className="space-y-2">
                        {useCase.steps.map((step, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center text-xs mr-2 mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-neutral-300 text-sm">{step.title}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              giveFeedback(useCase.id, 'up');
                            }}
                            className={`p-1.5 rounded ${feedbackGiven[useCase.id] === 'up' ? 'bg-green-900/30 text-green-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                          >
                            <ThumbsUp size={14} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              giveFeedback(useCase.id, 'down');
                            }}
                            className={`p-1.5 rounded ${feedbackGiven[useCase.id] === 'down' ? 'bg-red-900/30 text-red-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                          >
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => setSelectedUseCase(useCase)}
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                        >
                          查看详情
                          <ArrowRight size={14} className="ml-1" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 右侧用例详情 */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">{selectedUseCase.title}</h2>
            <p className="text-neutral-300 mt-2">{selectedUseCase.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {getIndustryBadge(selectedUseCase.industry)}
              {getDifficultyBadge(selectedUseCase.difficulty)}
              <span className="bg-neutral-800 text-neutral-400 text-xs px-2 py-1 rounded flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {selectedUseCase.estimatedTime}
              </span>
            </div>
          </div>
          
          {/* 步骤详情 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">实施步骤</h3>
            <div className="space-y-8">
              {selectedUseCase.steps.map((step, index) => (
                <div key={index} className="border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="bg-neutral-800/30 p-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center text-sm mr-3">
                        {index + 1}
                      </div>
                      <h4 className="text-white font-medium">{step.title}</h4>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-neutral-300 text-sm">{step.description}</p>
                    
                    {/* 步骤图片 */}
                    {step.image && (
                      <div className="mt-4 border border-neutral-800 rounded-lg overflow-hidden">
                        <Image 
                          src={step.image} 
                          alt={step.title} 
                          width={600} 
                          height={350} 
                          className="w-full h-auto" 
                        />
                      </div>
                    )}
                    
                    {/* 推荐工具 */}
                    {step.tool && (
                      <div className="mt-4 bg-neutral-800/30 border border-neutral-700 rounded-lg p-4">
                        <div className="text-sm text-neutral-400 mb-2">推荐工具</div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 relative mr-3">
                            <Image 
                              src={step.tool.logo} 
                              alt={step.tool.name} 
                              width={40} 
                              height={40} 
                              className="rounded-md object-contain" 
                            />
                          </div>
                          <div>
                            <div className="text-white font-medium">{step.tool.name}</div>
                            <a 
                              href={step.tool.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm flex items-center mt-1"
                            >
                              访问官网
                              <ExternalLink size={12} className="ml-1" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 预期成果 */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">预期成果</h3>
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-lg p-4">
              <ul className="space-y-2">
                {selectedUseCase.results.map((result, index) => (
                  <li key={index} className="flex items-start">
                    <div className="text-green-500 mr-2">
                      <Check size={16} />
                    </div>
                    <span className="text-neutral-300 text-sm">{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 检查图标组件
const Check = ({ size = 24, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
};