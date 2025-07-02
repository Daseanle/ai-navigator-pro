'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Save, Clock, RefreshCw, CheckCircle } from 'lucide-react';

interface ReviewSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  lastRun: string | null;
  nextRun: string | null;
  categoriesPerRun: number;
  toolsPerCategory: number;
}

export default function ReviewSettingsPage() {
  const [settings, setSettings] = useState<ReviewSettings>({
    enabled: false,
    frequency: 'daily',
    lastRun: null,
    nextRun: null,
    categoriesPerRun: 1,
    toolsPerCategory: 5
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pendingTools, setPendingTools] = useState(0);
  
  // 获取当前设置
  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/tools/reviews/status');
      
      if (!response.ok) {
        throw new Error('获取评测设置失败');
      }
      
      const data = await response.json();
      setSettings(data.settings);
      setPendingTools(data.pendingTools || 0);
    } catch (err) {
      console.error('获取评测设置错误:', err);
      setError('获取评测设置失败，请检查网络连接或API密钥配置');
    } finally {
      setLoading(false);
    }
  };
  
  // 保存设置
  const saveSettings = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    
    try {
      const response = await fetch('/api/tools/reviews/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '保存设置失败');
      }
      
      setSaveSuccess(true);
      
      // 更新设置
      setSettings(result.settings);
      
      // 3秒后隐藏成功消息
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('保存设置错误:', err);
      setError(err instanceof Error ? err.message : '保存设置时发生未知错误');
    } finally {
      setSaving(false);
    }
  };
  
  // 处理表单变更
  const handleChange = (field: keyof ReviewSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // 初始加载
  useEffect(() => {
    fetchSettings();
  }, []);
  
  // 格式化日期
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未设置';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '日期格式错误';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">评测自动化设置</h1>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-neutral-400">加载中...</p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          {/* 错误信息 */}
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">操作失败</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* 成功消息 */}
          {saveSuccess && (
            <div className="bg-green-900/30 border border-green-800 text-green-400 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">设置已保存</p>
                  <p className="text-sm">评测自动化设置已成功更新</p>
                </div>
              </div>
            </div>
          )}
          
          {/* 状态信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-neutral-800/50 p-4 rounded-lg">
              <p className="text-sm text-neutral-400 mb-1">自动化状态</p>
              <p className="text-xl font-semibold text-white flex items-center">
                {settings.enabled ? (
                  <>
                    <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                    已启用
                  </>
                ) : (
                  <>
                    <span className="h-3 w-3 bg-red-500 rounded-full mr-2"></span>
                    已禁用
                  </>
                )}
              </p>
            </div>
            
            <div className="bg-neutral-800/50 p-4 rounded-lg">
              <p className="text-sm text-neutral-400 mb-1">上次运行</p>
              <p className="text-xl font-semibold text-white">
                {settings.lastRun ? formatDate(settings.lastRun) : '从未运行'}
              </p>
            </div>
            
            <div className="bg-neutral-800/50 p-4 rounded-lg">
              <p className="text-sm text-neutral-400 mb-1">下次计划</p>
              <p className="text-xl font-semibold text-white">
                {settings.enabled ? formatDate(settings.nextRun) : '已禁用'}
              </p>
            </div>
          </div>
          
          {/* 待评测工具信息 */}
          <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-400 mr-2" />
              <p className="text-blue-400">
                当前有 <span className="font-bold">{pendingTools}</span> 个工具等待评测
              </p>
            </div>
          </div>
          
          {/* 设置表单 */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">基本设置</h3>
              
              <div className="space-y-4">
                {/* 启用自动化 */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      onChange={(e) => handleChange('enabled', e.target.checked)}
                      className="sr-only"
                    />
                    <span className={`block w-10 h-6 rounded-full transition ${settings.enabled ? 'bg-blue-600' : 'bg-neutral-700'}`}>
                      <span className={`block w-4 h-4 mt-1 ml-1 rounded-full transition transform ${settings.enabled ? 'bg-white translate-x-4' : 'bg-neutral-400'}`}></span>
                    </span>
                    <span className="ml-3 text-white">启用自动评测</span>
                  </label>
                  <p className="text-sm text-neutral-400 mt-1 ml-13">系统将按照设定的频率自动生成工具评测</p>
                </div>
                
                {/* 评测频率 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">评测频率</label>
                  <select
                    value={settings.frequency}
                    onChange={(e) => handleChange('frequency', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">每日</option>
                    <option value="weekly">每周</option>
                    <option value="monthly">每月</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">高级设置</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 每次运行的分类数 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">每次处理分类数</label>
                  <select
                    value={settings.categoriesPerRun}
                    onChange={(e) => handleChange('categoriesPerRun', parseInt(e.target.value))}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1个分类</option>
                    <option value={2}>2个分类</option>
                    <option value={3}>3个分类</option>
                    <option value={0}>所有分类</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-1">每次自动运行时处理的工具分类数量</p>
                </div>
                
                {/* 每个分类的工具数 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">每个分类处理工具数</label>
                  <select
                    value={settings.toolsPerCategory}
                    onChange={(e) => handleChange('toolsPerCategory', parseInt(e.target.value))}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5个工具</option>
                    <option value={10}>10个工具</option>
                    <option value={20}>20个工具</option>
                    <option value={50}>50个工具</option>
                    <option value={0}>所有工具</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-1">每个分类中处理的工具数量</p>
                </div>
              </div>
            </div>
            
            {/* 保存按钮 */}
            <div className="pt-4 border-t border-neutral-800">
              <button
                onClick={saveSettings}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    保存设置
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}