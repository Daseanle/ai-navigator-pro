'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>('user-permissions');

  // 帮助文档数据
  const helpItems = [
    {
      id: 'user-permissions',
      title: '用户权限管理',
      content: (
        <div className="space-y-4">
          <p>
            用户权限管理功能允许管理员控制不同用户对系统功能的访问权限。
          </p>
          
          <h3 className="text-lg font-medium text-white mt-4">主要功能</h3>
          <ul className="list-disc pl-5 mt-2 text-gray-300">
            <li>创建和管理用户角色</li>
            <li>为角色分配权限</li>
            <li>查看用户权限</li>
            <li>修改用户角色</li>
          </ul>
          
          <h3 className="text-lg font-medium text-white mt-4">操作步骤</h3>
          <ol className="list-decimal pl-5 mt-2 text-gray-300">
            <li>进入「用户管理」页面</li>
            <li>点击「角色管理」标签</li>
            <li>点击「新建角色」按钮</li>
            <li>填写角色名称和描述</li>
            <li>勾选需要的权限</li>
            <li>点击「保存」按钮</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'api-keys',
      title: 'API密钥设置指南',
      content: (
        <div className="space-y-4">
          <p>
            AI Navigator Pro 需要使用各种API密钥来启用高级功能，特别是SEO内容自动生成功能。
          </p>
          
          <h3 className="text-lg font-medium text-white mt-4">OpenRouter API密钥</h3>
          <p className="text-gray-300 mt-2">
            OpenRouter API密钥用于生成SEO内容和其他AI辅助功能。
          </p>
          
          <h4 className="text-md font-medium text-white mt-3">获取API密钥：</h4>
          <ol className="list-decimal pl-5 mt-2 text-gray-300">
            <li>访问 OpenRouter 网站 (https://openrouter.ai)</li>
            <li>登录或注册账户</li>
            <li>在仪表板中找到 API 密钥</li>
            <li>复制 API 密钥并保存在安全的地方</li>
          </ol>
          
          <h4 className="text-md font-medium text-white mt-3">在AI Navigator Pro中设置API密钥：</h4>
          <ol className="list-decimal pl-5 mt-2 text-gray-300">
            <li>进入设置页面</li>
            <li>找到「API密钥」部分</li>
            <li>粘贴您的 OpenRouter API 密钥</li>
            <li>点击「保存更改」完成设置</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'seo-automation',
      title: 'SEO自动化功能指南',
      content: (
        <div className="space-y-4">
          <p>
            SEO自动化功能帮助您自动管理网站的SEO内容，包括元标签、标题和描述的生成。
          </p>
          
          <h3 className="text-lg font-medium text-white mt-4">主要功能</h3>
          <ul className="list-disc pl-5 mt-2 text-gray-300">
            <li>自动生成SEO标题和描述</li>
            <li>批量生成元标签</li>
            <li>关键词优化建议</li>
            <li>内容质量分析</li>
            <li>
              <span className="font-medium text-white">模板变量</span>：
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>{'{{'} title {'}}' } - 自动生成的标题</li>
                <li>{'{{'} keyword {'}}' } - 主要关键词</li>
                <li>{'{{'} date {'}}' } - 当前日期</li>
                <li>{'{{'} summary {'}}' } - 自动生成的内容摘要</li>
              </ul>
            </li>
          </ul>
          
          <h3 className="text-lg font-medium text-white mt-4">自动生成内容</h3>
          <p>
            系统会根据您设置的频率自动生成内容，您也可以手动触发生成过程。
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium text-white">手动生成</span>：
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>在内容模板列表中，找到需要生成内容的模板</li>
                <li>点击「生成内容」按钮</li>
                <li>系统将使用AI生成内容并保存</li>
              </ol>
            </li>
            <li>
              <span className="font-medium text-white">批量生成</span>：
              <p>在「生成内容」标签页中，点击「批量生成内容」按钮，系统将为所有活跃模板生成内容。</p>
            </li>
            <li>
              <span className="font-medium text-white">自动发布</span>：
              <p>启用「自动发布」设置后，系统生成的内容将自动发布到您的网站，无需手动审核。</p>
            </li>
          </ul>
          
          <h3 className="text-lg font-medium text-white mt-4">性能分析</h3>
          <p>
            系统会自动收集和分析生成内容的性能数据，帮助您优化SEO策略。
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium text-white">展示次数</span>：
              <p>内容在搜索结果中显示的次数。</p>
            </li>
            <li>
              <span className="font-medium text-white">点击次数</span>：
              <p>用户从搜索结果点击进入您网站的次数。</p>
            </li>
            <li>
              <span className="font-medium text-white">平均排名</span>：
              <p>内容在搜索结果中的平均位置。</p>
            </li>
            <li>
              <span className="font-medium text-white">性能报告</span>：
              <p>在「生成内容」标签页顶部，您可以查看总体性能数据和趋势。</p>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  // 过滤帮助项目
  const filteredHelpItems = helpItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 切换展开/折叠状态
  const toggleItem = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">帮助中心</h1>
      
      {/* 搜索框 */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neutral-400" />
        </div>
        <input
          type="text"
          placeholder="搜索帮助主题..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* 帮助内容 */}
      <div className="space-y-4">
        {filteredHelpItems.length === 0 ? (
          <div className="text-center py-8 bg-neutral-900 rounded-xl border border-neutral-800">
            <p className="text-neutral-400">没有找到匹配的帮助主题</p>
          </div>
        ) : (
          filteredHelpItems.map(item => (
            <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
              >
                <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                {expandedItem === item.id ? (
                  <ChevronUp className="h-5 w-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-neutral-400" />
                )}
              </button>
              
              {expandedItem === item.id && (
                <div className="p-4 pt-0 border-t border-neutral-800">
                  <div className="prose prose-invert max-w-none">
                    {item.content}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}