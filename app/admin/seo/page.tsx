'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, X, Check, XCircle, Loader2, Search, Trash2, Edit2, FileText, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Modal } from '@/components/ui/modal';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type TabValue = 'templates' | 'content' | 'settings';

interface ContentTemplate {
  id: string;
  name: string;
  template: string;
  target_type: string;
  keywords: string[];
  status: string;
  frequency_days: number;
  last_generated: string;
  created_at: string;
}

interface GeneratedContent {
  id: string;
  template_id: string;
  content: string;
  created_at: string;
  status: string;
  keywords: string[];
  performance: {
    impressions: number;
    clicks: number;
    position: number;
  };
}

interface SeoSettings {
  id: string;
  name: string;
  description: string;
  value: string;
}

interface SettingsData {
  templates: ContentTemplate[];
  generatedContent: GeneratedContent[];
  seoSettings: SeoSettings[];
}

export default function SeoContentAutomation() {
  const [activeTab, setActiveTab] = useState<'templates' | 'content' | 'settings'>('templates');
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<ContentTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SeoSettings[]>([]);
  const [seoSettings, setSeoSettings] = useState<SeoSettings[]>([]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [templates, searchQuery, statusFilter]);

  const filteredContent = useMemo(() => {
    return generatedContent.filter(content => {
      const matchesTemplate = !selectedTemplateId || content.template_id === selectedTemplateId;
      return matchesTemplate;
    });
  }, [generatedContent, selectedTemplateId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: templatesData, error: templatesError } = await supabase
        .from('seo_content_templates')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: contentData, error: contentError } = await supabase
        .from('seo_generated_content')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: settingsData, error: settingsError } = await supabase
        .from('seo_settings')
        .select('*');

      if (templatesError || contentError || settingsError) {
        throw new Error('获取数据失败');
      }

      setTemplates(templatesData as ContentTemplate[]);
      setGeneratedContent(contentData as GeneratedContent[]);
      setSeoSettings(settingsData as SeoSettings[]);
    } catch (err) {
      console.error('获取数据失败:', err);
      setError('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab);
  };

  const handleTemplateEdit = (template: ContentTemplate) => {
    setCurrentTemplate(template);
    setShowTemplateModal(true);
  };

  const handleTemplateDelete = async (id: string) => {
    if (!window.confirm('确定要删除此模板吗？')) return;

    try {
      setLoading(true);
      await supabase.from('seo_content_templates').delete().eq('id', id);
      await fetchData();
    } catch (err) {
      console.error('删除模板失败:', err);
      setError('删除模板失败');
    } finally {
      setLoading(false);
    }
  };

  const handleContentDelete = async (id: string) => {
    if (!window.confirm('确定要删除此内容吗？')) return;

    try {
      setLoading(true);
      await supabase.from('generated_content').delete().eq('id', id);
      await fetchData();
    } catch (err) {
      console.error('删除内容失败:', err);
      setError('删除内容失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingUpdate = async (id: string, value: string) => {
    try {
      setLoading(true);
      await supabase
        .from('seo_settings')
        .update({ value })
        .eq('id', id);
      await fetchData();
    } catch (err) {
      console.error('更新设置失败:', err);
      setError('更新设置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentTemplate) return;

    try {
      setLoading(true);
      if (currentTemplate.id) {
        await supabase
          .from('seo_content_templates')
          .update(currentTemplate)
          .eq('id', currentTemplate.id);
      } else {
        await supabase
          .from('seo_content_templates')
          .insert([currentTemplate]);
      }
      await fetchData();
      setShowTemplateModal(false);
      setCurrentTemplate(null);
    } catch (err) {
      console.error('保存模板失败:', err);
      setError('保存模板失败');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async (templateId: string) => {
    if (!window.confirm('确定要生成内容吗？')) return;

    try {
      setLoading(true);
      await supabase
        .from('generated_content')
        .insert([
          {
            template_id: templateId,
            status: 'pending',
            created_at: new Date().toISOString(),
          },
        ]);
      await fetchData();
    } catch (err) {
      console.error('生成内容失败:', err);
      setError('生成内容失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Tabs<TabValue> defaultValue="templates" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="templates" currentValue={activeTab} onValueChange={handleTabChange}>模板管理</TabsTrigger>
          <TabsTrigger value="content" currentValue={activeTab} onValueChange={handleTabChange}>生成内容</TabsTrigger>
          <TabsTrigger value="settings" currentValue={activeTab} onValueChange={handleTabChange}>设置</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" currentValue={activeTab}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">SEO内容模板</h2>
              <Button onClick={() => { setShowTemplateModal(true); setCurrentTemplate(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                新建模板
              </Button>
            </div>

            <div className="grid gap-4">
              {templates.map((template) => (
                <div key={template.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-white">{template.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleTemplateEdit(template)}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        编辑
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleTemplateDelete(template.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-300">目标类型: {template.target_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-300">最后生成: {template.last_generated}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-300">频率: {template.frequency_days}天</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleGenerateContent(template.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      生成内容
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">生成的内容</h2>
            <div className="grid gap-4">
              {generatedContent.map((content) => (
                <div key={content.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-white">内容 #{content.id}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleContentDelete(content.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-300">模板: {content.template_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-300">创建于: {content.created_at}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-300">状态: {content.status}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-white">性能指标</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300">展示次数: {content.performance.impressions}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300">点击次数: {content.performance.clicks}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300">排名: {content.performance.position}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">SEO设置</h2>
            <div className="grid gap-4">
              {settings.map((setting) => (
                <div key={setting.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-white">{setting.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleSettingUpdate(setting.id, setting.value)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        保存
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-300">{setting.description}</p>
                    <div className="mt-2">
                      <Input
                        value={setting.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingUpdate(setting.id, e.target.value)}
                        placeholder="请输入值..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Modal
        isOpen={showTemplateModal}
        onClose={() => {
          setShowTemplateModal(false);
          setCurrentTemplate(null);
        }}
      >
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            {currentTemplate?.id ? '编辑模板' : '新建模板'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">名称</Label>
              <Input
                id="name"
                value={currentTemplate?.name || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (currentTemplate) {
                    setCurrentTemplate({ ...currentTemplate, name: e.target.value });
                  }
                }}
                required
              />
            </div>

            <div>
              <Label htmlFor="template">模板内容</Label>
              <Textarea
                id="template"
                value={currentTemplate?.template || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  if (currentTemplate) {
                    setCurrentTemplate({ ...currentTemplate, template: e.target.value });
                  }
                }}
                required
              />
            </div>

            {currentTemplate?.id && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-300">模板 ID: {currentTemplate.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-300">创建于: {currentTemplate.created_at}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-300">状态: {currentTemplate.status}</span>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="target_type">目标类型</Label>
              <Select
                value={currentTemplate?.target_type || ''}
                onValueChange={(value: string) => {
                  if (currentTemplate) {
                    setCurrentTemplate({ ...currentTemplate, target_type: value });
                  }
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择目标类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">文章</SelectItem>
                  <SelectItem value="blog">博客</SelectItem>
                  <SelectItem value="product">产品描述</SelectItem>
                  <SelectItem value="faq">常见问题</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="keywords">关键词</Label>
              <Input
                id="keywords"
                value={currentTemplate?.keywords?.join(', ') || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (currentTemplate) {
                    setCurrentTemplate({
                      ...currentTemplate,
                      keywords: e.target.value.split(',').map(k => k.trim()),
                    });
                  }
                }}
                placeholder="用逗号分隔关键词"
              />
            </div>

            <div>
              <Label htmlFor="frequency">生成频率（天）</Label>
              <Input
                id="frequency"
                type="number"
                min="1"
                value={currentTemplate?.frequency_days || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (currentTemplate) {
                    setCurrentTemplate({ ...currentTemplate, frequency_days: parseInt(e.target.value) });
                  }
                }}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowTemplateModal(false);
                  setCurrentTemplate(null);
                }}
              >
                <X className="w-4 h-4 mr-2" />
                取消
              </Button>
              <Button type="submit">
                <Check className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}