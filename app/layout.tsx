import './globals.css';
import type { Metadata } from 'next';
// 暂时注释掉 Inter 字体导入，以避免构建时的网络问题
// import { Inter } from 'next/font/google';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';

// 仅在服务器端导入
import { startToolSyncService } from '@/lib/toolSyncService';
import { initReviewService } from '@/lib/reviewService';

// 暂时注释掉 Inter 字体配置
// const inter = Inter({ subsets: ['latin'] });

// 在服务器端启动服务
if (typeof window === 'undefined') {
  try {
    // 使用 setTimeout 确保在应用启动后再执行，避免阻塞渲染
    setTimeout(() => {
      // 启动工具同步服务
      startToolSyncService().catch(err => {
        console.error('启动工具同步服务失败:', err);
      });
      
      // 启动工具评测服务
      initReviewService();
    }, 5000); // 延迟5秒启动
  } catch (error) {
    console.error('初始化后台服务失败:', error);
  }
}

export const metadata: Metadata = {
  title: 'AI Navigator Pro - 发现最佳AI工具',
  description: '探索、比较和学习如何使用最新的AI工具和资源',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`bg-black text-white min-h-screen flex flex-col`}>
        <AppHeader />
        <main className="flex-grow">{children}</main>
        <AppFooter />
      </body>
    </html>
  );
}