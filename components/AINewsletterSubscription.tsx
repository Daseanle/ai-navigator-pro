'use client';

import { useState } from 'react';
import { Mail, Check, AlertCircle, Bell, Calendar, Tag, ChevronDown, X } from 'lucide-react';

type SubscriptionFrequency = 'daily' | 'weekly' | 'monthly';

type SubscriptionCategory = {
  id: string;
  name: string;
  description: string;
  icon?: string;
};

type AINewsletterSubscriptionProps = {
  className?: string;
  defaultEmail?: string;
  defaultFrequency?: SubscriptionFrequency;
  defaultCategories?: string[];
  onSubscribe?: (email: string, frequency: SubscriptionFrequency, categories: string[]) => Promise<boolean>;
};

export default function AINewsletterSubscription({
  className = '',
  defaultEmail = '',
  defaultFrequency = 'weekly',
  defaultCategories = [],
  onSubscribe
}: AINewsletterSubscriptionProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [frequency, setFrequency] = useState<SubscriptionFrequency>(defaultFrequency);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(defaultCategories);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // 可用的订阅类别
  const availableCategories: SubscriptionCategory[] = [
    { id: 'ai-news', name: 'AI行业新闻', description: '最新的AI行业动态、融资和收购信息' },
    { id: 'new-tools', name: '新工具发布', description: '新发布的AI工具和平台' },
    { id: 'tutorials', name: '教程和指南', description: 'AI工具使用教程和最佳实践' },
    { id: 'case-studies', name: '案例研究', description: 'AI在各行业的应用案例' },
    { id: 'research', name: '研究进展', description: 'AI领域的最新研究成果和论文' },
    { id: 'events', name: '活动和会议', description: 'AI相关的线上和线下活动信息' },
  ];

  // 处理类别选择
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!email) {
      setErrorMessage('请输入您的邮箱地址');
      setSubscriptionStatus('error');
      return;
    }
    
    if (selectedCategories.length === 0) {
      setErrorMessage('请至少选择一个订阅类别');
      setSubscriptionStatus('error');
      return;
    }
    
    setLoading(true);
    setSubscriptionStatus('idle');
    setErrorMessage('');
    
    try {
      // 如果提供了onSubscribe回调，则调用它
      if (onSubscribe) {
        const success = await onSubscribe(email, frequency, selectedCategories);
        setSubscriptionStatus(success ? 'success' : 'error');
        if (!success) {
          setErrorMessage('订阅失败，请稍后再试');
        }
      } else {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSubscriptionStatus('success');
      }
    } catch (error) {
      setSubscriptionStatus('error');
      setErrorMessage('订阅过程中发生错误，请稍后再试');
      console.error('订阅错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 清除表单
  const resetForm = () => {
    setEmail('');
    setFrequency('weekly');
    setSelectedCategories([]);
    setSubscriptionStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden ${className}`}>
      {/* 标题部分 */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Mail className="text-blue-400" size={20} />
          <h2 className="text-xl font-bold text-white">AI导航专刊</h2>
        </div>
        <p className="mt-2 text-neutral-400">
          订阅我们的AI导航专刊，获取最新的AI工具、使用技巧和行业动态
        </p>
      </div>
      
      {/* 表单部分 */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* 邮箱输入 */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-2">
            邮箱地址
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            disabled={loading || subscriptionStatus === 'success'}
          />
        </div>
        
        {/* 订阅频率 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>订阅频率</span>
            </div>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFrequency('daily')}
              className={`flex-1 py-2 px-3 rounded-lg border ${frequency === 'daily' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'}`}
              disabled={loading || subscriptionStatus === 'success'}
            >
              每日
            </button>
            <button
              type="button"
              onClick={() => setFrequency('weekly')}
              className={`flex-1 py-2 px-3 rounded-lg border ${frequency === 'weekly' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'}`}
              disabled={loading || subscriptionStatus === 'success'}
            >
              每周
            </button>
            <button
              type="button"
              onClick={() => setFrequency('monthly')}
              className={`flex-1 py-2 px-3 rounded-lg border ${frequency === 'monthly' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'}`}
              disabled={loading || subscriptionStatus === 'success'}
            >
              每月
            </button>
          </div>
        </div>
        
        {/* 订阅类别 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            <div className="flex items-center gap-2">
              <Tag size={16} />
              <span>订阅类别</span>
              <span className="text-xs text-neutral-500">(至少选择一项)</span>
            </div>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full flex justify-between items-center px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
              disabled={loading || subscriptionStatus === 'success'}
            >
              <span>
                {selectedCategories.length > 0 
                  ? `已选择 ${selectedCategories.length} 个类别` 
                  : '选择订阅类别'}
              </span>
              <ChevronDown size={16} className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showCategoryDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg overflow-hidden">
                {availableCategories.map(category => (
                  <div 
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center px-4 py-3 hover:bg-neutral-700 cursor-pointer border-b border-neutral-700 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="text-white font-medium">{category.name}</div>
                      <div className="text-neutral-400 text-sm">{category.description}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-sm flex items-center justify-center ${selectedCategories.includes(category.id) ? 'bg-blue-600' : 'border border-neutral-600'}`}>
                      {selectedCategories.includes(category.id) && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 已选类别标签 */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedCategories.map(categoryId => {
                const category = availableCategories.find(c => c.id === categoryId);
                return category ? (
                  <div key={categoryId} className="flex items-center gap-1 bg-neutral-800 text-neutral-300 px-2 py-1 rounded-full text-sm">
                    {category.name}
                    <button 
                      type="button" 
                      onClick={() => toggleCategory(categoryId)}
                      className="text-neutral-500 hover:text-neutral-300"
                      disabled={loading || subscriptionStatus === 'success'}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
        
        {/* 状态消息 */}
        {subscriptionStatus === 'success' && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-lg flex items-center gap-2 text-green-400">
            <Check size={18} />
            <span>订阅成功！感谢您的订阅，我们将按照您选择的频率发送AI导航专刊。</span>
          </div>
        )}
        
        {subscriptionStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle size={18} />
            <span>{errorMessage || '订阅失败，请稍后再试。'}</span>
          </div>
        )}
        
        {/* 提交按钮 */}
        <div className="flex gap-3">
          {subscriptionStatus === 'success' ? (
            <button
              type="button"
              onClick={resetForm}
              className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
            >
              订阅新的邮箱
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>订阅中...</span>
                </>
              ) : (
                <>
                  <Bell size={18} />
                  <span>订阅AI导航专刊</span>
                </>
              )}
            </button>
          )}
        </div>
        
        {/* 隐私提示 */}
        <div className="mt-4 text-center text-xs text-neutral-500">
          我们重视您的隐私，不会向第三方分享您的邮箱地址。
          您可以随时取消订阅。
        </div>
      </form>
    </div>
  );
}