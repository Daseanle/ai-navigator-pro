'use client';

import React, { useState } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, Info, ChevronDown, ChevronUp } from 'lucide-react';

type TrendData = {
  date: string;
  value: number;
};

type ToolTrend = {
  id: string;
  name: string;
  category: string;
  currentRank: number;
  previousRank: number;
  growthRate: number;
  searchVolume: TrendData[];
  userCount: TrendData[];
};

type TrendAnalysisProps = {
  trends: ToolTrend[];
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void;
  className?: string;
};

export default function TrendAnalysis({
  trends,
  timeRange = '30d',
  onTimeRangeChange,
  className = ''
}: TrendAnalysisProps) {
  const [sortBy, setSortBy] = useState<'rank' | 'growth'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  
  // 切换排序方式
  const toggleSort = (field: 'rank' | 'growth') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  // 切换工具展开/折叠状态
  const toggleToolExpand = (toolId: string) => {
    setExpandedTool(prev => prev === toolId ? null : toolId);
  };

  // 排序工具
  const sortedTrends = [...trends].sort((a, b) => {
    if (sortBy === 'rank') {
      return sortOrder === 'asc' 
        ? a.currentRank - b.currentRank 
        : b.currentRank - a.currentRank;
    } else {
      return sortOrder === 'asc' 
        ? a.growthRate - b.growthRate 
        : b.growthRate - a.growthRate;
    }
  });

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">AI工具趋势分析</h2>
        <div className="flex space-x-2">
          <select 
            value={timeRange} 
            onChange={(e) => onTimeRangeChange?.(e.target.value as any)}
            className="border rounded px-2 py-1 text-sm bg-white"
          >
            <option value="7d">过去7天</option>
            <option value="30d">过去30天</option>
            <option value="90d">过去90天</option>
            <option value="1y">过去1年</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left text-sm font-medium text-gray-500">工具名称</th>
              <th 
                className="py-2 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => toggleSort('rank')}
              >
                <div className="flex items-center">
                  <span>当前排名</span>
                  {sortBy === 'rank' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  )}
                </div>
              </th>
              <th className="py-2 text-left text-sm font-medium text-gray-500">排名变化</th>
              <th 
                className="py-2 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => toggleSort('growth')}
              >
                <div className="flex items-center">
                  <span>增长率</span>
                  {sortBy === 'growth' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  )}
                </div>
              </th>
              <th className="py-2 text-left text-sm font-medium text-gray-500">趋势</th>
            </tr>
          </thead>
          <tbody>
            {sortedTrends.map((tool) => (
              <React.Fragment key={tool.id}>
                <tr 
                  className={`border-b hover:bg-gray-50 ${expandedTool === tool.id ? 'bg-gray-50' : ''}`}
                  onClick={() => toggleToolExpand(tool.id)}
                >
                  <td className="py-3 text-sm">
                    <div className="font-medium text-gray-900">{tool.name}</div>
                    <div className="text-xs text-gray-500">{tool.category}</div>
                  </td>
                  <td className="py-3 text-sm">{tool.currentRank}</td>
                  <td className="py-3 text-sm">
                    {tool.previousRank > tool.currentRank ? (
                      <div className="flex items-center text-green-600">
                        <ArrowUp size={14} className="mr-1" />
                        <span>{tool.previousRank - tool.currentRank}</span>
                      </div>
                    ) : tool.previousRank < tool.currentRank ? (
                      <div className="flex items-center text-red-600">
                        <ArrowDown size={14} className="mr-1" />
                        <span>{tool.currentRank - tool.previousRank}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="py-3 text-sm">
                    <div className={`flex items-center ${tool.growthRate > 0 ? 'text-green-600' : tool.growthRate < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                      {tool.growthRate > 0 ? (
                        <ArrowUp size={14} className="mr-1" />
                      ) : tool.growthRate < 0 ? (
                        <ArrowDown size={14} className="mr-1" />
                      ) : null}
                      <span>{Math.abs(tool.growthRate)}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm">
                    <MiniTrendChart 
                      data={tool.searchVolume} 
                      trendColor={tool.growthRate > 0 ? '#10b981' : tool.growthRate < 0 ? '#ef4444' : '#9ca3af'}
                    />
                  </td>
                </tr>
                {expandedTool === tool.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="py-4 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2 flex items-center">
                            <TrendingUp size={16} className="mr-1 text-blue-500" />
                            搜索量趋势
                          </h3>
                          <DetailedTrendChart 
                            data={tool.searchVolume} 
                            trendColor="#3b82f6"
                            height={200}
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2 flex items-center">
                            <TrendingUp size={16} className="mr-1 text-purple-500" />
                            用户数趋势
                          </h3>
                          <DetailedTrendChart 
                            data={tool.userCount} 
                            trendColor="#8b5cf6"
                            height={200}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 flex items-center">
        <Info size={12} className="mr-1" />
        <span>数据更新于 {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}

type MiniTrendChartProps = {
  data: TrendData[];
  trendColor: string;
};

function MiniTrendChart({ data, trendColor }: MiniTrendChartProps) {
  if (!data || data.length === 0) return <div className="h-8 w-16">无数据</div>;
  
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1; // 避免除以零
  
  // 生成SVG路径点
  const width = 60;
  const height = 30;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="relative h-8 w-16">
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={`M0,${height - ((data[0].value - min) / range) * height} L${points}`}
          fill="none"
          stroke={trendColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* 趋势线下方的渐变填充 */}
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
        </linearGradient>
        <polygon
          points={`0,${height} ${points} ${width},${height}`}
          fill="url(#gradient)"
        />
      </svg>
    </div>
  );
}

type DetailedTrendChartProps = {
  data: TrendData[];
  trendColor: string;
  height: number;
};

function DetailedTrendChart({ data, trendColor, height }: DetailedTrendChartProps) {
  if (!data || data.length === 0) return <div className={`h-${height} w-full flex items-center justify-center`}>无数据</div>;
  
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1; // 避免除以零
  
  return (
    <div className="relative" style={{ height: `${height}px` }}>
      {/* 趋势线 */}
      <svg width="100%" height="100%" className="overflow-visible">
        <path
          d={data.map((d, i) => {
            const x = `${(i / (data.length - 1)) * 100}%`;
            const y = `${100 - ((d.value - min) / range) * 100}%`;
            return `${i === 0 ? 'M' : 'L'}${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke={trendColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* 趋势线下方的渐变填充 */}
        <linearGradient id="detailedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={trendColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
        </linearGradient>
        <path
          d={`${data.map((d, i) => {
            const x = `${(i / (data.length - 1)) * 100}%`;
            const y = `${100 - ((d.value - min) / range) * 100}%`;
            return `${i === 0 ? 'M' : 'L'}${x},${y}`;
          }).join(' ')} L100%,100% L0,100% Z`}
          fill="url(#detailedGradient)"
        />
      </svg>
      
      {/* 数据点 */}
      <div className="absolute inset-0 flex justify-between pointer-events-none">
        {data.map((d, i) => {
          const y = 100 - ((d.value - min) / range) * 100;
          return (
            <div key={i} className="relative h-full flex items-center" style={{ width: '1px' }}>
              <div 
                className="absolute w-1.5 h-1.5 rounded-full bg-white border-2"
                style={{ 
                  borderColor: trendColor,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
            </div>
          );
        })}
      </div>
      
      {/* Y轴标签 */}
      <div className="absolute left-0 inset-y-0 flex flex-col justify-between pointer-events-none">
        <div className="text-xs text-neutral-500">{max.toLocaleString()}</div>
        <div className="text-xs text-neutral-500">{((max + min) / 2).toLocaleString()}</div>
        <div className="text-xs text-neutral-500">{min.toLocaleString()}</div>
      </div>
      
      {/* X轴标签 */}
      <div className="absolute bottom-0 inset-x-0 flex justify-between mt-1 pointer-events-none">
        {data.map((d, i) => (
          i % Math.ceil(data.length / 5) === 0 ? (
            <div key={i} className="text-xs text-neutral-500" style={{ width: '40px', marginLeft: i === 0 ? '0' : '-20px' }}>
              {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
}