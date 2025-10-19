'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle, Settings, Zap, RefreshCw, Star, FileText, Search } from 'lucide-react';

interface AutoOperationSettings {
  toolSync: {
    enabled: boolean;
    intervalHours: number;
  };
  toolReviews: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    categoriesPerRun: number;
    toolsPerCategory: number;
  };
  contentGeneration: {
    enabled: boolean;
    types: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  seoOptimization: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
}

interface AutoOperationResult {
  success: boolean;
  message: string;
  details: {
    toolSync?: {
      added: number;
      skipped: number;
      errors: number;
    };
    toolReviews?: {
      added: number;
      skipped: number;
      errors: number;
    };
    contentGeneration?: {
      success: number;
      failed: number;
    };
    seoOptimization?: {
      success: number;
      failed: number;
    };
  };
}

export default function AutoOperationPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AutoOperationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AutoOperationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 获取设置
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const response = await fetch('/api/auto-operation/settings');
        
        if (!response.ok) {
          throw new Error('获取设置失败');
        }
        
        const data = await response.json();
        setSettings(data.settings);
      } catch (err) {
        setError('获取自动化操作设置失败: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    }
    
    fetchSettings();
  }, []);

  // 保存设置
  const saveSettings = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/auto-operation/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '保存设置失败');
      }
      
      setSuccess('设置已成功保存');
      
      // 3秒后清除成功消息
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('保存设置失败: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  // 执行自动化操作
  const runAutoOperation = async () => {
    try {
      setRunning(true);
      setError(null);
      setSuccess(null);
      setResult(null);
      
      const response = await fetch('/api/auto-operation/run', {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '执行自动化操作失败');
      }
      
      const data = await response.json();
      setResult(data.result);
      
      if (data.result.success) {
        setSuccess('自动化操作已成功完成');
      } else {
        setError('部分自动化操作失败，请查看详情');
      }
    } catch (err) {
      setError('执行自动化操作失败: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setRunning(false);
    }
  };

  // 更新设置字段
  const updateSettings = (path: string, value: any) => {
    if (!settings) return;
    
    // 处理空字符串值，转换为默认值
    if (value === '') {
      // 对于数字类型的字段，使用默认值1
      if (['toolSync.intervalHours', 'toolReviews.categoriesPerRun', 'toolReviews.toolsPerCategory'].includes(path)) {
        value = 1;
      }
    } else if (['toolSync.intervalHours', 'toolReviews.categoriesPerRun', 'toolReviews.toolsPerCategory'].includes(path)) {
      // 确保数字类型字段的值为数字
      value = parseInt(value);
    }
    
    const newSettings = { ...settings };
    const pathParts = path.split('.');
    
    let current: any = newSettings;
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    
    current[pathParts[pathParts.length - 1]] = value;
    setSettings(newSettings);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-neutral-950 min-h-screen text-white">
        <div className="flex items-center mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 mr-4 shadow-lg">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">全自动网站运营</h1>
        </div>
        <div className="flex flex-col items-center justify-center p-12 animate-fadeIn">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full opacity-30 animate-ping"></div>
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 relative z-10" />
          </div>
          <span className="text-neutral-300 text-lg animate-pulse">加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-neutral-950 min-h-screen text-white">
      <div className="flex items-center mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 mr-4 shadow-lg">
          <Zap size={24} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">全自动网站运营</h1>
      </div>
      
      {/* 错误和成功消息 */}
      {error && (
        <div className="bg-red-950/50 border border-red-800 text-red-200 px-6 py-4 rounded-xl mb-6 flex items-center shadow-md">
          <div className="p-2 rounded-lg bg-red-800/50 mr-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <span className="font-medium">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-950/50 border border-green-800 text-green-200 px-6 py-4 rounded-xl mb-6 flex items-center shadow-md">
          <div className="p-2 rounded-lg bg-green-800/50 mr-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <span className="font-medium">{success}</span>
        </div>
      )}
      
      {/* 一键操作按钮 */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-xl p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-800/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 mr-5 shadow-lg transform transition-all duration-500 hover:scale-110 hover:rotate-3">
              <Zap size={28} className="text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">一键自动化运营</h2>
              <p className="text-neutral-300">执行所有已启用的自动化任务，提升网站运营效率</p>
            </div>
          </div>
          <button
            onClick={runAutoOperation}
            disabled={running}
            className={`px-8 py-4 rounded-xl font-medium text-lg flex items-center shadow-lg ${running ? 'bg-neutral-700 text-neutral-300' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'} transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {running ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                执行中...
              </>
            ) : (
              <>
                <Zap className="w-6 h-6 mr-3" />
                开始执行
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* 运行结果 */}
      {result && (
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-xl p-8 mb-8 shadow-lg animate-fadeIn">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 mr-3 animate-bounce">
              <CheckCircle className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">运行结果</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 工具同步结果 */}
            {result.details.toolSync && (
              <div className="bg-neutral-800/50 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/50 hover:border-blue-500/30 transition-all duration-300 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-blue-600/20 mr-3">
                    <RefreshCw className="text-blue-400" size={20} />
                  </div>
                  <h4 className="text-lg font-semibold text-white">工具同步</h4>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-neutral-900/50 rounded-lg p-3 text-center">
                    <p className="text-neutral-400 text-xs mb-1">新增</p>
                    <p className="text-white font-bold text-xl">{result.details.toolSync.added}</p>
                  </div>
                  <div className="bg-neutral-900/50 rounded-lg p-3 text-center">
                    <p className="text-neutral-400 text-xs mb-1">跳过</p>
                    <p className="text-white font-bold text-xl">{result.details.toolSync.skipped}</p>
                  </div>
                  <div className="bg-neutral-900/50 rounded-lg p-3 text-center">
                    <p className="text-neutral-400 text-xs mb-1">错误</p>
                    <p className={`font-bold text-xl ${result.details.toolSync.errors > 0 ? 'text-red-400' : 'text-white'}`}>
                      {result.details.toolSync.errors}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 工具评测结果 */}
            {result.details.toolReviews && (
              <div className="bg-neutral-800/50 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/50 hover:border-amber-500/30 transition-all duration-300 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-amber-600/20 mr-3">
                    <Star className="text-amber-400" size={20} />
                  </div>
                  <h4 className="text-lg font-semibold text-white">工具评测</h4>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-neutral-900/50 rounded-lg p-3 text-center">
                    <p className="text-neutral-400 text-xs mb-1">新增</p>
                    <p className="text-white font-bold text-xl">{result.details.toolReviews.added}</p>
                  </div>
                  <div className="bg-neutral-900/50 rounded-lg p-3 text-center">
                    <p className="text-neutral-400 text-xs mb-1">跳过</p>
                    <p className="text-white font-bold text-xl">{result.details.toolReviews.skipped}</p>
                  </div>
                  <div className="bg-neutral-900/50 rounded-lg p-3 text-center">
                    <p className="text-neutral-400 text-xs mb-1">错误</p>
                    <p className={`font-bold text-xl ${result.details.toolReviews.errors > 0 ? 'text-red-400' : 'text-white'}`}>
                      {result.details.toolReviews.errors}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 内容生成结果 */}
            {result.details.contentGeneration && (
              <div className="bg-neutral-800/50 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/50 hover:border-pink-500/30 transition-all duration-300 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-pink-600/20 mr-3">
                    <FileText className="text-pink-400" size={20} />
                  </div>
                  <h4 className="text-lg font-semibold text-white">内容生成</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-900/50 rounded-lg p-3 text-center">
                    <p className="text-neutral-400 text-xs mb-1">成功</p>
                    <p className="text-white font-bold text-xl">{result.details.contentGeneration.success}</p>
                  </div>
                  <div className="bg-neutral-900/50 rounded-lg p-3 text-center">
                    <p className="text-neutral-400 text-xs mb-1">失败</p>
                    <p className={`font-bold text-xl ${result.details.contentGeneration.failed > 0 ? 'text-red-400' : 'text-white'}`}>
                      {result.details.contentGeneration.failed}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* SEO优化结果 */}
            {result.details.seoOptimization && (
              <div className="bg-neutral-800/50 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/50 hover:border-indigo-500/30 transition-all duration-300 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-indigo-600/20 mr-3">
                    <Search className="text-indigo-400" size={20} />
                  </div>
                  <h4 className="text-lg font-semibold text-white">SEO优化</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-900/50 rounded-lg p-3 text-center">
                    <p className="text-neutral-400 text-xs mb-1">成功</p>
                    <p className="text-white font-bold text-xl">{result.details.seoOptimization.success}</p>
                  </div>
                  <div className="bg-neutral-900/50 rounded-lg p-3 text-center">
                    <p className="text-neutral-400 text-xs mb-1">失败</p>
                    <p className={`font-bold text-xl ${result.details.seoOptimization.failed > 0 ? 'text-red-400' : 'text-white'}`}>
                      {result.details.seoOptimization.failed}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 设置表单 */}
      {settings && (
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-indigo-800/30">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 mr-3 transform transition-all duration-500 hover:scale-110 hover:rotate-12">
                <Settings className="text-white animate-spin-slow" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">自动化设置</h2>
            </div>
            <button
              onClick={saveSettings}
              disabled={saving}
              className={`px-6 py-3 rounded-lg font-medium flex items-center ${saving ? 'bg-neutral-700 text-neutral-300' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl'}`}
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin text-neutral-200" />
                  保存中...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2 text-white" />
                  保存设置
                </>
              )}
            </button>
          </div>
          
          {/* 工具同步设置 */}
          <div className="mb-8 border-b border-neutral-800 pb-8 hover:border-blue-800/30 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-blue-600/20 mr-3 transform transition-all duration-500 hover:scale-110 hover:rotate-180">
                <RefreshCw className="text-blue-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">工具同步</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-800/30 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/30 hover:border-blue-500/30 transition-all duration-300 shadow-md">
                <label className="block text-neutral-300 mb-3 font-medium">启用状态</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.toolSync.enabled}
                    onChange={(e) => updateSettings('toolSync.enabled', e.target.checked)}
                    className="mr-3 h-5 w-5 rounded border-neutral-700 bg-neutral-800 text-blue-600 focus:ring-blue-600 focus:ring-offset-neutral-900 transform transition-all duration-300 hover:scale-110 cursor-pointer"
                  />
                  <span className="text-white text-lg font-medium">{settings.toolSync.enabled ? '已启用' : '已禁用'}</span>
                </div>
              </div>

              <div className="bg-neutral-800/30 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/30 hover:border-blue-500/30 transition-all duration-300 shadow-md">
                <label className="block text-neutral-300 mb-3 font-medium">同步间隔（小时）</label>
                <input
                  type="number"
                  value={settings.toolSync.intervalHours}
                  onChange={(e) => updateSettings('toolSync.intervalHours', e.target.value)}
                  min="1"
                  max="24"
                  className="w-full px-4 py-3 bg-neutral-900/70 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-lg transition-all duration-300 hover:bg-neutral-800/70 focus:bg-neutral-800/90 focus:scale-105 transform"
                  disabled={!settings.toolSync.enabled}
                />
              </div>
            </div>
          </div>
          
          {/* 工具评测设置 */}
          <div className="mb-8 border-b border-neutral-800 pb-8 hover:border-amber-800/30 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-amber-600/20 mr-3 transform transition-all duration-500 hover:scale-110 hover:rotate-12">
                <Star className="text-amber-400 animate-pulse" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">工具评测</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-800/30 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/30 hover:border-amber-500/30 transition-all duration-300 shadow-md">
                <label className="block text-neutral-300 mb-3 font-medium">启用状态</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.toolReviews.enabled}
                    onChange={(e) => updateSettings('toolReviews.enabled', e.target.checked)}
                    className="mr-3 h-5 w-5 rounded border-neutral-700 bg-neutral-800 text-amber-600 focus:ring-amber-600 focus:ring-offset-neutral-900 transform transition-all duration-300 hover:scale-110 cursor-pointer"
                  />
                  <span className="text-white text-lg font-medium">{settings.toolReviews.enabled ? '已启用' : '已禁用'}</span>
                </div>
              </div>

              <div className="bg-neutral-800/30 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/30 hover:border-amber-500/30 transition-all duration-300 shadow-md">
                <label className="block text-neutral-300 mb-3 font-medium">评测频率</label>
                <select
                  value={settings.toolReviews.frequency}
                  onChange={(e) => updateSettings('toolReviews.frequency', e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900/70 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-lg transition-all duration-300 hover:bg-neutral-800/70 focus:bg-neutral-800/90 focus:scale-105 transform cursor-pointer"
                  disabled={!settings.toolReviews.enabled}
                >
                  <option value="daily">每天</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                </select>
              </div>

              <div className="bg-neutral-800/30 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/30 hover:border-amber-500/30 transition-all duration-300 shadow-md">
                <label className="block text-neutral-300 mb-3 font-medium">每次运行处理的分类数</label>
                <input
                  type="number"
                  value={settings.toolReviews.categoriesPerRun}
                  onChange={(e) => updateSettings('toolReviews.categoriesPerRun', e.target.value)}
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 bg-neutral-900/70 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-lg transition-all duration-300 hover:bg-neutral-800/70 focus:bg-neutral-800/90 focus:scale-105 transform"
                  disabled={!settings.toolReviews.enabled}
                />
              </div>

              <div className="bg-neutral-800/30 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/30 hover:border-amber-500/30 transition-all duration-300 shadow-md">
                <label className="block text-neutral-300 mb-3 font-medium">每个分类处理的工具数</label>
                <input
                  type="number"
                  value={settings.toolReviews.toolsPerCategory}
                  onChange={(e) => updateSettings('toolReviews.toolsPerCategory', e.target.value)}
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 bg-neutral-900/70 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-lg transition-all duration-300 hover:bg-neutral-800/70 focus:bg-neutral-800/90 focus:scale-105 transform"
                  disabled={!settings.toolReviews.enabled}
                />
              </div>
            </div>
          </div>
          
          {/* 内容生成设置 */}
          <div className="mb-8 border-b border-neutral-800 pb-8 hover:border-pink-800/30 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-pink-600/20 mr-3 transform transition-all duration-500 hover:scale-110 hover:-translate-y-1">
                <FileText className="text-pink-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-pink-600">内容生成</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-800/30 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/30 hover:border-pink-500/30 transition-all duration-300 shadow-md">
                <label className="block text-neutral-300 mb-3 font-medium">启用状态</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.contentGeneration.enabled}
                    onChange={(e) => updateSettings('contentGeneration.enabled', e.target.checked)}
                    className="mr-3 h-5 w-5 rounded border-neutral-700 bg-neutral-800 text-pink-600 focus:ring-pink-600 focus:ring-offset-neutral-900 transform transition-all duration-300 hover:scale-110 cursor-pointer"
                  />
                  <span className="text-white text-lg font-medium">{settings.contentGeneration.enabled ? '已启用' : '已禁用'}</span>
                </div>
              </div>

              <div className="bg-neutral-800/30 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/30 hover:border-pink-500/30 transition-all duration-300 shadow-md">
                <label className="block text-neutral-300 mb-3 font-medium">生成频率</label>
                <select
                  value={settings.contentGeneration.frequency}
                  onChange={(e) => updateSettings('contentGeneration.frequency', e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900/70 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent text-lg transition-all duration-300 hover:bg-neutral-800/70 focus:bg-neutral-800/90 focus:scale-105 transform cursor-pointer"
                  disabled={!settings.contentGeneration.enabled}
                >
                  <option value="daily">每天</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                </select>
              </div>

              <div className="bg-neutral-800/30 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/30 hover:border-pink-500/30 transition-all duration-300 shadow-md col-span-2">
                <label className="block text-neutral-300 mb-3 font-medium">内容类型</label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {['blog', 'tutorial', 'news'].map(type => (
                    <label key={type} className="inline-flex items-center bg-neutral-900/50 px-4 py-3 rounded-lg border border-neutral-700/50 hover:border-pink-500/30 hover:bg-neutral-800/50 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-neutral-700 bg-neutral-800 text-pink-600 focus:ring-pink-600 focus:ring-offset-neutral-900 transform transition-all duration-300 hover:scale-110 cursor-pointer"
                        checked={settings.contentGeneration.types.includes(type)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...settings.contentGeneration.types, type]
                            : settings.contentGeneration.types.filter(t => t !== type);
                          updateSettings('contentGeneration.types', newTypes);
                        }}
                        disabled={!settings.contentGeneration.enabled}
                      />
                      <span className="ml-3 text-white text-lg font-medium">
                        {type === 'blog' ? '博客' : type === 'tutorial' ? '教程' : '新闻'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* SEO优化设置 */}
          <div className="border-b border-neutral-800 pb-8 hover:border-indigo-800/30 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-indigo-600/20 mr-3 transform transition-all duration-500 hover:scale-110 hover:translate-x-1">
                <Search className="text-indigo-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-indigo-600">SEO优化</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-800/30 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/30 hover:border-indigo-500/30 transition-all duration-300 shadow-md">
                <label className="block text-neutral-300 mb-3 font-medium">启用状态</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.seoOptimization.enabled}
                    onChange={(e) => updateSettings('seoOptimization.enabled', e.target.checked)}
                    className="mr-3 h-5 w-5 rounded border-neutral-700 bg-neutral-800 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-neutral-900 transform transition-all duration-300 hover:scale-110 cursor-pointer"
                  />
                  <span className="text-white text-lg font-medium">{settings.seoOptimization.enabled ? '已启用' : '已禁用'}</span>
                </div>
              </div>

              <div className="bg-neutral-800/30 backdrop-blur-sm rounded-xl p-5 border border-neutral-700/30 hover:border-indigo-500/30 transition-all duration-300 shadow-md">
                <label className="block text-neutral-300 mb-3 font-medium">优化频率</label>
                <select
                  value={settings.seoOptimization.frequency}
                  onChange={(e) => updateSettings('seoOptimization.frequency', e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900/70 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-lg transition-all duration-300 hover:bg-neutral-800/70 focus:bg-neutral-800/90 focus:scale-105 transform cursor-pointer"
                  disabled={!settings.seoOptimization.enabled}
                >
                  <option value="daily">每天</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}