'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// 定义图表数据类型
interface ChartData {
  labels: string[];
  values: number[];
}

// 定义统计数据类型
interface Stats {
  totalVisits: number;
  uniqueVisitors: number;
  averageSessionDuration: string;
  bounceRate: string;
  topTools: { name: string; visits: number }[];
  topCategories: { name: string; visits: number }[];
  topSearchTerms: { term: string; count: number }[];
  visitsOverTime: ChartData;
  newUsersOverTime: ChartData;
  toolViewsOverTime: ChartData;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  // 加载分析数据
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 实际项目中应该从数据库或分析API获取数据
        // 这里使用模拟数据
        
        // 生成过去30天的日期标签
        const dateLabels = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        
        // 生成随机访问数据
        const generateRandomData = (min: number, max: number, length: number) => {
          return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
        };
        
        const visitsData = generateRandomData(100, 500, 30);
        const newUsersData = generateRandomData(20, 100, 30);
        const toolViewsData = generateRandomData(200, 800, 30);
        
        // 模拟统计数据
        const mockStats: Stats = {
          totalVisits: visitsData.reduce((sum, val) => sum + val, 0),
          uniqueVisitors: Math.floor(visitsData.reduce((sum, val) => sum + val, 0) * 0.7),
          averageSessionDuration: '3分42秒',
          bounceRate: '32.5%',
          topTools: [
            { name: 'ChatGPT', visits: 1245 },
            { name: 'Midjourney', visits: 982 },
            { name: 'Stable Diffusion', visits: 876 },
            { name: 'Claude', visits: 754 },
            { name: 'Dall-E', visits: 621 },
          ],
          topCategories: [
            { name: '聊天机器人', visits: 2340 },
            { name: '图像生成', visits: 1890 },
            { name: '内容创作', visits: 1456 },
            { name: '代码助手', visits: 1123 },
            { name: '音频处理', visits: 876 },
          ],
          topSearchTerms: [
            { term: 'AI聊天', count: 342 },
            { term: '图片生成', count: 287 },
            { term: '免费AI工具', count: 253 },
            { term: '代码生成', count: 198 },
            { term: 'AI写作', count: 176 },
          ],
          visitsOverTime: {
            labels: dateLabels,
            values: visitsData,
          },
          newUsersOverTime: {
            labels: dateLabels,
            values: newUsersData,
          },
          toolViewsOverTime: {
            labels: dateLabels,
            values: toolViewsData,
          },
        };
        
        setStats(mockStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载分析数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [timeRange]);

  // 渲染图表（简化版，实际项目中应使用Chart.js或其他图表库）
  const renderChart = (data: ChartData, title: string, color: string) => {
    const maxValue = Math.max(...data.values);
    
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        
        <div className="h-64 flex items-end space-x-1">
          {data.values.map((value, index) => {
            const height = (value / maxValue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full ${color} rounded-t`} 
                  style={{ height: `${height}%` }}
                  title={`${data.labels[index]}: ${value}`}
                ></div>
                {index % 5 === 0 && (
                  <span className="text-xs text-neutral-500 mt-1">{data.labels[index]}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 渲染排名列表
  const renderRankingList = (items: { name: string; visits: number }[] | { term: string; count: number }[], title: string) => {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        
        <div className="space-y-3">
          {items.map((item, index) => {
            const name = 'name' in item ? item.name : item.term;
            const value = 'visits' in item ? item.visits : item.count;
            const maxValue = Math.max(...items.map(i => 'visits' in i ? i.visits : i.count));
            const percentage = (value / maxValue) * 100;
            
            return (
              <div key={index} className="flex items-center">
                <span className="text-neutral-400 w-8">{index + 1}.</span>
                <span className="text-white flex-1">{name}</span>
                <div className="w-32 bg-neutral-800 h-2 rounded-full overflow-hidden mr-3">
                  <div 
                    className="bg-blue-500 h-full rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-neutral-300 w-16 text-right">{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">数据分析</h1>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeRange('day')} 
            className={`px-4 py-2 rounded-lg ${timeRange === 'day' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
          >
            今日
          </button>
          <button 
            onClick={() => setTimeRange('week')} 
            className={`px-4 py-2 rounded-lg ${timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
          >
            本周
          </button>
          <button 
            onClick={() => setTimeRange('month')} 
            className={`px-4 py-2 rounded-lg ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
          >
            本月
          </button>
          <button 
            onClick={() => setTimeRange('year')} 
            className={`px-4 py-2 rounded-lg ${timeRange === 'year' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
          >
            今年
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-800/30 rounded-xl p-4 mb-8">
          <p className="text-red-400">{error}</p>
        </div>
      ) : stats ? (
        <>
          {/* 概览统计 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <p className="text-neutral-400 text-sm">总访问量</p>
              <p className="text-3xl font-bold text-white">{stats.totalVisits.toLocaleString()}</p>
            </div>
            
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <p className="text-neutral-400 text-sm">独立访客</p>
              <p className="text-3xl font-bold text-white">{stats.uniqueVisitors.toLocaleString()}</p>
            </div>
            
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <p className="text-neutral-400 text-sm">平均会话时长</p>
              <p className="text-3xl font-bold text-white">{stats.averageSessionDuration}</p>
            </div>
            
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <p className="text-neutral-400 text-sm">跳出率</p>
              <p className="text-3xl font-bold text-white">{stats.bounceRate}</p>
            </div>
          </div>
          
          {/* 图表 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {renderChart(stats.visitsOverTime, '访问量趋势', 'bg-blue-500')}
            {renderChart(stats.newUsersOverTime, '新用户趋势', 'bg-green-500')}
          </div>
          
          <div className="mb-8">
            {renderChart(stats.toolViewsOverTime, '工具浏览量趋势', 'bg-purple-500')}
          </div>
          
          {/* 排名列表 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderRankingList(stats.topTools, '热门工具')}
            {renderRankingList(stats.topCategories, '热门分类')}
            {renderRankingList(stats.topSearchTerms, '热门搜索词')}
          </div>
        </>
      ) : null}
    </div>
  );
}