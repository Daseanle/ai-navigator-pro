'use client';

import { useState } from 'react';
import { Tag, Filter, ChevronDown, ChevronUp } from 'lucide-react';

type TagDimension = {
  id: string;
  name: string;
  description?: string;
  tags: {
    id: string;
    name: string;
    count?: number;
  }[];
};

type TagSystemProps = {
  dimensions: TagDimension[];
  onFilterChange?: (selectedTags: Record<string, string[]>) => void;
  className?: string;
  compact?: boolean;
};

export default function TagSystem({ 
  dimensions, 
  onFilterChange,
  className = '',
  compact = false
}: TagSystemProps) {
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>({});
  const [expandedDimensions, setExpandedDimensions] = useState<Record<string, boolean>>(
    dimensions.reduce((acc, dim) => ({ ...acc, [dim.id]: !compact }), {})
  );

  const toggleDimension = (dimensionId: string) => {
    setExpandedDimensions(prev => ({
      ...prev,
      [dimensionId]: !prev[dimensionId]
    }));
  };

  const toggleTag = (dimensionId: string, tagId: string) => {
    setSelectedTags(prev => {
      const currentTags = prev[dimensionId] || [];
      const newTags = currentTags.includes(tagId)
        ? currentTags.filter(id => id !== tagId)
        : [...currentTags, tagId];
      
      const result = {
        ...prev,
        [dimensionId]: newTags
      };
      
      // 如果标签数组为空，则删除该维度的键
      if (newTags.length === 0) {
        delete result[dimensionId];
      }
      
      // 调用回调函数
      if (onFilterChange) {
        onFilterChange(result);
      }
      
      return result;
    });
  };

  const clearFilters = () => {
    setSelectedTags({});
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  // 计算已选择的标签总数
  const selectedTagsCount = Object.values(selectedTags).reduce(
    (count, tags) => count + tags.length, 0
  );

  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl p-5 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Filter size={18} />
          多维筛选
        </h3>
        {selectedTagsCount > 0 && (
          <button 
            onClick={clearFilters}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            清除筛选 ({selectedTagsCount})
          </button>
        )}
      </div>

      <div className="space-y-4">
        {dimensions.map(dimension => (
          <div key={dimension.id} className="border-t border-neutral-800 pt-4 first:border-0 first:pt-0">
            <button 
              onClick={() => toggleDimension(dimension.id)}
              className="w-full flex justify-between items-center text-left"
            >
              <span className="font-medium text-white">{dimension.name}</span>
              {expandedDimensions[dimension.id] ? 
                <ChevronUp size={18} className="text-neutral-400" /> : 
                <ChevronDown size={18} className="text-neutral-400" />
              }
            </button>
            
            {dimension.description && (
              <p className="text-sm text-neutral-400 mt-1">{dimension.description}</p>
            )}
            
            {expandedDimensions[dimension.id] && (
              <div className="mt-3 flex flex-wrap gap-2">
                {dimension.tags.map(tag => {
                  const isSelected = (selectedTags[dimension.id] || []).includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(dimension.id, tag.id)}
                      className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
                    >
                      <span>{tag.name}</span>
                      {tag.count !== undefined && (
                        <span className={`text-xs ${isSelected ? 'text-blue-200' : 'text-neutral-400'}`}>
                          {tag.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}