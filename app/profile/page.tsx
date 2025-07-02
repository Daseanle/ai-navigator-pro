'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Settings, Star, LogOut } from 'lucide-react';
import ToolCard from '@/components/ToolCard';

type SavedTool = {
  id: number;
  slug: string;
  name: string;
  logo_url: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedTools, setSavedTools] = useState<SavedTool[]>([]);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      
      // 获取用户收藏的工具
      const { data: bookmarks, error } = await supabase
        .from('bookmarks')
        .select(`
          tool_id,
          tools:tool_id(
            id, slug, name, logo_url
          )
        `)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching bookmarks:', error);
      } else if (bookmarks) {
        // 提取工具数据并扁平化数组
        const toolsArray = bookmarks
          .map(bookmark => bookmark.tools)
          .filter(Boolean);
          
        // 将二维数组扁平化为一维数组
        const flattenedTools = toolsArray.flat() as SavedTool[];
        
        setSavedTools(flattenedTools);
      }
      
      setLoading(false);
    };

    getUser();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 侧边栏 */}
        <div className="w-full md:w-64 bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-fit">
          <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-neutral-800">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-white">{user?.email}</h2>
            <p className="text-sm text-neutral-400 mt-1">会员自 {new Date(user?.created_at || '').toLocaleDateString()}</p>
          </div>
          
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 p-3 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-600/20 w-full">
              <Star size={18} />
              <span>收藏工具</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-3 text-neutral-300 hover:bg-neutral-800 rounded-lg w-full transition-colors">
              <Settings size={18} />
              <span>账户设置</span>
            </a>
            <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 rounded-lg w-full transition-colors">
              <LogOut size={18} />
              <span>退出登录</span>
            </button>
          </nav>
        </div>
        
        {/* 主内容区 */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-8">我的收藏</h1>
          
          {savedTools.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
              <p className="text-neutral-400">您还没有收藏任何工具</p>
              <a href="/tools" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                浏览工具库
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedTools.map(tool => (
                <div key={tool.id}>
                  <ToolCard 
                    id={tool.id}
                    slug={tool.slug}
                    name={tool.name}
                    logo_url={tool.logo_url}
                    compact={true}
                    showBookmark={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}