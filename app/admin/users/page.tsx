'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: string;
  status: 'active' | 'suspended' | 'pending';
}

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    pending: 0,
  });

  // 加载用户数据
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 获取用户数据
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) throw authError;
        
        // 模拟数据，实际项目中应该使用真实的 Supabase Auth 数据
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'admin@example.com',
            created_at: '2023-01-01T00:00:00Z',
            last_sign_in_at: '2023-06-15T10:30:00Z',
            role: 'admin',
            status: 'active',
          },
          {
            id: '2',
            email: 'user1@example.com',
            created_at: '2023-02-15T00:00:00Z',
            last_sign_in_at: '2023-06-10T08:45:00Z',
            role: 'user',
            status: 'active',
          },
          {
            id: '3',
            email: 'user2@example.com',
            created_at: '2023-03-20T00:00:00Z',
            last_sign_in_at: null,
            role: 'user',
            status: 'pending',
          },
          {
            id: '4',
            email: 'user3@example.com',
            created_at: '2023-04-05T00:00:00Z',
            last_sign_in_at: '2023-05-01T14:20:00Z',
            role: 'user',
            status: 'suspended',
          },
        ];
        
        setUsers(mockUsers);
        
        // 获取用户统计信息
        const stats = {
          total: mockUsers.length,
          active: mockUsers.filter(u => u.status === 'active').length,
          suspended: mockUsers.filter(u => u.status === 'suspended').length,
          pending: mockUsers.filter(u => u.status === 'pending').length,
        };
        
        setUserStats(stats);
        
        // 获取用户资料
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
          
        if (profilesError) throw profilesError;
        
        // 将用户资料转换为以用户ID为键的对象
        const profilesMap: Record<string, UserProfile> = {};
        (profilesData || []).forEach((profile: UserProfile) => {
          profilesMap[profile.id] = profile;
        });
        
        setProfiles(profilesMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载用户数据失败');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // 过滤用户
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (profiles[user.id]?.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 格式化日期
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '从未登录';
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // 渲染用户状态标签
  const renderStatusBadge = (status: User['status']) => {
    const statusClasses = {
      active: 'bg-green-900/30 text-green-400 border-green-800/30',
      suspended: 'bg-red-900/30 text-red-400 border-red-800/30',
      pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/30',
    };
    
    const statusText = {
      active: '活跃',
      suspended: '已禁用',
      pending: '待激活',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  // 处理用户角色更改
  const handleRoleChange = (userId: string, newRole: string) => {
    // 实际项目中应该调用API更新用户角色
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  // 处理用户状态更改
  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    // 实际项目中应该调用API更新用户状态
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  // 处理添加/编辑用户
  const handleSaveUser = (userData: Partial<User>) => {
    if (selectedUser) {
      // 更新现有用户
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, ...userData } : user
      ));
    } else {
      // 添加新用户
      const newUser: User = {
        id: `${users.length + 1}`,
        email: userData.email || '',
        created_at: new Date().toISOString(),
        last_sign_in_at: null,
        role: userData.role || 'user',
        status: userData.status || 'pending',
      };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">用户管理</h1>
      
      {/* 用户统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <p className="text-neutral-400 text-sm">总用户数</p>
          <p className="text-2xl font-bold text-white">{userStats.total}</p>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <p className="text-neutral-400 text-sm">活跃用户</p>
          <p className="text-2xl font-bold text-green-400">{userStats.active}</p>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <p className="text-neutral-400 text-sm">已禁用用户</p>
          <p className="text-2xl font-bold text-red-400">{userStats.suspended}</p>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <p className="text-neutral-400 text-sm">待激活用户</p>
          <p className="text-2xl font-bold text-yellow-400">{userStats.pending}</p>
        </div>
      </div>
      
      {/* 用户列表 */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-800/30 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-white">用户列表</h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索用户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button 
              onClick={() => {
                setSelectedUser(null);
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              添加用户
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 py-4">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-neutral-400 py-4">没有找到匹配的用户</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-neutral-300">
              <thead className="text-xs uppercase bg-neutral-800 text-neutral-400">
                <tr>
                  <th className="px-4 py-3">用户名/邮箱</th>
                  <th className="px-4 py-3">角色</th>
                  <th className="px-4 py-3">状态</th>
                  <th className="px-4 py-3">注册时间</th>
                  <th className="px-4 py-3">最后登录</th>
                  <th className="px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-neutral-800 bg-neutral-900 hover:bg-neutral-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center mr-3">
                          {profiles[user.id]?.username?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{profiles[user.id]?.username || '未设置用户名'}</div>
                          <div className="text-neutral-400 text-xs">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                    <td className="px-4 py-3">{renderStatusBadge(user.status)}</td>
                    <td className="px-4 py-3">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-3">{formatDate(user.last_sign_in_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setShowModal(true);
                          }}
                          className="text-blue-500 hover:text-blue-400 flex items-center"
                          title="编辑用户"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          编辑
                        </button>
                        <button 
                          onClick={() => {
                            const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
                            handleStatusChange(user.id, newStatus);
                          }}
                          className={`flex items-center ${user.status === 'suspended' ? 'text-green-500 hover:text-green-400' : 'text-red-500 hover:text-red-400'}`}
                          title={user.status === 'suspended' ? '解除禁用' : '禁用用户'}
                        >
                          {user.status === 'suspended' ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              解禁
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                              </svg>
                              禁用
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* 用户编辑/创建模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">
              {selectedUser ? '编辑用户' : '添加新用户'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-300 mb-2">邮箱</label>
              <input 
                type="text" 
                defaultValue={selectedUser?.email || ''} 
                disabled={!!selectedUser}
                placeholder="user@example.com"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="user-email"
              />
            </div>
            
            {!selectedUser && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-300 mb-2">密码</label>
                <input 
                  type="password" 
                  placeholder="设置初始密码"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="user-password"
                />
                <p className="text-xs text-neutral-500 mt-1">密码长度至少为8个字符</p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-300 mb-2">角色</label>
              <select 
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedUser?.role || 'user'}
                id="user-role"
              >
                <option value="user">用户</option>
                <option value="admin">管理员</option>
                <option value="editor">编辑</option>
              </select>
              <p className="text-xs text-neutral-500 mt-1">管理员可以访问所有管理功能，编辑者只能管理内容</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-300 mb-2">状态</label>
              <select 
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedUser?.status || 'pending'}
                id="user-status"
              >
                <option value="active">活跃</option>
                <option value="suspended">已禁用</option>
                <option value="pending">待激活</option>
              </select>
              <p className="text-xs text-neutral-500 mt-1">已禁用的用户无法登录系统</p>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setShowModal(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  const email = (document.getElementById('user-email') as HTMLInputElement).value;
                  const role = (document.getElementById('user-role') as HTMLSelectElement).value;
                  const status = (document.getElementById('user-status') as HTMLSelectElement).value as User['status'];
                  
                  const userData: Partial<User> = {
                    email,
                    role,
                    status,
                  };
                  
                  if (!selectedUser) {
                    const password = (document.getElementById('user-password') as HTMLInputElement).value;
                    if (!email || !password) {
                      alert('请填写所有必填字段');
                      return;
                    }
                    if (password.length < 8) {
                      alert('密码长度至少为8个字符');
                      return;
                    }
                    // 实际项目中应该将密码传递给API
                  }
                  
                  handleSaveUser(userData);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {selectedUser ? '保存更改' : '创建用户'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}