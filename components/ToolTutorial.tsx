'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Check, ExternalLink, Copy, Download } from 'lucide-react';

type TutorialStep = {
  id: string;
  title: string;
  description: string;
  image?: string;
  tips?: string[];
  code?: {
    language: string;
    content: string;
  };
};

type ToolTutorialProps = {
  toolName: string;
  toolLogo?: string;
  steps: TutorialStep[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  className?: string;
};

export default function ToolTutorial({
  toolName,
  toolLogo,
  steps,
  difficulty = 'beginner',
  estimatedTime = '10分钟',
  className = ''
}: ToolTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  // 获取当前步骤
  const step = steps[currentStep];
  
  // 切换到下一步
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      // 标记当前步骤为已完成
      if (!completedSteps.includes(step.id)) {
        setCompletedSteps([...completedSteps, step.id]);
      }
      setCurrentStep(currentStep + 1);
      // 滚动到顶部
      window.scrollTo(0, 0);
    }
  };
  
  // 切换到上一步
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // 滚动到顶部
      window.scrollTo(0, 0);
    }
  };
  
  // 标记步骤为已完成/未完成
  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };
  
  // 复制代码到剪贴板
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('代码已复制到剪贴板');
  };
  
  // 获取难度标签样式
  const getDifficultyBadge = () => {
    const badges = {
      beginner: { text: '初学者', class: 'bg-green-500' },
      intermediate: { text: '中级', class: 'bg-yellow-500' },
      advanced: { text: '高级', class: 'bg-red-500' }
    };
    
    const badge = badges[difficulty];
    
    return (
      <span className={`${badge.class} text-white text-xs px-2 py-1 rounded`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden ${className}`}>
      {/* 教程头部 */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center">
          {toolLogo && (
            <div className="w-12 h-12 relative mr-4">
              <Image 
                src={toolLogo} 
                alt={toolName} 
                width={48} 
                height={48} 
                className="rounded-md object-contain" 
              />
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-bold text-white">{toolName} 使用教程</h2>
            <div className="flex items-center mt-2 space-x-4">
              {getDifficultyBadge()}
              <span className="text-neutral-400 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {estimatedTime}
              </span>
              <span className="text-neutral-400 text-sm">
                {steps.length} 个步骤
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 教程内容 */}
      <div className="flex flex-col md:flex-row">
        {/* 步骤导航 */}
        <div className="w-full md:w-64 bg-neutral-800/30 p-4 md:p-6 border-b md:border-b-0 md:border-r border-neutral-800">
          <h3 className="text-white font-medium mb-4">步骤</h3>
          <div className="space-y-2">
            {steps.map((s, index) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(index)}
                className={`
                  w-full flex items-center p-2 rounded text-left transition-colors
                  ${currentStep === index ? 'bg-blue-900/30 text-blue-400' : 'text-neutral-400 hover:text-white'}
                `}
              >
                <div className={`
                  w-6 h-6 flex-shrink-0 rounded-full mr-3 flex items-center justify-center
                  ${completedSteps.includes(s.id) 
                    ? 'bg-green-500 text-white' 
                    : currentStep === index 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500' 
                      : 'bg-neutral-700 text-neutral-400'}
                `}>
                  {completedSteps.includes(s.id) ? (
                    <Check size={14} />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span className="text-sm truncate">{s.title}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-neutral-700">
            <div className="text-neutral-400 text-sm mb-2">完成进度</div>
            <div className="w-full bg-neutral-700 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-right text-neutral-400 text-xs mt-1">
              {completedSteps.length}/{steps.length} 步骤
            </div>
          </div>
        </div>
        
        {/* 当前步骤内容 */}
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {currentStep + 1}. {step.title}
            </h3>
            <button
              onClick={() => toggleStepCompletion(step.id)}
              className={`
                flex items-center px-3 py-1.5 rounded text-sm
                ${completedSteps.includes(step.id) 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-neutral-800 text-neutral-400 border border-neutral-700'}
              `}
            >
              {completedSteps.includes(step.id) ? (
                <>
                  <Check size={14} className="mr-1.5" />
                  已完成
                </>
              ) : (
                '标记为已完成'
              )}
            </button>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-neutral-300">{step.description}</p>
            
            {/* 步骤图片 */}
            {step.image && (
              <div className="my-6 border border-neutral-800 rounded-lg overflow-hidden">
                <Image 
                  src={step.image} 
                  alt={step.title} 
                  width={800} 
                  height={450} 
                  className="w-full h-auto" 
                />
                <div className="bg-neutral-800 p-2 flex justify-end">
                  <button className="text-neutral-400 hover:text-white p-1">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            )}
            
            {/* 代码块 */}
            {step.code && (
              <div className="my-6">
                <div className="flex items-center justify-between bg-neutral-800 px-4 py-2 rounded-t-lg">
                  <span className="text-sm text-neutral-400">{step.code.language}</span>
                  <button 
                    onClick={() => copyCode(step.code!.content)}
                    className="text-neutral-400 hover:text-white p-1"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <pre className="bg-neutral-950 p-4 rounded-b-lg overflow-x-auto">
                  <code className="text-neutral-300 text-sm font-mono">
                    {step.code.content}
                  </code>
                </pre>
              </div>
            )}
            
            {/* 提示信息 */}
            {step.tips && step.tips.length > 0 && (
              <div className="mt-6 bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-2">提示</h4>
                <ul className="space-y-2">
                  {step.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span className="text-neutral-300 text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* 导航按钮 */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center px-4 py-2 rounded bg-neutral-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} className="mr-1" />
              上一步
            </button>
            
            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className="flex items-center px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一步
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
      
      {/* 教程底部 */}
      <div className="p-6 border-t border-neutral-800 bg-neutral-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="text-neutral-400 text-sm">
            最后更新于 {new Date().toLocaleDateString('zh-CN')}
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <a 
              href="#" 
              className="text-neutral-400 hover:text-white text-sm flex items-center"
            >
              <Download size={14} className="mr-1.5" />
              下载PDF版
            </a>
            
            <a 
              href="#" 
              className="text-neutral-400 hover:text-white text-sm flex items-center"
            >
              <ExternalLink size={14} className="mr-1.5" />
              查看视频教程
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}