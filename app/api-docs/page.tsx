'use client';

import { useState } from 'react';

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState<'introduction' | 'authentication' | 'endpoints' | 'examples'>('introduction');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(text);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (error) {
      console.error('复制失败:', error);
      // 降级处理
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedEndpoint(text);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-2">API 文档</h1>
      <p className="text-xl text-neutral-400 mb-10">使用 AI Navigator Pro API 集成我们的 AI 工具数据到您的应用</p>
      
      {/* 标签页导航 */}
      <div className="flex border-b border-neutral-800 mb-10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('introduction')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'introduction' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-neutral-400 hover:text-white'}`}
        >
          介绍
        </button>
        <button
          onClick={() => setActiveTab('authentication')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'authentication' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-neutral-400 hover:text-white'}`}
        >
          认证
        </button>
        <button
          onClick={() => setActiveTab('endpoints')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'endpoints' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-neutral-400 hover:text-white'}`}
        >
          API 端点
        </button>
        <button
          onClick={() => setActiveTab('examples')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'examples' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-neutral-400 hover:text-white'}`}
        >
          示例代码
        </button>
      </div>
      
      {/* 介绍 */}
      {activeTab === 'introduction' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">API 概述</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              AI Navigator Pro API 允许开发者以编程方式访问我们的 AI 工具数据库。通过我们的 API，您可以：
            </p>
            <ul className="list-disc pl-6 text-neutral-300 space-y-2">
              <li>获取 AI 工具的完整列表</li>
              <li>按类别、标签或价格筛选工具</li>
              <li>获取特定工具的详细信息</li>
              <li>搜索 AI 工具</li>
              <li>获取工具评论和评分</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">基本信息</h2>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">基础 URL</h3>
                <code className="block bg-neutral-800 p-3 rounded text-green-400 overflow-x-auto">
                  https://api.ainavigatorpro.com/v1
                </code>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">响应格式</h3>
                <p className="text-neutral-300">
                  所有 API 响应均以 JSON 格式返回。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">请求限制</h3>
                <p className="text-neutral-300">
                  免费 API 密钥每分钟限制 60 个请求。高级计划提供更高的请求限制。
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">开始使用</h2>
            <ol className="list-decimal pl-6 text-neutral-300 space-y-4">
              <li>
                <p className="font-medium text-white">注册 API 密钥</p>
                <p>在开发者门户注册并创建 API 密钥。</p>
              </li>
              <li>
                <p className="font-medium text-white">设置认证</p>
                <p>在所有 API 请求中包含您的 API 密钥。</p>
              </li>
              <li>
                <p className="font-medium text-white">发送请求</p>
                <p>使用您选择的编程语言向我们的 API 端点发送请求。</p>
              </li>
              <li>
                <p className="font-medium text-white">处理响应</p>
                <p>解析 JSON 响应并在您的应用中使用数据。</p>
              </li>
            </ol>
          </section>
        </div>
      )}
      
      {/* 认证 */}
      {activeTab === 'authentication' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">API 密钥认证</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              所有 API 请求都需要使用 API 密钥进行认证。您可以在开发者门户中创建和管理您的 API 密钥。
            </p>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-2">在请求头中包含 API 密钥</h3>
              <code className="block bg-neutral-800 p-3 rounded text-green-400 overflow-x-auto">
                X-API-Key: your_api_key_here
              </code>
              
              <h3 className="text-lg font-semibold text-white mb-2">或作为查询参数</h3>
              <code className="block bg-neutral-800 p-3 rounded text-green-400 overflow-x-auto">
                https://api.ainavigatorpro.com/v1/tools?api_key=your_api_key_here
              </code>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">获取 API 密钥</h2>
            <ol className="list-decimal pl-6 text-neutral-300 space-y-4">
              <li>
                <p>登录到您的 AI Navigator Pro 账户。</p>
              </li>
              <li>
                <p>导航到开发者设置页面。</p>
              </li>
              <li>
                <p>点击"创建新 API 密钥"按钮。</p>
              </li>
              <li>
                <p>为您的 API 密钥提供一个描述性名称，并选择适当的权限。</p>
              </li>
              <li>
                <p>点击"生成密钥"按钮。</p>
              </li>
              <li>
                <p>复制并安全地存储您的 API 密钥。出于安全原因，我们只会显示一次完整的密钥。</p>
              </li>
            </ol>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">API 计划</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">免费计划</h3>
                <ul className="text-neutral-300 space-y-2">
                  <li>每分钟 60 个请求</li>
                  <li>基本 API 端点访问</li>
                  <li>标准支持</li>
                </ul>
                <p className="mt-4 text-white font-medium">¥0 / 月</p>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">专业计划</h3>
                <ul className="text-neutral-300 space-y-2">
                  <li>每分钟 300 个请求</li>
                  <li>所有 API 端点访问</li>
                  <li>优先支持</li>
                  <li>更高的速率限制</li>
                </ul>
                <p className="mt-4 text-white font-medium">¥199 / 月</p>
              </div>
              
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">企业计划</h3>
                <ul className="text-neutral-300 space-y-2">
                  <li>自定义请求限制</li>
                  <li>专用支持</li>
                  <li>自定义集成</li>
                  <li>服务级别协议 (SLA)</li>
                </ul>
                <p className="mt-4 text-white font-medium">联系我们获取价格</p>
              </div>
            </div>
          </section>
        </div>
      )}
      
      {/* API 端点 */}
      {activeTab === 'endpoints' && (
        <div className="space-y-10">
          {/* 工具端点 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">工具端点</h2>
            
            <div className="space-y-6">
              {/* 获取所有工具 */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-400 rounded mr-3">GET</span>
                    <code className="text-white">/tools</code>
                  </div>
                  <button 
                    className="text-neutral-400 hover:text-white"
                    onClick={() => handleCopy('https://api.ainavigatorpro.com/v1/tools')}
                  >
                    {copiedEndpoint === 'https://api.ainavigatorpro.com/v1/tools' ? '已复制!' : '复制'}
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-neutral-300 mb-4">获取所有 AI 工具的列表。支持分页、排序和筛选。</p>
                  
                  <h4 className="text-lg font-semibold text-white mb-2">查询参数</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-neutral-800">
                          <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">参数</th>
                          <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">类型</th>
                          <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">描述</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border-b border-neutral-800 text-white">page</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-400">整数</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-300">页码，默认为 1</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-b border-neutral-800 text-white">limit</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-400">整数</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-300">每页结果数，默认为 20，最大为 100</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-b border-neutral-800 text-white">sort</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-400">字符串</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-300">排序字段，可选值：name, rating, created_at</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-b border-neutral-800 text-white">order</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-400">字符串</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-300">排序顺序，可选值：asc, desc</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-b border-neutral-800 text-white">category</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-400">字符串</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-300">按类别筛选</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-b border-neutral-800 text-white">tag</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-400">字符串</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-300">按标签筛选</td>
                        </tr>
                        <tr>
                          <td className="p-2 text-white">price</td>
                          <td className="p-2 text-neutral-400">字符串</td>
                          <td className="p-2 text-neutral-300">按价格筛选，可选值：free, freemium, paid</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mt-6 mb-2">响应示例</h4>
                  <pre className="bg-neutral-800 p-3 rounded text-green-400 overflow-x-auto">
                    {JSON.stringify({
                      "status": "success",
                      "data": {
                        "tools": [
                          {
                            "id": "1",
                            "name": "ChatGPT",
                            "slug": "chatgpt",
                            "description": "OpenAI 开发的对话式 AI 助手",
                            "logo_url": "https://example.com/logos/chatgpt.png",
                            "website_url": "https://chat.openai.com",
                            "category": "聊天机器人",
                            "tags": ["AI 助手", "自然语言处理", "对话式 AI"],
                            "pricing_type": "freemium",
                            "rating": 4.8,
                            "created_at": "2023-01-15T00:00:00Z",
                            "updated_at": "2023-11-20T00:00:00Z"
                          },
                          // 更多工具...
                        ],
                        "pagination": {
                          "total": 156,
                          "pages": 8,
                          "page": 1,
                          "limit": 20
                        }
                      }
                    }, null, 2)}
                  </pre>
                </div>
              </div>
              
              {/* 获取单个工具 */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-400 rounded mr-3">GET</span>
                    <code className="text-white">/tools/{'{slug}'}</code>
                  </div>
                  <button 
                    className="text-neutral-400 hover:text-white"
                    onClick={() => handleCopy('https://api.ainavigatorpro.com/v1/tools/{slug}')}
                  >
                    {copiedEndpoint === 'https://api.ainavigatorpro.com/v1/tools/{slug}' ? '已复制!' : '复制'}
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-neutral-300 mb-4">获取特定 AI 工具的详细信息。</p>
                  
                  <h4 className="text-lg font-semibold text-white mb-2">路径参数</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-neutral-800">
                          <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">参数</th>
                          <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">类型</th>
                          <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">描述</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 text-white">slug</td>
                          <td className="p-2 text-neutral-400">字符串</td>
                          <td className="p-2 text-neutral-300">工具的唯一标识符</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mt-6 mb-2">响应示例</h4>
                  <pre className="bg-neutral-800 p-3 rounded text-green-400 overflow-x-auto">
                    {JSON.stringify({
                      "status": "success",
                      "data": {
                        "id": "1",
                        "name": "ChatGPT",
                        "slug": "chatgpt",
                        "description": "OpenAI 开发的对话式 AI 助手",
                        "long_description": "ChatGPT 是由 OpenAI 开发的一款先进的对话式 AI 助手，基于 GPT（生成式预训练转换器）架构。它能够理解自然语言，生成类似人类的文本响应，并参与各种主题的对话。",
                        "logo_url": "https://example.com/logos/chatgpt.png",
                        "website_url": "https://chat.openai.com",
                        "category": "聊天机器人",
                        "tags": ["AI 助手", "自然语言处理", "对话式 AI"],
                        "pricing_type": "freemium",
                        "pricing_details": {
                          "has_free_plan": true,
                          "has_free_trial": false,
                          "starting_price": "$20/月",
                          "pricing_url": "https://chat.openai.com/pricing"
                        },
                        "features": [
                          "自然语言理解",
                          "上下文感知对话",
                          "多语言支持",
                          "代码生成和调试",
                          "内容创作辅助"
                        ],
                        "rating": 4.8,
                        "reviews_count": 1250,
                        "created_at": "2023-01-15T00:00:00Z",
                        "updated_at": "2023-11-20T00:00:00Z"
                      }
                    }, null, 2)}
                  </pre>
                </div>
              </div>
              
              {/* 搜索工具 */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-400 rounded mr-3">GET</span>
                    <code className="text-white">/tools/search</code>
                  </div>
                  <button 
                    className="text-neutral-400 hover:text-white"
                    onClick={() => handleCopy('https://api.ainavigatorpro.com/v1/tools/search')}
                  >
                    {copiedEndpoint === 'https://api.ainavigatorpro.com/v1/tools/search' ? '已复制!' : '复制'}
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-neutral-300 mb-4">搜索 AI 工具。</p>
                  
                  <h4 className="text-lg font-semibold text-white mb-2">查询参数</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-neutral-800">
                          <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">参数</th>
                          <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">类型</th>
                          <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">描述</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border-b border-neutral-800 text-white">q</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-400">字符串</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-300">搜索查询（必需）</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-b border-neutral-800 text-white">page</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-400">整数</td>
                          <td className="p-2 border-b border-neutral-800 text-neutral-300">页码，默认为 1</td>
                        </tr>
                        <tr>
                          <td className="p-2 text-white">limit</td>
                          <td className="p-2 text-neutral-400">整数</td>
                          <td className="p-2 text-neutral-300">每页结果数，默认为 20，最大为 100</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* 类别端点 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">类别端点</h2>
            
            <div className="space-y-6">
              {/* 获取所有类别 */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-400 rounded mr-3">GET</span>
                    <code className="text-white">/categories</code>
                  </div>
                  <button 
                    className="text-neutral-400 hover:text-white"
                    onClick={() => handleCopy('https://api.ainavigatorpro.com/v1/categories')}
                  >
                    {copiedEndpoint === 'https://api.ainavigatorpro.com/v1/categories' ? '已复制!' : '复制'}
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-neutral-300 mb-4">获取所有 AI 工具类别。</p>
                  
                  <h4 className="text-lg font-semibold text-white mt-6 mb-2">响应示例</h4>
                  <pre className="bg-neutral-800 p-3 rounded text-green-400 overflow-x-auto">
                    {JSON.stringify({
                      "status": "success",
                      "data": [
                        {
                          "id": "1",
                          "name": "聊天机器人",
                          "slug": "chatbots",
                          "description": "对话式 AI 助手和聊天机器人工具",
                          "tools_count": 42
                        },
                        {
                          "id": "2",
                          "name": "图像生成",
                          "slug": "image-generation",
                          "description": "AI 图像生成和编辑工具",
                          "tools_count": 38
                        }
                        // 更多类别...
                      ]
                    }, null, 2)}
                  </pre>
                </div>
              </div>
              
              {/* 获取类别下的工具 */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-400 rounded mr-3">GET</span>
                    <code className="text-white">/categories/{'{slug}'}/tools</code>
                  </div>
                  <button 
                    className="text-neutral-400 hover:text-white"
                    onClick={() => handleCopy('https://api.ainavigatorpro.com/v1/categories/{slug}/tools')}
                  >
                    {copiedEndpoint === 'https://api.ainavigatorpro.com/v1/categories/{slug}/tools' ? '已复制!' : '复制'}
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-neutral-300 mb-4">获取特定类别下的所有 AI 工具。</p>
                  
                  <h4 className="text-lg font-semibold text-white mb-2">路径参数</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-neutral-800">
                          <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">参数</th>
                          <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">类型</th>
                          <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">描述</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 text-white">slug</td>
                          <td className="p-2 text-neutral-400">字符串</td>
                          <td className="p-2 text-neutral-300">类别的唯一标识符</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mb-2 mt-4">查询参数</h4>
                  <p className="text-neutral-300 mb-4">支持与 /tools 端点相同的分页和排序参数。</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* 标签端点 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">标签端点</h2>
            
            <div className="space-y-6">
              {/* 获取所有标签 */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-400 rounded mr-3">GET</span>
                    <code className="text-white">/tags</code>
                  </div>
                  <button 
                    className="text-neutral-400 hover:text-white"
                    onClick={() => handleCopy('https://api.ainavigatorpro.com/v1/tags')}
                  >
                    {copiedEndpoint === 'https://api.ainavigatorpro.com/v1/tags' ? '已复制!' : '复制'}
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-neutral-300 mb-4">获取所有 AI 工具标签。</p>
                  
                  <h4 className="text-lg font-semibold text-white mt-6 mb-2">响应示例</h4>
                  <pre className="bg-neutral-800 p-3 rounded text-green-400 overflow-x-auto">
                    {JSON.stringify({
                      "status": "success",
                      "data": [
                        {
                          "id": "1",
                          "name": "AI 助手",
                          "slug": "ai-assistant",
                          "tools_count": 25
                        },
                        {
                          "id": "2",
                          "name": "自然语言处理",
                          "slug": "nlp",
                          "tools_count": 18
                        }
                        // 更多标签...
                      ]
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      
      {/* 示例代码 */}
      {activeTab === 'examples' && (
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">使用示例</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* JavaScript 示例 */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-neutral-800">
                  <h3 className="text-xl font-semibold text-white">JavaScript (Fetch)</h3>
                </div>
                <div className="p-4">
                  <pre className="bg-neutral-800 p-3 rounded text-green-400 overflow-x-auto">
                    {`// 获取所有工具
const fetchTools = async () => {
  try {
    const response = await fetch(
      'https://api.ainavigatorpro.com/v1/tools',
      {
        headers: {
          'X-API-Key': 'YOUR_API_KEY'
        }
      }
    );
    
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching tools:', error);
  }
};

// 搜索工具
const searchTools = async (query) => {
  try {
    const response = await fetch(
      \`https://api.ainavigatorpro.com/v1/tools/search?q=\${encodeURIComponent(query)}\`,
      {
        headers: {
          'X-API-Key': 'YOUR_API_KEY'
        }
      }
    );
    
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error searching tools:', error);
  }
};`}
                  </pre>
                </div>
              </div>
              
              {/* Python 示例 */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-neutral-800">
                  <h3 className="text-xl font-semibold text-white">Python (Requests)</h3>
                </div>
                <div className="p-4">
                  <pre className="bg-neutral-800 p-3 rounded text-green-400 overflow-x-auto">
                    {`import requests

# API 配置
API_KEY = 'YOUR_API_KEY'
BASE_URL = 'https://api.ainavigatorpro.com/v1'
HEADERS = {
    'X-API-Key': API_KEY
}

# 获取所有工具
def get_tools(page=1, limit=20):
    try:
        response = requests.get(
            f'{BASE_URL}/tools',
            headers=HEADERS,
            params={
                'page': page,
                'limit': limit
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching tools: {e}')
        return None

# 获取特定工具
def get_tool(slug):
    try:
        response = requests.get(
            f'{BASE_URL}/tools/{slug}',
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching tool: {e}')
        return None`}
                  </pre>
                </div>
              </div>
              
              {/* PHP 示例 */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-neutral-800">
                  <h3 className="text-xl font-semibold text-white">PHP (cURL)</h3>
                </div>
                <div className="p-4">
                  <pre className="bg-neutral-800 p-3 rounded text-green-400 overflow-x-auto">
                    {`<?php
// API 配置
$apiKey = 'YOUR_API_KEY';
$baseUrl = 'https://api.ainavigatorpro.com/v1';

// 获取所有工具
function getTools($page = 1, $limit = 20) {
    global $apiKey, $baseUrl;
    
    $url = $baseUrl . '/tools?page=' . $page . '&limit=' . $limit;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'X-API-Key: ' . $apiKey
    ]);
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        echo 'Error fetching tools: ' . $error;
        return null;
    }
    
    return json_decode($response, true);
}

// 获取特定类别下的工具
function getCategoryTools($categorySlug, $page = 1, $limit = 20) {
    global $apiKey, $baseUrl;
    
    $url = $baseUrl . '/categories/' . $categorySlug . '/tools?page=' . $page . '&limit=' . $limit;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'X-API-Key: ' . $apiKey
    ]);
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        echo 'Error fetching category tools: ' . $error;
        return null;
    }
    
    return json_decode($response, true);
}
?>`}
                  </pre>
                </div>
              </div>
              
              {/* Node.js 示例 */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-neutral-800">
                  <h3 className="text-xl font-semibold text-white">Node.js (Axios)</h3>
                </div>
                <div className="p-4">
                  <pre className="bg-neutral-800 p-3 rounded text-green-400 overflow-x-auto">
                    {`const axios = require('axios');

// API 配置
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.ainavigatorpro.com/v1';

// 创建 axios 实例
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-Key': API_KEY
  }
});

// 获取所有工具
async function getTools(page = 1, limit = 20) {
  try {
    const response = await api.get('/tools', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tools:', error.message);
    throw error;
  }
}

// 搜索工具
async function searchTools(query, page = 1, limit = 20) {
  try {
    const response = await api.get('/tools/search', {
      params: { q: query, page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching tools:', error.message);
    throw error;
  }
}

// 获取所有类别
async function getCategories() {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    throw error;
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">错误处理</h2>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <p className="text-neutral-300 mb-4">
                API 可能返回以下错误响应：
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-neutral-800">
                      <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">状态码</th>
                      <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">错误类型</th>
                      <th className="p-2 text-left text-neutral-300 border-b border-neutral-700">描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border-b border-neutral-800 text-white">400</td>
                      <td className="p-2 border-b border-neutral-800 text-neutral-400">Bad Request</td>
                      <td className="p-2 border-b border-neutral-800 text-neutral-300">请求参数无效</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b border-neutral-800 text-white">401</td>
                      <td className="p-2 border-b border-neutral-800 text-neutral-400">Unauthorized</td>
                      <td className="p-2 border-b border-neutral-800 text-neutral-300">API 密钥无效或缺失</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b border-neutral-800 text-white">404</td>
                      <td className="p-2 border-b border-neutral-800 text-neutral-400">Not Found</td>
                      <td className="p-2 border-b border-neutral-800 text-neutral-300">请求的资源不存在</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b border-neutral-800 text-white">429</td>
                      <td className="p-2 border-b border-neutral-800 text-neutral-400">Too Many Requests</td>
                      <td className="p-2 border-b border-neutral-800 text-neutral-300">超过 API 请求限制</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-white">500</td>
                      <td className="p-2 text-neutral-400">Internal Server Error</td>
                      <td className="p-2 text-neutral-300">服务器内部错误</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4 className="text-lg font-semibold text-white mt-6 mb-2">错误响应示例</h4>
              <pre className="bg-neutral-800 p-3 rounded text-green-400 overflow-x-auto">
                {JSON.stringify({
                  "status": "error",
                  "error": {
                    "code": "invalid_api_key",
                    "message": "提供的 API 密钥无效或已过期"
                  }
                }, null, 2)}
              </pre>
            </div>
          </section>
        </div>
      )}
      
      {/* 获取 API 密钥 CTA */}
      <div className="mt-16 bg-blue-900/20 border border-blue-700 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">准备好开始使用我们的 API 了吗？</h2>
        <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
          注册一个免费的 API 密钥，开始将 AI Navigator Pro 的数据集成到您的应用程序中。
        </p>
        <a 
          href="/developer/register" 
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          获取 API 密钥
        </a>
      </div>
    </div>
  );
}