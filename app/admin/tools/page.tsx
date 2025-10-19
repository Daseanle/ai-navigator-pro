'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw, Star, Settings, Wrench, Zap, BarChart2, Loader2 } from 'lucide-react';

export default function ToolsManagementPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTools: 0,
    newToolsThisWeek: 0,
    pendingReviews: 0,
    reviewedTools: 0,
    averageRating: 0,
    popularCategories: [
      { name: '内容创作', count: 0 },
      { name: '图像生成', count: 0 },
      { name: '编程工具', count: 0 },
      { name: '生产力工具', count: 0 },
      { name: '数据分析', count: 0 }
    ]
  });

  // 模拟加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 模拟数据
        setStats({
          totalTools: 248,
          newToolsThisWeek: 17,
          pendingReviews: 32,
          reviewedTools: 216,
          averageRating: 4.2,
          popularCategories: [
            { name: '内容创作', count: 78 },
            { name: '图像生成', count: 56 },
            { name: '编程工具', count: 42 },
            { name: '生产力工具', count: 39 },
            { name: '数据分析', count: 33 }
          ]
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('加载工具统计数据失败', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <h3 className="text-xl font-medium text-neutral-300">加载工具管理数据中...</h3>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* 页面标题 */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">工具管理</h1>
        <p className="text-neutral-400">管理AI工具库、同步和评测流程</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="总工具数" 
          value={stats.totalTools} 
          icon={<Wrench className="h-5 w-5 text-blue-500" />}
          bgColor="bg-blue-500/10"
          borderColor="border-blue-500/20"
          textColor="text-blue-500"
        />
        
        <StatCard 
          title="本周新增" 
          value={stats.newToolsThisWeek} 
          icon={<Zap className="h-5 w-5 text-amber-500" />}
          bgColor="bg-amber-500/10"
          borderColor="border-amber-500/20"
          textColor="text-amber-500"
        />
        
        <StatCard 
          title="待评测工具" 
          value={stats.pendingReviews} 
          icon={<Star className="h-5 w-5 text-pink-500" />}
          bgColor="bg-pink-500/10"
          borderColor="border-pink-500/20"
          textColor="text-pink-500"
        />
        
        <StatCard 
          title="平均评分" 
          value={stats.averageRating.toFixed(1)} 
          icon={<BarChart2 className="h-5 w-5 text-indigo-500" />}
          bgColor="bg-indigo-500/10"
          borderColor="border-indigo-500/20"
          textColor="text-indigo-500"
        />
      </div>

      {/* 主要功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FunctionCard 
          title="工具同步" 
          description="从外部API同步AI工具数据，更新工具库" 
          icon={<RefreshCw className="h-6 w-6 text-blue-500" />}
          bgColor="from-blue-900/20 to-blue-800/5"
          borderColor="border-blue-500/20"
          linkHref="/admin/tools/sync"
          stats={[
            { label: '上次同步', value: '2小时前' },
            { label: '同步频率', value: '每12小时' },
          ]}
        />
        
        <FunctionCard 
          title="工具评测" 
          description="管理AI工具的自动评测流程和评测历史" 
          icon={<Star className="h-6 w-6 text-amber-500" />}
          bgColor="from-amber-900/20 to-amber-800/5"
          borderColor="border-amber-500/20"
          linkHref="/admin/tools/reviews"
          stats={[
            { label: '已评测', value: `${stats.reviewedTools}个` },
            { label: '待评测', value: `${stats.pendingReviews}个` },
          ]}
        />
      </div>

      {/* 热门分类 */}
      <div className="bg-neutral-800/30 backdrop-blur-sm rounded-xl p-6 border border-neutral-700/30 hover:border-indigo-500/30 transition-all duration-300 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">热门工具分类</h2>
          <Link 
            href="/admin/tools/categories" 
            className="text-indigo-400 hover:text-indigo-300 flex items-center transition-all duration-300 hover:translate-x-1"
          >
            查看全部 <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.popularCategories.map((category, index) => (
            <div 
              key={index}
              className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-700/50 hover:border-indigo-500/30 hover:bg-neutral-800/50 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <span className="text-neutral-300 font-medium">{category.name}</span>
                <span className="text-indigo-400 font-semibold">{category.count}个</span>
              </div>
              <div className="mt-2 w-full bg-neutral-700/30 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-indigo-300 h-2 rounded-full" 
                  style={{ width: `${(category.count / stats.totalTools) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 快速链接 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickLinkCard 
          title="评测设置" 
          description="配置评测标准和自动评测参数" 
          icon={<Settings className="h-5 w-5 text-pink-500" />}
          href="/admin/tools/reviews/settings"
          color="pink"
        />
        
        <QuickLinkCard 
          title="自动运营" 
          description="配置工具同步和评测的自动化流程" 
          icon={<Zap className="h-5 w-5 text-amber-500" />}
          href="/admin/auto-operation"
          color="amber"
        />
        
        <QuickLinkCard 
          title="数据分析" 
          description="查看工具使用和评测的数据分析" 
          icon={<BarChart2 className="h-5 w-5 text-blue-500" />}
          href="/admin/analytics"
          color="blue"
        />
      </div>
    </div>
  );
}

// 统计卡片组件
type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  textColor: string;
};

function StatCard({ title, value, icon, bgColor, borderColor, textColor }: StatCardProps) {
  return (
    <div className={`${bgColor} ${borderColor} border rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:translate-y-[-5px]`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-neutral-300 font-medium">{title}</h3>
        <div className="p-2 rounded-lg bg-neutral-800/50">
          {icon}
        </div>
      </div>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}

// 功能卡片组件
type FunctionCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  linkHref: string;
  stats: Array<{ label: string; value: string }>;
};

function FunctionCard({ title, description, icon, bgColor, borderColor, linkHref, stats }: FunctionCardProps) {
  return (
    <div className={`border ${borderColor} rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]`}>
      <div className={`bg-gradient-to-br ${bgColor} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-neutral-900/30 mr-4">
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
          <Link 
            href={linkHref}
            className="p-2 rounded-full bg-neutral-900/30 hover:bg-neutral-800/50 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
          >
            <ArrowRight className="h-5 w-5 text-white" />
          </Link>
        </div>
        
        <p className="text-neutral-300 mb-6">{description}</p>
        
        <div className="flex justify-between items-center bg-neutral-900/30 rounded-lg p-3">
          {stats.map((stat, index) => (
            <div key={index} className="text-center px-4">
              <p className="text-neutral-400 text-sm">{stat.label}</p>
              <p className="text-white font-medium">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 快速链接卡片组件
type QuickLinkCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: 'blue' | 'pink' | 'amber' | 'indigo';
};

function QuickLinkCard({ title, description, icon, href, color }: QuickLinkCardProps) {
  const colorMap = {
    blue: "hover:border-blue-500/30 hover:bg-blue-900/10",
    pink: "hover:border-pink-500/30 hover:bg-pink-900/10",
    amber: "hover:border-amber-500/30 hover:bg-amber-900/10",
    indigo: "hover:border-indigo-500/30 hover:bg-indigo-900/10",
  };
  
  return (
    <Link href={href}>
      <div className={`bg-neutral-800/30 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/30 ${colorMap[color]} transition-all duration-300 shadow-md h-full flex items-center hover:translate-x-1`}>
        <div className="p-2 rounded-lg bg-neutral-900/50 mr-4">
          {icon}
        </div>
        <div>
          <h3 className="text-white font-medium">{title}</h3>
          <p className="text-neutral-400 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
}