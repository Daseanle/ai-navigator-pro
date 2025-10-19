'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import ToolCard from '@/components/ToolCard';
import { User } from '@supabase/supabase-js';

type SavedTool = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  logo_url: string;
  tags: { name: string }[];
};

export default function FavoritesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [savedTools, setSavedTools] = useState<SavedTool[]>([]);
  const [loading, setLoading] = useState(true);
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
            id, slug, name, tagline, logo_url,
            tags (name)
          )
        `)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching bookmarks:', error);
      } else if (bookmarks) {
        const toolsArray = bookmarks
          .map(bookmark => bookmark.tools)
          .filter(Boolean)
          .flat() as SavedTool[];
        setSavedTools(toolsArray);
      }
      
      setLoading(false);
    };

    getUser();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 flex justify-center">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">我的收藏</h1>
      
      {savedTools.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
          <p className="text-neutral-400 mb-4">您还没有收藏任何工具</p>
          <a href="/tools" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            浏览工具库
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedTools.map(tool => (
            <ToolCard 
              key={tool.id}
              id={tool.id}
              slug={tool.slug}
              name={tool.name}
              tagline={tool.tagline}
              logo_url={tool.logo_url}
              tags={tool.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}