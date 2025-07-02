'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ToolDetail, Category, Tag, Comment } from '@/types';

// 定义数据库表类型
type TableType = 'tools' | 'categories' | 'tags' | 'comments';

export default function DatabaseManagementPage() {
  const [activeTab, setActiveTab] = useState<TableType>('tools');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<Record<TableType, number>>({
    tools: 0,
    categories: 0,
    tags: 0,
    comments: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 计算分页范围
        const from = (currentPage - 1) * pageSize;
        const to = from + pageSize - 1;
        
        // 构建查询
        let query = supabase
          .from(activeTab)
          .select('*', { count: 'exact' });
        
        // 添加搜索条件（如果有）
        if (searchTerm) {
          // 根据不同表格应用不同的搜索字段
          if (activeTab === 'tools') {
            query = query.or(`name.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%,tagline.ilike.%${searchTerm}%`);
          } else if (activeTab === 'categories') {
            query = query.or(`name.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%`);
          } else if (activeTab === 'tags') {
            query = query.ilike('name', `%${searchTerm}%`);
          } else if (activeTab === 'comments') {
            query = query.ilike('content', `%${searchTerm}%`);
          }
        }
        
        // 添加分页
        query = query.range(from, to);
        
        // 执行查询
        const { data, error, count } = await query;
          
        if (error) throw error;
        
        setData(data || []);
        
        // 更新总页数
        if (count !== null) {
          setTotalPages(Math.ceil(count / pageSize));
        }
        
        // 获取各表的总数
        await fetchCounts();
      } catch (err) {
        console.error('数据加载错误:', err);
        setError(err instanceof Error ? err.message : '加载数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, currentPage, pageSize, searchTerm]);
  
  // 获取各表的数据总数
  const fetchCounts = async () => {
    const tables: TableType[] = ['tools', 'categories', 'tags', 'comments'];
    const counts: Record<TableType, number> = {
      tools: 0,
      categories: 0,
      tags: 0,
      comments: 0
    };
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
        
      if (!error && count !== null) {
        counts[table] = count;
      }
    }
    
    setTotalCount(counts);
  };

  // 渲染表格
  const renderTable = () => {
    if (loading) return <div className="text-center py-8"><div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>;
    if (error) return <div className="text-red-500 py-4">{error}</div>;
    if (data.length === 0) return <div className="text-neutral-400 py-4">没有数据</div>;
    
    // 获取表格的列名
    const columns = Object.keys(data[0]);
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-neutral-300">
          <thead className="text-xs uppercase bg-neutral-800 text-neutral-400">
            <tr>
              {columns.map(column => (
                <th key={column} className="px-4 py-3">{column}</th>
              ))}
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-neutral-800 bg-neutral-900 hover:bg-neutral-800">
                {columns.map(column => (
                  <td key={column} className="px-4 py-3">
                    {renderCellValue(row[column])}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <button className="text-blue-500 hover:text-blue-400 mr-2">编辑</button>
                  <button className="text-red-500 hover:text-red-400">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // 渲染单元格值
  const renderCellValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? '是' : '否';
    if (typeof value === 'object') return JSON.stringify(value).slice(0, 50) + '...';
    return String(value).length > 50 ? String(value).slice(0, 50) + '...' : String(value);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">数据库管理</h1>
      
      {/* 数据库统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {(Object.keys(totalCount) as TableType[]).map(table => (
          <div 
            key={table}
            onClick={() => setActiveTab(table)}
            className={`cursor-pointer p-4 rounded-lg border ${activeTab === table ? 'bg-blue-900/30 border-blue-800/50' : 'bg-neutral-900 border-neutral-800'}`}
          >
            <p className="text-lg font-semibold text-white capitalize">{table}</p>
            <p className="text-2xl font-bold text-blue-400">{totalCount[table]}</p>
            <p className="text-neutral-400 text-sm">条记录</p>
          </div>
        ))}
      </div>
      
      {/* 数据表格 */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-white capitalize">{activeTab} 表</h2>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* 搜索框 */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder={`搜索${activeTab === 'tools' ? '工具' : 
                              activeTab === 'categories' ? '分类' : 
                              activeTab === 'tags' ? '标签' : '评论'}...`}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // 重置到第一页
                }}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
            
            {/* 每页显示数量选择器 */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-sm">每页显示:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1); // 重置到第一页
                }}
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg whitespace-nowrap">
              添加新{activeTab === 'tools' ? '工具' : 
                     activeTab === 'categories' ? '分类' : 
                     activeTab === 'tags' ? '标签' : '评论'}
            </button>
          </div>
        </div>
        
        {renderTable()}
        
        {/* 分页控制 */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-neutral-400 mr-2">每页显示:</span>
            <select 
              value={pageSize} 
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1); // 重置到第一页
              }}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-neutral-800 text-white px-3 py-1 rounded-lg mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            
            <span className="text-neutral-400 mx-2">
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-neutral-800 text-white px-3 py-1 rounded-lg ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
        
        {/* 分页导航 */}
        {!loading && data.length > 0 && totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-neutral-400 text-sm">
              显示 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount[activeTab])} 条，共 {totalCount[activeTab]} 条
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-neutral-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // 显示当前页附近的页码
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-neutral-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}