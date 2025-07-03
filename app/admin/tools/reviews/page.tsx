'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Search, FileText, RefreshCw, CheckCircle, XCircle, Info } from 'lucide-react';

interface ReviewHistory {
  id: number;
  created_at: string;
  status: 'success' | 'error';
  tools_added: number;
  tools_skipped: number;
  tools_error: number;
  error_details?: string;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function ToolReviewsPage() {
  const [reviewHistory, setReviewHistory] = useState<ReviewHistory[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [limit, setLimit] = useState<number>(5);
  
  // 分类列表
  const categories = [
    { id: 'all', name: '所有分类' },
    { id: 'content', name: '内容创作' },
    { id: 'image', name: '图像生成' },
    { id: 'code', name: '编程工具' },
    { id: 'productivity', name: '生产力工具' },
    { id: 'data', name: '数据分析' }
  ];

  // 获取评测历史
  const fetchReviewHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/tools/reviews/history?page=${pagination.page}&pageSize=${pagination.pageSize}`);
      
      if (!response.ok) {
        throw new Error('获取评测历史失败');
      }
      
      const data = await response.json();
      setReviewHistory(data.data || []);
      setPagination(data.pagination || pagination);
    } catch (err) {
      console.error('获取评测历史错误:', err);
      setError('获取评测历史失败，请检查网络连接或API密钥配置');
    } finally {
      setLoading(false);
    }
  };

  // 触发生成评测
  const handleGenerateReviews = async () => {
    setIsGenerating(true);
    setGenerationResult(null);
    setError(null);
    
    try {
      // 准备分类过滤参数
      const categoryFilter = selectedCategory === 'all' ? [] : [selectedCategory];
      
      const response = await fetch('/api/tools/reviews/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          categoryFilter,
          limit,
          skipExisting: true
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '生成评测失败');
      }
      
      setGenerationResult(result);
      
      // 刷新历史记录
      fetchReviewHistory();
    } catch (err) {
      console.error('生成评测错误:', err);
      setError(err instanceof Error ? err.message : '生成评测时发生未知错误');
    } finally {
      setIsGenerating(false);
    }
  };

  // 处理分页
  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  // 初始加载和分页变化时获取数据
  useEffect(() => {
    fetchReviewHistory();
  }, [pagination.page, pagination.pageSize]);

  // 获取最新评测状态
  const fetchLatestReviewStatus = async () => {
    try {
      const response = await fetch('/api/tools/reviews/status');
      
      if (!response.ok) {
        return;
      }
      
      const data = await response.json();
      
      // 更新状态信息
      // 这里可以添加显示上次评测时间、下次计划评测时间等
    } catch (err) {
      console.error('获取评测状态错误:', err);
    }
  };

  useEffect(() => {
    fetchLatestReviewStatus();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">AI工具评测管理</h1>
      
      {/* 生成评测控制面板 */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">生成工具评测</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* 分类选择 */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">选择分类</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          
          {/* 数量限制 */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">生成数量</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1个</option>
              <option value={5}>5个</option>
              <option value={10}>10个</option>
              <option value={20}>20个</option>
              <option value={50}>50个</option>
            </select>
          </div>
          
          {/* 生成按钮 */}
          <div className="flex items-end">
            <button
              onClick={handleGenerateReviews}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 text-white px-4 py-2 rounded-lg flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  生成中...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  生成评测
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* 错误信息 */}
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-lg mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">生成评测失败</p>
                <p className="text-sm">{error}</p>
                <p className="text-sm mt-2">可能的解决方案:</p>
                <ul className="list-disc list-inside text-sm">
                  <li>检查OpenRouter API密钥是否已配置</li>
                  <li>确保数据库连接正常</li>
                  <li>验证工具表结构是否正确</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* 生成结果 */}
        {generationResult && (
          <div className="bg-green-900/30 border border-green-800 text-green-400 p-4 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">评测生成完成</p>
                <p className="text-sm">{generationResult.message}</p>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-neutral-800/50 p-3 rounded-lg">
                    <p className="text-sm text-neutral-400">成功</p>
                    <p className="text-xl font-semibold text-white">{generationResult.results?.length || 0}</p>
                  </div>
                  <div className="bg-neutral-800/50 p-3 rounded-lg">
                    <p className="text-sm text-neutral-400">跳过</p>
                    <p className="text-xl font-semibold text-white">{generationResult.skipped || 0}</p>
                  </div>
                  <div className="bg-neutral-800/50 p-3 rounded-lg">
                    <p className="text-sm text-neutral-400">错误</p>
                    <p className="text-xl font-semibold text-white">{generationResult.errors?.length || 0}</p>
                  </div>
                </div>
                
                {generationResult.results?.length > 0 && (
                  <p className="text-sm mt-4">
                    <a href="/tools" className="text-blue-400 hover:underline">查看工具列表</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 评测历史 */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">评测历史记录</h2>
          
          <div className="relative w-64">
            <input
              type="text"
              placeholder="搜索历史记录..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 pl-9 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-neutral-400">加载中...</p>
          </div>
        ) : reviewHistory.length === 0 ? (
          <div className="text-center py-12 bg-neutral-800/50 rounded-xl">
            <FileText className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">暂无评测历史记录</p>
            <p className="text-sm text-neutral-500 mt-2">点击"生成评测"按钮开始创建工具评测</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="text-left py-3 px-4 text-neutral-400 font-medium">时间</th>
                    <th className="text-left py-3 px-4 text-neutral-400 font-medium">状态</th>
                    <th className="text-center py-3 px-4 text-neutral-400 font-medium">新增</th>
                    <th className="text-center py-3 px-4 text-neutral-400 font-medium">跳过</th>
                    <th className="text-center py-3 px-4 text-neutral-400 font-medium">错误</th>
                    <th className="text-left py-3 px-4 text-neutral-400 font-medium">详情</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewHistory.map((history) => (
                    <tr key={history.id} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                      <td className="py-4 px-4 text-white">
                        {new Date(history.created_at).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${history.status === 'success' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                          {history.status === 'success' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              成功
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              失败
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-white">{history.tools_added}</td>
                      <td className="py-4 px-4 text-center text-white">{history.tools_skipped}</td>
                      <td className="py-4 px-4 text-center text-white">{history.tools_error}</td>
                      <td className="py-4 px-4">
                        {history.error_details ? (
                          <div className="group relative">
                            <button className="text-red-400 hover:text-red-300 flex items-center">
                              <Info className="h-4 w-4" />
                            </button>
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 bg-neutral-800 border border-neutral-700 p-3 rounded-lg shadow-lg z-10">
                              <p className="text-sm text-neutral-300">{history.error_details}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-neutral-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 分页控件 */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 rounded-md bg-neutral-800 text-white disabled:text-neutral-500 disabled:bg-neutral-900"
                  >
                    上一页
                  </button>
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md ${pagination.page === page ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-white'}`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 rounded-md bg-neutral-800 text-white disabled:text-neutral-500 disabled:bg-neutral-900"
                  >
                    下一页
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}