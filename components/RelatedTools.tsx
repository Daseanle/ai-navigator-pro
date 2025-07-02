import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import type { ToolDetail } from '@/types';

type RelatedToolsProps = {
  currentToolId: number;
  tools: Partial<ToolDetail>[];
  title?: string;
  showViewAll?: boolean;
  className?: string;
};

export default function RelatedTools({
  currentToolId,
  tools,
  title = '相关工具推荐',
  showViewAll = true,
  className = '',
}: RelatedToolsProps) {
  // 过滤掉当前工具
  const filteredTools = tools.filter(tool => tool.id !== currentToolId);
  
  // 如果没有相关工具，则不显示
  if (filteredTools.length === 0) {
    return null;
  }

  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden ${className}`}>
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {showViewAll && (
            <Link href="/tools" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              查看全部
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-1 gap-4">
          {filteredTools.slice(0, 3).map((tool) => (
            <Link 
              key={tool.id} 
              href={`/tool/${tool.slug}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center p-1 flex-shrink-0">
                <img 
                  src={tool.logo_url} 
                  alt={`${tool.name} logo`} 
                  className="object-contain max-w-full max-h-full" 
                />
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-white truncate">{tool.name}</h4>
                  {tool.reviews && tool.reviews[0]?.score_overall && (
                    <div className="flex items-center text-xs bg-neutral-800 px-1.5 py-0.5 rounded">
                      <Star size={12} className="text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-white">
                        {tool.reviews[0].score_overall.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-neutral-400 truncate">{tool.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}