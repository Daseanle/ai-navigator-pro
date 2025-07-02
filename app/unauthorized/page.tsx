'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-yellow-900/30 rounded-full">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">访问被拒绝</h1>
        
        <p className="text-neutral-400 mb-8">
          您没有访问此页面的权限。如果您认为这是一个错误，请联系系统管理员。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            返回上一页
          </button>
          
          <Link 
            href="/"
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            返回首页
          </Link>
        </div>
      </div>
      
      <div className="mt-8 text-neutral-500 text-sm">
        <p>如需帮助，请发送邮件至 <a href="mailto:support@ainavigator.example.com" className="text-blue-500 hover:text-blue-400">support@ainavigator.example.com</a></p>
      </div>
    </div>
  );
}