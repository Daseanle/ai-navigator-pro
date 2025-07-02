'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { RefreshCw, Search, FileText, Settings, Check, AlertTriangle, Clock } from 'lucide-react';

interface SeoContentSettings {
  id: string;
  name: string;
  value: string;
  description: string;
}

interface ContentTemplate {
  id: string;
  name: string;
  template: string;
  target_type: 'blog' | 'tool_description' | 'category_page' | 'landing_page';
  keywords: string[];
  status: 'active' | 'paused';
  last_generated: string | null;
  frequency_days: number;
}

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  target_url: string;
  template_id: string;
  created_at: string;
  status: 'draft' | 'published' | 'rejected';
  keywords: string[];
  performance: {
    impressions: number;
    clicks: number;
    position: number;
  };
}

export default function SeoAutomationPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'content' | 'settings'>('templates');
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [seoSettings, setSeoSettings] = useState<SeoContentSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<ContentTemplate | null>(null);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 模拟数据 - 实际项目中应该从数据库加载
        const mockTemplates: ContentTemplate[] = [
          {
            id: '1',
            name: '工具评测模板',
            template: '# {{tool_name}} 深度评测\n\n## 什么是 {{tool_name}}？\n\n{{tool_description}}\n\n## {{tool_name}} 的主要功能\n\n- 功能点1\n- 功能点2\n- 功能点3\n\n## {{tool_name}} 的优缺点\n\n### 优点\n\n- 优点1\n- 优点2\n\n### 缺点\n\n- 缺点1\n- 缺点2\n\n## {{tool_name}} 适合谁使用？\n\n## {{tool_name}} 的替代工具\n\n## 总结',
            target_type: 'tool_description',
            keywords: ['AI工具', '工具评测', '深度评测'],
            status: 'active',
            last_generated: '2023-06-15T10:30:00Z',
            frequency_days: 7
          },
          {
            id: '2',
            name: 'AI趋势博客模板',
            template: '# {{year}}年{{keyword}}发展趋势\n\n## {{keyword}}的当前状态\n\n## {{year}}年{{keyword}}的主要趋势\n\n1. 趋势1\n2. 趋势2\n3. 趋势3\n\n## 这些趋势对行业的影响\n\n## 企业应该如何应对这些变化\n\n## 总结',
            target_type: 'blog',
            keywords: ['AI趋势', '人工智能', '机器学习', '深度学习'],
            status: 'active',
            last_generated: '2023-06-10T08:45:00Z',
            frequency_days: 14
          },
          {
            id: '3',
            name: '分类页面SEO模板',
            template: '# 最佳{{category_name}}工具\n\n## 什么是{{category_name}}？\n\n## 为什么需要{{category_name}}工具？\n\n## {{year}}年最佳{{category_name}}工具\n\n## 如何选择合适的{{category_name}}工具\n\n## 总结',
            target_type: 'category_page',
            keywords: ['最佳工具', 'AI工具', '工具推荐'],
            status: 'paused',
            last_generated: null,
            frequency_days: 30
          },
        ];
        
        const mockContent: GeneratedContent[] = [
          {
            id: '1',
            title: 'ChatGPT 深度评测：功能、优缺点及适用场景',
            content: '这是生成的内容...',
            target_url: '/tool/chatgpt',
            template_id: '1',
            created_at: '2023-06-15T10:30:00Z',
            status: 'published',
            keywords: ['ChatGPT', 'AI聊天', '语言模型'],
            performance: {
              impressions: 1240,
              clicks: 320,
              position: 3.5
            }
          },
          {
            id: '2',
            title: '2023年AI图像生成技术发展趋势',
            content: '这是生成的内容...',
            target_url: '/blog/ai-image-generation-trends-2023',
            template_id: '2',
            created_at: '2023-06-10T08:45:00Z',
            status: 'published',
            keywords: ['AI图像生成', 'Midjourney', 'DALL-E'],
            performance: {
              impressions: 980,
              clicks: 210,
              position: 5.2
            }
          },
          {
            id: '3',
            title: '最佳AI写作工具 - 2023年完全指南',
            content: '这是生成的内容...',
            target_url: '/categories/ai-writing',
            template_id: '3',
            created_at: '2023-05-20T14:15:00Z',
            status: 'draft',
            keywords: ['AI写作', '内容创作', '写作助手'],
            performance: {
              impressions: 0,
              clicks: 0,
              position: 0
            }
          },
        ];
        
        const mockSettings: SeoContentSettings[] = [
          {
            id: '1',
            name: 'openai_api_key',
            value: '',
            description: 'OpenAI API密钥（用于内容生成）'
          },
          {
            id: '2',
            name: 'content_generation_model',
            value: 'gpt-4',
            description: '内容生成使用的模型'
          },
          {
            id: '3',
            name: 'max_daily_generations',
            value: '5',
            description: '每日最大生成内容数量'
          },
          {
            id: '4',
            name: 'auto_publish',
            value: 'false',
            description: '自动发布生成的内容'
          },
          {
            id: '5',
            name: 'google_search_console_api',
            value: '',
            description: 'Google Search Console API密钥（用于性能跟踪）'
          },
        ];
        
        setTemplates(mockTemplates);
        setGeneratedContent(mockContent);
        setSeoSettings(mockSettings);
        
        // 检查API密钥是否已设置
        const apiKeySetting = mockSettings.find(s => s.name === 'openai_api_key');
        if (!apiKeySetting || !apiKeySetting.value) {
          setApiKeyError('请先设置OpenAI API密钥才能生成内容');
        } else {
          setApiKeyError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 过滤内容
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredContent = generatedContent.filter(content =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 生成新内容
  const generateContent = async (templateId: string) => {
    if (apiKeyError) {
      alert(apiKeyError);
      setActiveTab('settings');
      return;
    }
    
    setGenerationStatus('generating');
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 更新模板的最后生成时间
      setTemplates(prev => prev.map(t => 
        t.id === templateId ? {...t, last_generated: new Date().toISOString()} : t
      ));
      
      // 添加新生成的内容
      const template = templates.find(t => t.id === templateId);
      if (!template) throw new Error('模板不存在');
      
      const newContent: GeneratedContent = {
        id: `new-${Date.now()}`,
        title: `基于${template.name}的新内容 ${new Date().toLocaleDateString()}`,
        content: '这是新生成的内容...',
        target_url: template.target_type === 'blog' ? '/blog/new-post' : 
                   template.target_type === 'tool_description' ? '/tool/new-tool' :
                   '/categories/new-category',
        template_id: templateId,
        created_at: new Date().toISOString(),
        status: 'draft',
        keywords: template.keywords,
        performance: {
          impressions: 0,
          clicks: 0,
          position: 0
        }
      };
      
      setGeneratedContent(prev => [newContent, ...prev]);
      setGenerationStatus('success');
      
      // 3秒后重置状态
      setTimeout(() => setGenerationStatus('idle'), 3000);
    } catch (err) {
      console.error('生成内容失败:', err);
      setGenerationStatus('error');
      
      // 3秒后重置状态
      setTimeout(() => setGenerationStatus('idle'), 3000);
    }
  };

  // 保存设置
  const saveSettings = async () => {
    setLoading(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 检查API密钥是否已设置
      const apiKeySetting = seoSettings.find(s => s.name === 'openai_api_key');
      if (!apiKeySetting || !apiKeySetting.value) {
        setApiKeyError('请先设置OpenAI API密钥才能生成内容');
      } else {
        setApiKeyError(null);
      }
      
      alert('设置已保存');
    } catch (err) {
      console.error('保存设置失败:', err);
      alert('保存设置失败');
    } finally {
      setLoading(false);
    }
  };

  // 更新设置值
  const updateSetting = (id: string, value: string) => {
    setSeoSettings(prev => prev.map(s => 
      s.id === id ? {...s, value} : s
    ));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">SEO内容自动化</h1>
        
        {apiKeyError && (
          <div className="bg-yellow-900/30 border border-yellow-800 text-yellow-400 px-4 py-2 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {apiKeyError}
          </div>
        )}
      </div>
      
      {/* 标签页导航 */}
      <div className="flex border-b border-neutral-800 mb-8">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 font-medium ${activeTab === 'templates' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-neutral-400 hover:text-white'}`}
        >
          内容模板
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 font-medium ${activeTab === 'content' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-neutral-400 hover:text-white'}`}
        >
          生成内容
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 font-medium ${activeTab === 'settings' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-neutral-400 hover:text-white'}`}
        >
          设置
        </button>
      </div>
      
      {/* 搜索栏 */}
      {activeTab !== 'settings' && (
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={`搜索${activeTab === 'templates' ? '模板' : '内容'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-neutral-400">加载中...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          {/* 内容模板标签页 */}
          {activeTab === 'templates' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">内容模板</h2>
                <button
                  onClick={() => {
                    setCurrentTemplate(null);
                    setShowTemplateModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  创建模板
                </button>
              </div>
              
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-8 bg-neutral-900 rounded-xl border border-neutral-800">
                  <p className="text-neutral-400">没有找到匹配的模板</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTemplates.map(template => (
                    <div key={template.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-white">{template.name}</h3>
                          <p className="text-sm text-neutral-400">{template.target_type === 'blog' ? '博客文章' : 
                            template.target_type === 'tool_description' ? '工具描述' : 
                            template.target_type === 'category_page' ? '分类页面' : '着陆页'}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${template.status === 'active' ? 'bg-green-900/30 text-green-400 border border-green-800/30' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'}`}>
                          {template.status === 'active' ? '活跃' : '已暂停'}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-neutral-400 mb-2">关键词:</p>
                        <div className="flex flex-wrap gap-2">
                          {template.keywords.map((keyword, idx) => (
                            <span key={idx} className="px-2 py-1 bg-neutral-800 text-xs text-neutral-300 rounded-full">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-neutral-400 mb-2">生成频率:</p>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-neutral-500 mr-1" />
                          <span className="text-neutral-300">{template.frequency_days}天一次</span>
                        </div>
                      </div>
                      
                      {template.last_generated && (
                        <div className="mb-4">
                          <p className="text-sm text-neutral-400 mb-2">上次生成:</p>
                          <span className="text-neutral-300">{new Date(template.last_generated).toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between mt-6">
                        <button
                          onClick={() => {
                            setCurrentTemplate(template);
                            setShowTemplateModal(true);
                          }}
                          className="text-blue-500 hover:text-blue-400"
                        >
                          编辑模板
                        </button>
                        
                        <button
                          onClick={() => generateContent(template.id)}
                          disabled={generationStatus === 'generating' || template.status !== 'active'}
                          className={`flex items-center px-3 py-1.5 rounded-lg ${template.status === 'active' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}
                        >
                          {generationStatus === 'generating' ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                              生成中...
                            </>
                          ) : (
                            <>生成内容</>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* 生成内容标签页 */}
          {activeTab === 'content' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">生成内容</h2>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      if (apiKeyError) {
                        alert(apiKeyError);
                        setActiveTab('settings');
                        return;
                      }
                      
                      if (confirm('确定要批量生成内容吗？这将根据活跃模板生成多篇内容。')) {
                        setGenerationStatus('generating');
                        try {
                          // 调用批量生成API
                          const response = await fetch('/api/content/batch', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('api_key') || 'default-key'}`
                            },
                            body: JSON.stringify({
                              contentTypes: ['blog', 'tool_description', 'category_page'],
                              limit: 5,
                              apiKey: seoSettings.find(s => s.name === 'openai_api_key')?.value
                            })
                          });
                          
                          const result = await response.json();
                          
                          if (result.error) {
                            throw new Error(result.error);
                          }
                          
                          alert(`批量生成完成！成功: ${result.added}, 失败: ${result.errors}`);
                          
                          // 刷新内容列表（实际项目中应该从数据库重新加载）
                          // 这里简单模拟添加新内容
                          const newContents: GeneratedContent[] = Array.from({ length: result.added }).map((_, i) => ({
                            id: `batch-${Date.now()}-${i}`,
                            title: `批量生成内容 ${new Date().toLocaleDateString()} (${i+1})`,
                            content: '这是批量生成的内容...',
                            target_url: `/auto-content-${Date.now()}-${i}`,
                            template_id: templates[i % templates.length]?.id || '1',
                            created_at: new Date().toISOString(),
                            status: 'draft',
                            keywords: ['自动生成', '批量内容'],
                            performance: {
                              impressions: 0,
                              clicks: 0,
                              position: 0
                            }
                          }));
                          
                          setGeneratedContent(prev => [...newContents, ...prev]);
                          setGenerationStatus('success');
                        } catch (err) {
                          console.error('批量生成内容失败:', err);
                          alert(`批量生成内容失败: ${err instanceof Error ? err.message : '未知错误'}`);
                          setGenerationStatus('error');
                        } finally {
                          // 3秒后重置状态
                          setTimeout(() => setGenerationStatus('idle'), 3000);
                        }
                      }
                    }}
                    disabled={generationStatus === 'generating'}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    {generationStatus === 'generating' ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>批量生成内容</>
                    )}
                  </button>
                  
                  <button
                    onClick={async () => {
                      if (apiKeyError) {
                        alert(apiKeyError);
                        setActiveTab('settings');
                        return;
                      }
                      
                      if (confirm('确定要执行批量SEO优化吗？这将优化现有内容的SEO表现。')) {
                        setGenerationStatus('generating');
                        try {
                          // 调用批量SEO优化API
                          const response = await fetch('/api/seo/batch', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('api_key') || 'default-key'}`
                            },
                            body: JSON.stringify({
                              contentTypes: ['blog', 'tool_description', 'category_page'],
                              limit: 5,
                              apiKey: seoSettings.find(s => s.name === 'openai_api_key')?.value
                            })
                          });
                          
                          const result = await response.json();
                          
                          if (result.error) {
                            throw new Error(result.error);
                          }
                          
                          alert(`批量SEO优化完成！成功: ${result.added}, 失败: ${result.errors}`);
                          setGenerationStatus('success');
                        } catch (err) {
                          console.error('批量SEO优化失败:', err);
                          alert(`批量SEO优化失败: ${err instanceof Error ? err.message : '未知错误'}`);
                          setGenerationStatus('error');
                        } finally {
                          // 3秒后重置状态
                          setTimeout(() => setGenerationStatus('idle'), 3000);
                        }
                      }
                    }}
                    disabled={generationStatus === 'generating'}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    {generationStatus === 'generating' ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        优化中...
                      </>
                    ) : (
                      <>批量SEO优化</>
                    )}
                  </button>
                </div>
              </div>
              
              {/* 性能概览卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <h3 className="text-sm text-neutral-400 mb-2">总内容数</h3>
                  <p className="text-2xl font-bold text-white">{generatedContent.length}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-neutral-500">
                      已发布: {generatedContent.filter(c => c.status === 'published').length}
                    </span>
                    <span className="text-xs text-neutral-500">
                      草稿: {generatedContent.filter(c => c.status === 'draft').length}
                    </span>
                  </div>
                </div>
                
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <h3 className="text-sm text-neutral-400 mb-2">总展示次数</h3>
                  <p className="text-2xl font-bold text-white">
                    {generatedContent.reduce((sum, c) => sum + c.performance.impressions, 0).toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-neutral-800 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">较上月增长 65%</p>
                  </div>
                </div>
                
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <h3 className="text-sm text-neutral-400 mb-2">总点击次数</h3>
                  <p className="text-2xl font-bold text-white">
                    {generatedContent.reduce((sum, c) => sum + c.performance.clicks, 0).toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-neutral-800 rounded-full h-1.5">
                      <div 
                        className="bg-green-600 h-1.5 rounded-full" 
                        style={{ width: '42%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">较上月增长 42%</p>
                  </div>
                </div>
                
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <h3 className="text-sm text-neutral-400 mb-2">平均排名</h3>
                  <p className="text-2xl font-bold text-white">
                    {(generatedContent
                      .filter(c => c.performance.position > 0)
                      .reduce((sum, c) => sum + c.performance.position, 0) / 
                      Math.max(1, generatedContent.filter(c => c.performance.position > 0).length)
                    ).toFixed(1)}
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-neutral-800 rounded-full h-1.5">
                      <div 
                        className="bg-yellow-600 h-1.5 rounded-full" 
                        style={{ width: '28%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">较上月提升 28%</p>
                  </div>
                </div>
              </div>
              
              {filteredContent.length === 0 ? (
                <div className="text-center py-8 bg-neutral-900 rounded-xl border border-neutral-800">
                  <p className="text-neutral-400">没有找到匹配的内容</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-neutral-900 border-b border-neutral-800">
                        <th className="py-3 px-4 text-left text-neutral-400 font-medium">标题</th>
                        <th className="py-3 px-4 text-left text-neutral-400 font-medium">状态</th>
                        <th className="py-3 px-4 text-left text-neutral-400 font-medium">创建时间</th>
                        <th className="py-3 px-4 text-left text-neutral-400 font-medium">性能</th>
                        <th className="py-3 px-4 text-left text-neutral-400 font-medium">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContent.map(content => (
                        <tr key={content.id} className="border-b border-neutral-800 hover:bg-neutral-900/50">
                          <td className="py-4 px-4">
                            <div>
                              <h3 className="font-medium text-white">{content.title}</h3>
                              <p className="text-sm text-neutral-400">{content.target_url}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {content.keywords.map((keyword, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-neutral-800 text-xs text-neutral-300 rounded-full">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              content.status === 'published' ? 'bg-green-900/30 text-green-400 border border-green-800/30' : 
                              content.status === 'draft' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/30' : 
                              'bg-red-900/30 text-red-400 border border-red-800/30'
                            }`}>
                              {content.status === 'published' ? '已发布' : 
                               content.status === 'draft' ? '草稿' : '已拒绝'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-neutral-300">
                            {new Date(content.created_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            {content.status === 'published' ? (
                              <div>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-neutral-400">展示:</span>
                                  <span className="text-white">{content.performance.impressions}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-neutral-400">点击:</span>
                                  <span className="text-white">{content.performance.clicks}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-neutral-400">平均排名:</span>
                                  <span className="text-white">{content.performance.position.toFixed(1)}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-neutral-500">尚未发布</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-neutral-400 hover:text-white transition-colors" title="查看">
                                <FileText className="h-5 w-5" />
                              </button>
                              {content.status === 'draft' && (
                                <button className="p-2 text-neutral-400 hover:text-green-500 transition-colors" title="发布">
                                  <Check className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {/* 设置标签页 */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">SEO内容生成设置</h2>
              
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                {seoSettings.map(setting => (
                  <div key={setting.id} className="mb-6 last:mb-0">
                    <label className="block text-white mb-2">{setting.description}</label>
                    {setting.name.includes('api_key') ? (
                      <div>
                        <input
                          type="password"
                          value={setting.value}
                          onChange={(e) => updateSetting(setting.id, e.target.value)}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`输入${setting.description}`}
                        />
                        <div className="mt-2 text-xs text-neutral-400">
                          <p>API密钥填写说明：</p>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>OpenAI API密钥格式：以 sk- 开头的字符串</li>
                            <li>可在 <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">OpenAI平台</a> 创建API密钥</li>
                            <li>请确保API密钥有足够的额度用于内容生成</li>
                            <li>API密钥将安全加密存储，仅用于SEO内容生成</li>
                          </ul>
                        </div>
                      </div>
                    ) : setting.name.includes('auto_publish') ? (
                      <div className="flex items-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.value === 'true'}
                            onChange={(e) => updateSetting(setting.id, e.target.checked ? 'true' : 'false')}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          <span className="ml-3 text-neutral-300">
                            {setting.value === 'true' ? '已启用' : '已禁用'}
                          </span>
                        </label>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={setting.value}
                        onChange={(e) => updateSetting(setting.id, e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
                
                <div className="mt-8">
                  <button
                    onClick={saveSettings}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>保存设置</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* 模板编辑模态框 */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {currentTemplate ? '编辑模板' : '创建新模板'}
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white mb-2">模板名称</label>
                <input
                  type="text"
                  defaultValue={currentTemplate?.name || ''}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：AI工具评测模板"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">目标类型</label>
                <select
                  defaultValue={currentTemplate?.target_type || 'blog'}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="blog">博客文章</option>
                  <option value="tool_description">工具描述</option>
                  <option value="category_page">分类页面</option>
                  <option value="landing_page">着陆页</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white mb-2">关键词（用逗号分隔）</label>
                <input
                  type="text"
                  defaultValue={currentTemplate?.keywords.join(', ') || ''}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：AI工具, 人工智能, 工具评测"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">生成频率（天）</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  defaultValue={currentTemplate?.frequency_days || 7}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">模板内容（Markdown格式）</label>
                <textarea
                  defaultValue={currentTemplate?.template || ''}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono h-64"
                  placeholder="# {{title}}\n\n## 介绍\n\n## 主要内容\n\n## 总结"
                ></textarea>
                <p className="text-xs text-neutral-500 mt-1">使用 {{变量名}} 语法添加动态内容变量</p>
              </div>
              
              <div>
                <label className="block text-white mb-2">状态</label>
                <div className="flex items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={currentTemplate?.status === 'active'}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-neutral-300">
                      {currentTemplate?.status === 'active' ? '活跃' : '已暂停'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
              >
                取消
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {currentTemplate ? '保存修改' : '创建模板'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}