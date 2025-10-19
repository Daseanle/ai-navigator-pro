import './globals.css'
// 注释掉Google Fonts导入
// import { Inter } from 'next/font/google'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import PWAInstaller from '@/components/PWAInstaller'
import MobileNavigation from '@/components/MobileNavigation'

// 使用系统字体
const inter = {
  className: 'font-sans'
}

// 分离 metadata 和 viewport
export const metadata = {
  title: 'AI Navigator Pro',
  description: '专业的AI工具导航平台',
  manifest: '/manifest.json'
}

// 新的 viewport 导出
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI Navigator" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* 桌面端导航 */}
          <div className="hidden lg:block">
            <AppHeader />
          </div>
          
          {/* 移动端导航 */}
          <MobileNavigation />
          
          {/* 主要内容区域 */}
          <main className="flex-1 pt-16 lg:pt-0 pb-16 lg:pb-0">
            {children}
          </main>
          
          {/* 桌面端页脚 */}
          <div className="hidden lg:block">
            <AppFooter />
          </div>
        </div>
        
        {/* PWA 安装提示 */}
        <PWAInstaller />
      </body>
    </html>
  )
}