// components/AppHeader.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { User, ChevronDown } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import Link from 'next/link';

export default function AppHeader() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getCurrentUser();

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
  };

  return (
    <header className="border-b border-neutral-800 sticky top-0 bg-black/95 backdrop-blur-sm z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
          AI Navigator Pro
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/tools" className="text-neutral-300 hover:text-white transition-colors">工具库</Link>
          <Link href="/search" className="text-neutral-300 hover:text-white transition-colors">搜索</Link>
          <Link href="/blog" className="text-neutral-300 hover:text-white transition-colors">博客</Link>
          <Link href="/about" className="text-neutral-300 hover:text-white transition-colors">关于</Link>
        </div>
        
        <div className="relative">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={16} className="text-neutral-400" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl py-2 z-50">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white">
                    个人资料
                  </Link>
                  <Link href="/favorites" className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white">
                    我的收藏
                  </Link>
                  <hr className="my-2 border-neutral-800" />
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-800"
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              登录
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}