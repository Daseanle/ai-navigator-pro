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
            AI Navigator Pro 使用基于角色的权限系统，确保只有授权用户才能访问管理功能。
          </p>
          
          <h3 className="text-lg font-medium text-white mt-4">权限级别</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium text-white">管理员 (admin)</span>：
              <p>拥有完全访问权限，可以管理所有系统功能，包括用户管理、SEO设置、系统配置等。</p>
            </li>
            <li>
              <span className="font-medium text-white">编辑者 (editor)</span>：
              <p>可以管理内容，但无法更改系统设置或管理用户。</p>
            </li>
            <li>
              <span className="font-medium text-white">普通用户 (user)</span>：
              <p>只能访问前台功能，无法访问任何管理页面。</p>
            </li>
          </ul>
          
          <h3 className="text-lg font-medium text-white mt-4">"User not allowed" 错误说明</h3>
          <p>
            当您看到 "User not allowed" 提示时，表示您的账户没有访问当前页面的权限。这通常是因为：
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>您的账户角色不是管理员</li>
            <li>您的账户权限不足以执行特定操作</li>
            <li>系统管理员尚未为您分配适当的权限</li>
          </ul>
          
          <h3 className="text-lg font-medium text-white mt-4">如何获取权限</h3>
          <p>
            如需获取更高级别的权限，请联系系统管理员。管理员可以在用户管理页面更改您的角色。
          </p>
          
          <h3 className="text-lg font-medium text-white mt-4">如何管理用户权限</h3>
          <p>
            作为管理员，您可以通过以下步骤管理用户权限：
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>导航到「用户管理」页面</li>
            <li>找到需要修改权限的用户</li>
            <li>点击「编辑」按钮</li>
            <li>在角色下拉菜单中选择适当的角色</li>
            <li>点击「保存更改」完成操作</li>
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
          
          <h3 className="text-lg font-medium text-white mt-4">OpenAI API密钥</h3>
          <p>
            OpenAI API密钥用于生成SEO内容和其他AI辅助功能。
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium text-white">获取方式</span>：
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>访问 <a href="https://platform.openai.com/signup" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">OpenAI平台</a> 并创建账户</li>
                <li>登录后，导航到 API 密钥页面</li>
                <li>点击「创建新密钥」按钮</li>
                <li>为密钥添加描述（例如："AI Navigator Pro"）</li>
                <li>复制生成的密钥（以 sk- 开头）</li>
              </ol>
            </li>
            <li>
              <span className="font-medium text-white">填写位置</span>：
              <p>在「SEO自动化」页面的「设置」标签页中，找到「OpenAI API密钥」字段并粘贴您的密钥。</p>
            </li>
            <li>
              <span className="font-medium text-white">注意事项</span>：
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>API密钥会产生费用，请妥善保管</li>
                <li>建议设置使用限额，避免意外超支</li>
                <li>系统会加密存储您的API密钥</li>
              </ul>
            </li>
          </ul>
          
          <h3 className="text-lg font-medium text-white mt-4">Google Search Console API</h3>
          <p>
            此API用于获取SEO内容的展示和点击数据，帮助分析内容性能。
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium text-white">获取方式</span>：
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>访问 <a href="https://console.developers.google.com/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                <li>创建新项目或选择现有项目</li>
                <li>启用 Search Console API</li>
                <li>创建服务账号和密钥</li>
                <li>下载JSON格式的密钥文件</li>
              </ol>
            </li>
            <li>
              <span className="font-medium text-white">填写位置</span>：
              <p>在「SEO自动化」页面的「设置」标签页中，找到「Google Search Console API密钥」字段，并粘贴JSON密钥的内容。</p>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'seo-automation',
      title: 'SEO自动化功能指南',
      content: (
        <div className="space-y-4">
          <p>
            SEO自动化功能可以帮助您自动生成优质内容，提高网站在搜索引擎中的可见性和排名。
          </p>
          
          <h3 className="text-lg font-medium text-white mt-4">内容模板</h3>
          <p>
            内容模板是自动生成SEO内容的基础。您可以创建多个模板，针对不同类型的内容。
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium text-white">创建模板</span>：
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>在「SEO自动化」页面，切换到「内容模板」标签</li>
                <li>点击「创建模板」按钮</li>
                <li>填写模板名称、目标类型、关键词等信息</li>
                <li>编写模板内容，使用 {{变量名}} 语法添加动态内容</li>
                <li>设置生成频率和状态</li>
                <li>点击「创建模板」保存</li>
              </ol>
            </li>
            <li>
              <span className="font-medium text-white">模板变量</span>：
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>{{title}} - 自动生成的标题</li>
                <li>{{keyword}} - 主要关键词</li>
                <li>{{date}} - 当前日期</li>
                <li>{{summary}} - 自动生成的内容摘要</li>
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