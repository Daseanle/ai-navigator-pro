import Link from 'next/link';
import { Settings, RefreshCw, Database, Users, BarChart, DollarSign, FileText, Search, Star, Zap } from 'lucide-react';

interface AdminMenuItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

export default function AdminPage() {
  const menuItems: AdminMenuItem[] = [
    {
      title: '全自动网站运营',
      description: '一键执行工具同步、评测生成、内容更新和SEO优化',
      href: '/admin/auto-operation',
      icon: <Zap size={24} />,
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      title: 'AI工具管理',
      description: '管理AI工具库、同步和评测流程',
      href: '/admin/tools',
      icon: <RefreshCw size={24} />,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: '工具评测管理',
      description: '自动生成AI工具专业评测和评分',
      href: '/admin/tools/reviews',
      icon: <Star size={24} />,
      color: 'bg-amber-600 hover:bg-amber-700'
    },
    {
      title: '数据库管理',
      description: '管理工具、分类、标签和评论数据',
      href: '/admin/database',
      icon: <Database size={24} />,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: '用户管理',
      description: '管理用户账户、权限和角色',
      href: '/admin/users',
      icon: <Users size={24} />,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: '博客管理',
      description: '管理博客文章、分类和评论',
      href: '/admin/blog',
      icon: <FileText size={24} />,
      color: 'bg-pink-600 hover:bg-pink-700'
    },
    {
      title: 'SEO自动化',
      description: '自动生成SEO优化内容，提高搜索引擎展现次数',
      href: '/admin/seo',
      icon: <Search size={24} />,
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      title: '广告管理',
      description: '管理网站广告、赞助商和变现策略',
      href: '/admin/ads',
      icon: <DollarSign size={24} />,
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      title: '系统设置',
      description: '配置网站设置、API密钥和集成',
      href: '/admin/settings',
      icon: <Settings size={24} />,
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      title: '数据分析',
      description: '查看网站流量、用户行为和工具使用统计',
      href: '/admin/analytics',
      icon: <BarChart size={24} />,
      color: 'bg-teal-600 hover:bg-teal-700'
    }
  ];
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">管理员控制台</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.href}
            className="block bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg ${item.color} mr-4`}>
                {item.icon}
              </div>
              <h2 className="text-xl font-semibold text-white">{item.title}</h2>
            </div>
            <p className="text-neutral-400">{item.description}</p>
          </Link>
        ))}
      </div>
      
      <div className="mt-12 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">系统状态</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-800 rounded-lg p-4">
            <p className="text-neutral-400 text-sm mb-1">工具同步状态</p>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <p className="text-white">正在运行</p>
            </div>
          </div>
          
          <div className="bg-neutral-800 rounded-lg p-4">
            <p className="text-neutral-400 text-sm mb-1">最近同步时间</p>
            <p className="text-white">{new Date().toLocaleString()}</p>
          </div>
          
          <div className="bg-neutral-800 rounded-lg p-4">
            <p className="text-neutral-400 text-sm mb-1">下次同步时间</p>
            <p className="text-white">
              {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-neutral-800 rounded-lg p-4">
            <p className="text-neutral-400 text-sm mb-1">评测自动化状态</p>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <p className="text-white">已启用</p>
            </div>
          </div>
          
          <div className="bg-neutral-800 rounded-lg p-4">
            <p className="text-neutral-400 text-sm mb-1">待评测工具</p>
            <p className="text-white">12 个</p>
          </div>
          
          <div className="bg-neutral-800 rounded-lg p-4">
            <p className="text-neutral-400 text-sm mb-1">下次评测时间</p>
            <p className="text-white">
              {new Date(Date.now() + 12 * 60 * 60 * 1000).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}