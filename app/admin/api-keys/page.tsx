'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { RefreshCw, Key, Trash, Check, X, Copy, Plus } from 'lucide-react';

interface ApiKey {
  id: string;
  key: string;
  user_id: string;
  created_at: string;
  expires_at: string | null;
  last_used_at: string | null;
  active: boolean;
}

interface User {
  id: string;
  email: string;
  role: string;
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [expiresInDays, setExpiresInDays] = useState(365);
  const [generatingKey, setGeneratingKey] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 获取当前用户会话
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('未授权，请先登录');
        }
        
        // 获取API密钥列表
        const { data: keys, error: keysError } = await supabase
          .from('api_keys')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (keysError) throw keysError;
        
        // 获取用户列表
        const { data: usersList, error: usersError } = await supabase
          .from('profiles')
          .select('id, email, role');
        
        if (usersError) throw usersError;
        
        setApiKeys(keys || []);
        setUsers(usersList || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // 生成新的API密钥
  const generateApiKey = async () => {
    if (!selectedUserId) {
      alert('请选择用户');
      return;
    }
    
    setGeneratingKey(true);
    setNewKey(null);
    
    try {
      // 获取当前用户会话
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('未授权，请先登录');
      }
      
      // 调用生成API密钥的API
      const response = await fetch('/api/auth/generate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          userId: selectedUserId,
          expiresInDays
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '生成API密钥失败');
      }
      
      // 显示新生成的密钥
      setNewKey(result.key);
      
      // 刷新密钥列表
      const { data: keys, error: keysError } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (keysError) throw keysError;
      
      setApiKeys(keys || []);
    } catch (err) {
      alert(err instanceof Error ? err.message : '生成API密钥失败');
    } finally {
      setGeneratingKey(false);
    }
  };
  
  // 撤销API密钥
  const revokeApiKey = async (keyId: string) => {
    if (!confirm('确定要撤销此API密钥吗？此操作不可逆。')) {
      return;
    }
    
    try {
      // 获取当前用户会话
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('未授权，请先登录');
      }
      
      // 调用撤销API密钥的API
      const response = await fetch('/api/auth/manage-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'revoke',
          keyId
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '撤销API密钥失败');
      }
      
      // 更新本地状态
      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? { ...key, active: false } : key
      ));
      
      alert('API密钥已撤销');
    } catch (err) {
      alert(err instanceof Error ? err.message : '撤销API密钥失败');
    }
  };
  
  // 切换API密钥状态
  const toggleApiKeyStatus = async (keyId: string, currentStatus: boolean) => {
    try {
      // 获取当前用户会话
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('未授权，请先登录');
      }
      
      // 调用更新API密钥状态的API
      const response = await fetch('/api/auth/manage-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'update',
          keyId,
          active: !currentStatus
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '更新API密钥状态失败');
      }
      
      // 更新本地状态
      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? { ...key, active: !currentStatus } : key
      ));
    } catch (err) {
      alert(err instanceof Error ? err.message : '更新API密钥状态失败');
    }
  };
  
  // 复制API密钥到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };
  
  // 过滤API密钥
  const filteredKeys = apiKeys.filter(key => {
    const userEmail = users.find(u => u.id === key.user_id)?.email || '';
    return (
      key.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">API密钥管理</h1>
      </div>
      
      {/* 搜索栏 */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索API密钥或用户..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>
      
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
          {/* 生成新密钥 */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">生成新的API密钥</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-white mb-2">用户</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">选择用户</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.email} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-white mb-2">过期时间（天）</label>
                <input
                  type="number"
                  min="1"
                  max="3650"
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(e.target.value === '' ? 30 : parseInt(e.target.value))}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={generateApiKey}
                  disabled={generatingKey || !selectedUserId}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingKey ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      生成API密钥
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {newKey && (
              <div className="mt-4 p-4 bg-green-900/30 border border-green-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-green-400 font-medium mb-1">新API密钥已生成</p>
                    <p className="text-white font-mono break-all">{newKey}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(newKey)}
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                    title="复制到剪贴板"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-yellow-400 mt-2 text-sm">
                  <strong>重要提示：</strong> 请立即保存此密钥，它只会显示一次！
                </p>
              </div>
            )}
          </div>
          
          {/* API密钥列表 */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-800">
                    <th className="py-3 px-4 text-left text-neutral-400 font-medium">密钥</th>
                    <th className="py-3 px-4 text-left text-neutral-400 font-medium">用户</th>
                    <th className="py-3 px-4 text-left text-neutral-400 font-medium">创建时间</th>
                    <th className="py-3 px-4 text-left text-neutral-400 font-medium">过期时间</th>
                    <th className="py-3 px-4 text-left text-neutral-400 font-medium">最后使用</th>
                    <th className="py-3 px-4 text-left text-neutral-400 font-medium">状态</th>
                    <th className="py-3 px-4 text-left text-neutral-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredKeys.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 px-4 text-center text-neutral-400">
                        没有找到匹配的API密钥
                      </td>
                    </tr>
                  ) : (
                    filteredKeys.map(key => {
                      const user = users.find(u => u.id === key.user_id);
                      const isExpired = key.expires_at && new Date(key.expires_at) < new Date();
                      
                      return (
                        <tr key={key.id} className="hover:bg-neutral-800/50">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <Key className="h-5 w-5 text-neutral-500 mr-2" />
                              <span className="font-mono text-white">
                                {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 4)}
                              </span>
                              <button
                                onClick={() => copyToClipboard(key.key)}
                                className="ml-2 p-1 text-neutral-500 hover:text-white transition-colors"
                                title="复制到剪贴板"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-white">
                            {user?.email || <span className="text-neutral-500">未知用户</span>}
                          </td>
                          <td className="py-4 px-4 text-neutral-400">
                            {new Date(key.created_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            {key.expires_at ? (
                              <span className={isExpired ? 'text-red-400' : 'text-neutral-400'}>
                                {new Date(key.expires_at).toLocaleDateString()}
                                {isExpired && ' (已过期)'}
                              </span>
                            ) : (
                              <span className="text-neutral-500">永不过期</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-neutral-400">
                            {key.last_used_at ? (
                              new Date(key.last_used_at).toLocaleString()
                            ) : (
                              <span className="text-neutral-500">从未使用</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              key.active 
                                ? 'bg-green-900/30 text-green-400 border border-green-800/30' 
                                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                            }`}>
                              {key.active ? '活跃' : '已禁用'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleApiKeyStatus(key.id, key.active)}
                                className={`p-2 ${key.active ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'} transition-colors`}
                                title={key.active ? '禁用' : '启用'}
                              >
                                {key.active ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                              </button>
                              <button
                                onClick={() => revokeApiKey(key.id)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                title="撤销"
                              >
                                <Trash className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}