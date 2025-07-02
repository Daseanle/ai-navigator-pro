'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SyncResult {
  added: number;
  skipped: number;
  errors: number;
}

interface SyncHistory {
  id: number;
  added: number;
  skipped: number;
  errors: number;
  status: 'success' | 'error';
  error_message?: string;
  created_at: string;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function ToolSyncPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 5,
    total: 0,
    totalPages: 0
  });
  
  // 获取同步历史记录
  const fetchSyncHistory = async (page = 1) => {
    setIsHistoryLoading(true);
    try {
      const response = await fetch(`/api/tools/sync/history?key=${encodeURIComponent(apiKey)}&page=${page}&pageSize=${pagination.pageSize}`);
      const data = await response.json();
      
      if (!response.ok) {
        console.error('获取同步历史记录失败:', data.error);
        return;
      }
      
      setSyncHistory(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error('获取同步历史记录错误:', err);
    } finally {
      setIsHistoryLoading(false);
    }
  };
  
  // 页面加载时获取同步历史记录
  useEffect(() => {
    if (apiKey) {
      fetchSyncHistory();
    }
  }, [apiKey]);
  
  // 触发工具同步
  const handleSync = async () => {
    if (!apiKey) {
      setError('请输入API密钥');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch(`/api/tools/sync?key=${encodeURIComponent(apiKey)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '同步失败');
      }
      
      setResult(data.result);
      
      // 同步成功后刷新历史记录
      await fetchSyncHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : '同步过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理分页
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchSyncHistory(newPage);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">AI工具自动同步管理</h1>
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">手动触发同步</h2>
        <p className="text-neutral-400 mb-6">
          此功能将从外部API获取最新的AI工具数据，并自动添加到数据库中。
          已存在的工具将被跳过，只添加新工具。
        </p>
        
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-neutral-300 mb-2">
            API密钥
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入API密钥"
          />
        </div>
        
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="flex items-center justify-center w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2.5 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              同步中...
            </>
          ) : '开始同步'}
        </button>
      </div>
      
      {/* 同步状态面板 */}
      {apiKey && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">同步状态</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-900/30 border border-blue-800/30 rounded-xl p-4">
              <p className="text-blue-400 text-sm font-medium">上次同步时间</p>
              <p className="text-white text-lg font-semibold mt-1">
                {syncHistory.length > 0 
                  ? new Date(syncHistory[0].created_at).toLocaleString() 
                  : '暂无记录'}
              </p>
            </div>
            
            <div className="bg-green-900/30 border border-green-800/30 rounded-xl p-4">
              <p className="text-green-400 text-sm font-medium">同步状态</p>
              <p className="text-white text-lg font-semibold mt-1">
                {syncHistory.length > 0 
                  ? (syncHistory[0].status === 'success' ? '成功' : '失败') 
                  : '未知'}
              </p>
            </div>
            
            <div className="bg-purple-900/30 border border-purple-800/30 rounded-xl p-4">
              <p className="text-purple-400 text-sm font-medium">下次计划同步</p>
              <p className="text-white text-lg font-semibold mt-1">
                {syncHistory.length > 0 
                  ? new Date(new Date(syncHistory[0].created_at).getTime() + 24 * 60 * 60 * 1000).toLocaleString() 
                  : '未知'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/30 border border-red-800/30 rounded-xl p-4 mb-8">
          <h3 className="text-lg font-semibold text-red-400 mb-2">同步错误</h3>
          <p className="text-red-400">{error}</p>
          <div className="mt-4">
            <p className="text-neutral-400 text-sm">可能的解决方案:</p>
            <ul className="list-disc list-inside text-neutral-400 text-sm mt-2">
              <li>确认您输入了正确的API密钥</li>
              <li>检查数据库连接是否正常</li>
              <li>检查数据库表结构是否与代码匹配（如缺少列或字段类型不匹配）</li>
              <li>如果错误提示权限问题，请联系系统管理员</li>
              <li>查看服务器日志获取更多详细信息</li>
            </ul>
          </div>
          {error.includes('column') && (
            <div className="mt-4 p-3 bg-neutral-800 rounded-lg">
              <p className="text-amber-400 text-sm font-medium">数据库结构问题</p>
              <p className="text-neutral-300 text-sm mt-1">错误信息表明数据库表结构与代码不匹配。请检查数据库表是否缺少某些列或字段类型不匹配。</p>
            </div>
          )}
        </div>
      )}
      
      {result && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">同步结果</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-900/30 border border-green-800/30 rounded-xl p-4">
              <p className="text-green-400 text-2xl font-bold">{result.added}</p>
              <p className="text-neutral-400">新增工具</p>
            </div>
            
            <div className="bg-blue-900/30 border border-blue-800/30 rounded-xl p-4">
              <p className="text-blue-400 text-2xl font-bold">{result.skipped}</p>
              <p className="text-neutral-400">已存在工具</p>
            </div>
            
            <div className="bg-red-900/30 border border-red-800/30 rounded-xl p-4">
              <p className="text-red-400 text-2xl font-bold">{result.errors}</p>
              <p className="text-neutral-400">错误数量</p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => router.push('/tools')}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              查看工具列表
            </button>
            
            <p className="text-neutral-500 text-sm">
              同步时间: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      )}
      
      {/* 同步历史记录 */}
      {apiKey && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">同步历史记录</h2>
          
          {isHistoryLoading ? (
            <div className="flex justify-center items-center py-8">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : syncHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-neutral-400">暂无同步历史记录</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">时间</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">状态</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">新增</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">跳过</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">错误</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">详情</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syncHistory.map((history) => (
                      <tr key={history.id} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                        <td className="px-4 py-3 text-sm text-neutral-300">
                          {new Date(history.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {history.status === 'success' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                              成功
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400">
                              失败
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-green-400">{history.added}</td>
                        <td className="px-4 py-3 text-sm text-blue-400">{history.skipped}</td>
                        <td className="px-4 py-3 text-sm text-red-400">{history.errors}</td>
                        <td className="px-4 py-3 text-sm">
                          {history.error_message && (
                            <button
                              className="text-neutral-400 hover:text-neutral-300 underline text-xs"
                              onClick={() => alert(history.error_message)}
                            >
                              查看错误
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* 分页控件 */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 rounded-md bg-neutral-800 text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  
                  <span className="px-3 py-1 text-neutral-300">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 rounded-md bg-neutral-800 text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}