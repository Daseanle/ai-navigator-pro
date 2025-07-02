'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push('/');
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          },
        });

        if (error) throw error;
        // 显示注册成功消息
        setError('注册成功！请检查您的邮箱完成验证。');
        setMode('login');
      }
    } catch (error: any) {
      setError(error.message || '认证过程中出现错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        {mode === 'login' ? '登录' : '注册'}
      </h1>

      {error && (
        <div className={`p-4 mb-6 rounded-lg ${error.includes('成功') ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
          {error}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
            邮箱地址
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
            密码
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex justify-center items-center"
        >
          {loading ? (
            <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : null}
          {mode === 'login' ? '登录' : '注册'}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {mode === 'login' ? '没有账号？点击注册' : '已有账号？点击登录'}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-neutral-800">
        <p className="text-center text-neutral-500 text-sm">
          登录即表示您同意我们的
          <a href="#" className="text-blue-400 hover:text-blue-300">服务条款</a>
          和
          <a href="#" className="text-blue-400 hover:text-blue-300">隐私政策</a>
        </p>
      </div>
    </div>
  );
}