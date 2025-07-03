'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface SystemSetting {
  id: string;
  name: string;
  value: string;
  description: string;
  category: 'general' | 'api' | 'integration' | 'notification' | 'security';
  is_sensitive: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<SystemSetting['category']>('general');
  const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // 加载系统设置
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 实际项目中应该从数据库加载设置
        // const { data, error } = await supabase.from('system_settings').select('*');
        // if (error) throw error;
        
        // 模拟数据
        const mockSettings: SystemSetting[] = [
          {
            id: '1',
            name: 'site_name',
            value: 'AI Navigator Pro',
            description: '网站名称',
            category: 'general',
            is_sensitive: false
          },
          {
            id: '2',
            name: 'site_description',
            value: '发现和比较最佳AI工具的平台',
            description: '网站描述',
            category: 'general',
            is_sensitive: false
          },
          {
            id: '3',
            name: 'contact_email',
            value: 'contact@ainavigator.example.com',
            description: '联系邮箱',
            category: 'general',
            is_sensitive: false
          },
          {
            id: '4',
            name: 'tools_per_page',
            value: '12',
            description: '每页显示的工具数量',
            category: 'general',
            is_sensitive: false
          },
          {
            id: '5',
            name: 'openrouter_api_key',
            value: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            description: 'OpenRouter API密钥',
            category: 'api',
            is_sensitive: true
          },
          {
            id: '6',
            name: 'tools_sync_api_key',
            value: 'ai-navigator-sync-key-2023',
            description: '工具同步API密钥',
            category: 'api',
            is_sensitive: true
          },
          {
            id: '7',
            name: 'tools_sync_interval_hours',
            value: '24',
            description: '工具同步间隔（小时）',
            category: 'api',
            is_sensitive: false
          },
          {
            id: '8',
            name: 'google_analytics_id',
            value: 'G-XXXXXXXXXX',
            description: 'Google Analytics ID',
            category: 'integration',
            is_sensitive: false
          },
          {
            id: '9',
            name: 'mailchimp_api_key',
            value: 'xxxxxxxxxxxxxxxxxxxx-us21',
            description: 'Mailchimp API密钥',
            category: 'integration',
            is_sensitive: true
          },
          {
            id: '10',
            name: 'enable_email_notifications',
            value: 'true',
            description: '启用邮件通知',
            category: 'notification',
            is_sensitive: false
          },
          {
            id: '11',
            name: 'smtp_host',
            value: 'smtp.example.com',
            description: 'SMTP服务器',
            category: 'notification',
            is_sensitive: false
          },
          {
            id: '12',
            name: 'smtp_port',
            value: '587',
            description: 'SMTP端口',
            category: 'notification',
            is_sensitive: false
          },
          {
            id: '13',
            name: 'smtp_username',
            value: 'notifications@example.com',
            description: 'SMTP用户名',
            category: 'notification',
            is_sensitive: true
          },
          {
            id: '14',
            name: 'smtp_password',
            value: 'password123',
            description: 'SMTP密码',
            category: 'notification',
            is_sensitive: true
          },
          {
            id: '15',
            name: 'require_email_verification',
            value: 'true',
            description: '要求邮箱验证',
            category: 'security',
            is_sensitive: false
          },
          {
            id: '16',
            name: 'max_login_attempts',
            value: '5',
            description: '最大登录尝试次数',
            category: 'security',
            is_sensitive: false
          },
          {
            id: '17',
            name: 'session_timeout_minutes',
            value: '60',
            description: '会话超时（分钟）',
            category: 'security',
            is_sensitive: false
          },
        ];
        
        setSettings(mockSettings);
        
        // 初始化编辑状态
        const initialEditState: Record<string, string> = {};
        mockSettings.forEach(setting => {
          initialEditState[setting.id] = setting.value;
        });
        setEditedSettings(initialEditState);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载设置失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  // 过滤当前分类的设置
  const filteredSettings = settings.filter(setting => setting.category === activeCategory);

  // 处理设置变更
  const handleSettingChange = (id: string, value: string) => {
    setEditedSettings(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // 保存设置
  const saveSettings = async () => {
    setSaveStatus('saving');
    
    try {
      // 在实际项目中，这里应该调用API保存设置
      // const updates = settings.map(setting => ({
      //   id: setting.id,
      //   value: editedSettings[setting.id]
      // }));
      // 
      // for (const update of updates) {
      //   await supabase
      //     .from('system_settings')
      //     .update({ value: update.value })
      //     .eq('id', update.id);
      // }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新本地设置状态
      setSettings(prev => prev.map(setting => ({
        ...setting,
        value: editedSettings[setting.id]
      })));
      
      setSaveStatus('success');
      
      // 3秒后重置状态
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setSaveStatus('error');
      
      // 3秒后重置状态
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // 渲染设置输入框
  const renderSettingInput = (setting: SystemSetting) => {
    const value = editedSettings[setting.id] || '';
    
    if (setting.name.includes('enable_') || setting.name.includes('require_')) {
      // 布尔值设置使用开关
      return (
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={value === 'true'}
              onChange={(e) => handleSettingChange(setting.id, e.target.checked ? 'true' : 'false')}
            />
            <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      );
    } else if (setting.is_sensitive) {
      // 敏感信息使用密码输入框
      return (
        <input
          type="password"
          value={value}
          onChange={(e) => handleSettingChange(setting.id, e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    } else {
      // 普通文本输入框
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => handleSettingChange(setting.id, e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    }
  };

  // 渲染保存按钮状态
  const renderSaveButton = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <button 
            disabled 
            className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg opacity-70"
          >
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            保存中...
          </button>
        );
      case 'success':
        return (
          <button 
            disabled 
            className="flex items-center bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            已保存
          </button>
        );
      case 'error':
        return (
          <button 
            onClick={saveSettings}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            保存失败，重试
          </button>
        );
      default:
        return (
          <button 
            onClick={saveSettings}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            保存设置
          </button>
        );
    }
  };

  // 分类标签
  const categories: { id: SystemSetting['category']; name: string }[] = [
    { id: 'general', name: '常规设置' },
    { id: 'api', name: 'API设置' },
    { id: 'integration', name: '第三方集成' },
    { id: 'notification', name: '通知设置' },
    { id: 'security', name: '安全设置' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">系统设置</h1>
      
      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg ${activeCategory === category.id ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-800/30 rounded-xl p-4 mb-8">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 capitalize">{categories.find(c => c.id === activeCategory)?.name}</h2>
          
          <div className="space-y-6">
            {filteredSettings.map(setting => (
              <div key={setting.id} className="border-b border-neutral-800 pb-6 last:border-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">{setting.description}</label>
                    <p className="text-neutral-400 text-xs">{setting.name}</p>
                  </div>
                  <div className="w-full md:w-1/3">
                    {renderSettingInput(setting)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            {renderSaveButton()}
          </div>
        </div>
      )}
    </div>
  );
}