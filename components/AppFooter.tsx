import { Github, Twitter, Mail } from 'lucide-react';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-neutral-800 mt-24 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-4">AI Navigator Pro</h2>
            <p className="text-neutral-400">
              探索、评测、精通。为你找到解决问题的最佳AI工具。
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="mailto:contact@ainavigatorpro.com" className="text-neutral-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">导航</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-neutral-400 hover:text-white transition-colors">首页</a></li>
              <li><a href="/search" className="text-neutral-400 hover:text-white transition-colors">搜索</a></li>
              <li><a href="/categories/chatbots" className="text-neutral-400 hover:text-white transition-colors">聊天机器人</a></li>
              <li><a href="/categories/image-generation" className="text-neutral-400 hover:text-white transition-colors">图像生成</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">资源</h3>
            <ul className="space-y-2">
              <li><a href="/blog" className="text-neutral-400 hover:text-white transition-colors">博客</a></li>
              <li><a href="/tutorials" className="text-neutral-400 hover:text-white transition-colors">教程</a></li>
              <li><a href="/solutions" className="text-neutral-400 hover:text-white transition-colors">行业解决方案</a></li>
              <li><a href="/api-docs" className="text-neutral-400 hover:text-white transition-colors">API文档</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">法律</h3>
            <ul className="space-y-2">
              <li><a href="/privacy-policy" className="text-neutral-400 hover:text-white transition-colors">隐私政策</a></li>
              <li><a href="/terms-of-service" className="text-neutral-400 hover:text-white transition-colors">服务条款</a></li>
              <li><a href="/cookie-policy" className="text-neutral-400 hover:text-white transition-colors">Cookie政策</a></li>
              <li><a href="/about" className="text-neutral-400 hover:text-white transition-colors">关于我们</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-10 pt-6 text-center text-neutral-500">
          <p>© {currentYear} AI Navigator Pro. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
}