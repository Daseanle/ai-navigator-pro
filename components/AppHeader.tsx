// components/AppHeader.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

export default function AppHeader() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // 首次加载时获取当前用户
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getCurrentUser();

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // 页面会自动刷新或通过onAuthStateChange更新状态
  };

  return (
    <header className="border-b border-neutral-800">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-white">AI Navigator Pro</a>
        <div className="hidden md:flex items-center space-x-6">
          <a href="/tools" className="text-neutral-300 hover:text-white transition-colors">Tools</a>
          <a href="/blog" className="text-neutral-300 hover:text-white transition-colors">Blog</a>
          <a href="#" className="text-neutral-300 hover:text-white transition-colors">Solutions</a>
          <a href="#" className="text-neutral-300 hover:text-white transition-colors">Reviews</a>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-400">{user.email}</span>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <a href="/login" className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Login
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}