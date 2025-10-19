'use client';

import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, Info } from 'lucide-react';
import Image from 'next/image';

type Feature = {
  id: string;
  name: string;
  description: string;
  category: string;
};

type ToolFeature = {
  toolId: string;
  featureId: string;
  supported: boolean;
  notes?: string;
};

type Tool = {
  id: string;
  name: string;
  logo: string;
  pricing: {
    free: boolean;
    freeTrial: boolean;
    startingPrice?: string;
    hasPremium: boolean;
  };
  rating: number;
  url: string;
};

type ToolComparisonProps = {
  tools: Tool[];
  features: Feature[];
  toolFeatures: ToolFeature[];
  className?: string;
};

export default function ToolComparison({
  tools,
  features,
  toolFeatures,
  className = ''
}: ToolComparisonProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedFeatures, setExpandedFeatures] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>(tools.slice(0, 3).map(t => t.id));
  
  // 获取所有特性分类
  const categories = Array.from(new Set(features.map(f => f.category)));
  
  // 切换分类展开/折叠状态
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // 切换特性说明展开/折叠状态
  const toggleFeature = (featureId: string) => {
    setExpandedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };
  
  // 切换工具选择状态
  const toggleTool = (toolId: string) => {
    setSelectedTools(prev => {
      // 如果已经选择了，则移除
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      }
      
      // 如果选择数量已达到3个，则替换最早选择的
      if (prev.length >= 3) {
        return [...prev.slice(1), toolId];
      }
      
      // 否则添加到选择列表
      return [...prev, toolId];
    });
  };
  
  // 获取工具对特性的支持状态
  const getFeatureSupport = (toolId: string, featureId: string) => {
    const toolFeature = toolFeatures.find(
      tf => tf.toolId === toolId && tf.featureId === featureId
    );
    
    return toolFeature ? toolFeature.supported : false;
  };
  
  // 获取工具对特性的备注
  const getFeatureNotes = (toolId: string, featureId: string) => {
    const toolFeature = toolFeatures.find(
      tf => tf.toolId === toolId && tf.featureId === featureId
    );
    
    return toolFeature?.notes || '';
  };
  
  // 获取选中的工具
  const getSelectedTools = () => {
    return tools.filter(tool => selectedTools.includes(tool.id));
  };
  
  // 格式化价格
  const formatPrice = (tool: Tool) => {
    if (tool.pricing.free && !tool.pricing.hasPremium) {
      return '完全免费';
    }
    
    if (tool.pricing.free && tool.pricing.hasPremium) {
      return '免费起步';
    }
    
    if (tool.pricing.freeTrial) {
      return `${tool.pricing.startingPrice}/月 (有免费试用)`;
    }
    
    return tool.pricing.startingPrice ? `${tool.pricing.startingPrice}/月` : '付费';
  };

  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden ${className}`}>
      {/* 工具选择器 */}
      <div className="p-6 border-b border-neutral-800">
        <h2 className="text-xl font-bold text-white mb-4">AI工具对比</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {tools.map(tool => (
            <div 
              key={tool.id}
              onClick={() => toggleTool(tool.id)}
              className={`
                flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all
                ${selectedTools.includes(tool.id) 
                  ? 'bg-blue-900/30 border border-blue-500/50' 
                  : 'bg-neutral-800 border border-neutral-700 hover:border-neutral-600'}
              `}
            >
              <div className="w-12 h-12 relative mb-2">
                <Image 
                  src={tool.logo} 
                  alt={tool.name} 
                  width={48} 
                  height={48} 
                  className="rounded-md object-contain" 
                />
              </div>
              <span className="text-sm text-center text-white font-medium truncate w-full">
                {tool.name}
              </span>
              {selectedTools.includes(tool.id) && (
                <span className="mt-1 text-xs text-blue-400">已选择</span>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-neutral-400">
          选择最多3个工具进行对比 ({selectedTools.length}/3)
        </div>
      </div>
      
      {/* 对比表格 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* 表头 - 工具信息 */}
          <thead>
            <tr className="bg-neutral-800/50">
              <th className="p-4 text-left text-neutral-400 font-medium w-1/4">功能/工具</th>
              {getSelectedTools().map(tool => (
                <th key={tool.id} className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 relative mb-2">
                      <Image 
                        src={tool.logo} 
                        alt={tool.name} 
                        width={48} 
                        height={48} 
                        className="rounded-md object-contain" 
                      />
                    </div>
                    <span className="text-white font-medium">{tool.name}</span>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.round(tool.rating) ? 'text-yellow-400' : 'text-neutral-600'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm text-neutral-400">{tool.rating.toFixed(1)}</span>
                    </div>
                    <div className="mt-2 text-sm text-neutral-400">
                      {formatPrice(tool)}
                    </div>
                    <a 
                      href={tool.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                    >
                      访问官网
                    </a>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {/* 按分类显示特性 */}
            {categories.map(category => (
              <React.Fragment key={`category-section-${category}`}>
                {/* 分类标题行 */}
                <tr className="border-t border-neutral-800 bg-neutral-800/30">
                  <td 
                    colSpan={4} 
                    className="p-4 cursor-pointer hover:bg-neutral-800/50"
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex items-center">
                      {expandedCategories.includes(category) ? (
                        <ChevronUp size={18} className="text-neutral-400 mr-2" />
                      ) : (
                        <ChevronDown size={18} className="text-neutral-400 mr-2" />
                      )}
                      <span className="font-medium text-white">{category}</span>
                    </div>
                  </td>
                </tr>
                
                {/* 分类下的特性行 */}
                {expandedCategories.includes(category) && features
                  .filter(feature => feature.category === category)
                  .map(feature => (
                    <React.Fragment key={`feature-section-${feature.id}`}>
                      <tr className="border-t border-neutral-800/50">
                        <td className="p-4 pl-8">
                          <div className="flex items-center">
                            <span className="text-white">{feature.name}</span>
                            <button 
                              onClick={() => toggleFeature(feature.id)}
                              className="ml-2 text-neutral-500 hover:text-neutral-300"
                            >
                              <Info size={14} />
                            </button>
                          </div>
                        </td>
                        
                        {getSelectedTools().map(tool => (
                          <td key={`${tool.id}-${feature.id}`} className="p-4 text-center">
                            {getFeatureSupport(tool.id, feature.id) ? (
                              <div className="flex flex-col items-center">
                                <Check size={20} className="text-green-500" />
                                {getFeatureNotes(tool.id, feature.id) && (
                                  <span className="mt-1 text-xs text-neutral-400">
                                    {getFeatureNotes(tool.id, feature.id)}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <X size={20} className="text-red-500 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                      
                      {/* 特性描述行 */}
                      {expandedFeatures.includes(feature.id) && (
                        <tr className="bg-neutral-800/20">
                          <td colSpan={4} className="p-4 pl-8 text-sm text-neutral-400">
                            {feature.description}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                }
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}