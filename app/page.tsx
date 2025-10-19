import { getHotTools } from '@/lib/api';
import SearchBar from '@/components/SearchBar';
import ToolCard from '@/components/ToolCard';
import CategoryList from '@/components/CategoryList';
import Advertisement from '@/components/Advertisement';

// --- 页面元数据 ---
export const metadata = {
  title: 'AI Navigator Pro - 你的AI工具决策中心',
  description: '探索、评测、精通。为你找到解决问题的最佳AI工具。',
}


// --- 页面主组件 ---
export default async function HomePage() {
  const hotTools = await getHotTools(8);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-white">
          不止于导航
        </h1>
        <p className="mt-4 text-xl text-neutral-300">
          探索、评测、精通。为你找到解决问题的最佳AI工具。
        </p>
        
        {/* 搜索栏 */}
        <div className="mt-10">
          <SearchBar 
            placeholder="搜索AI工具、功能或解决方案..." 
            className="max-w-xl mx-auto"
          />
        </div>
      </section>

      {/* 分类导航 */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold text-white mb-8">按分类浏览</h2>
        <CategoryList />
      </section>

      {/* 广告横幅 */}
      <section className="mt-16">
        <Advertisement 
          type="banner"
          position="top"
          size="large"
          title="高级AI课程"
          description="立即报名参加我们的高级AI课程，提升您的技能"
          imageUrl="https://via.placeholder.com/600x200"
          ctaText="立即报名"
          ctaUrl="/courses/advanced-ai"
          sponsorName="AI学院"
          className="w-full"
        />
      </section>

      {/* Hot Tools Showcase */}
      <section className="mt-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">热门工具精选</h2>
          <a href="/search" className="text-blue-400 hover:text-blue-300 transition-colors">
            查看全部 →
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotTools.map(tool => (
            <ToolCard 
              key={tool.slug}
              id={tool.id}
              slug={tool.slug}
              name={tool.name}
              tagline={tool.tagline}
              logo_url={tool.logo_url}
              tags={tool.tags}
            />
          ))}
        </div>
      </section>

      {/* 侧边栏广告 */}
      <section className="mt-16 flex justify-center">
        <Advertisement 
          type="sidebar"
          position="right"
          size="medium"
          title="AI工具专业版"
          description="升级到专业版，解锁所有高级功能"
          imageUrl="https://via.placeholder.com/300x300"
          ctaText="立即升级"
          ctaUrl="/pricing"
          sponsorName="AI工具公司"
          className="max-w-md mx-auto"
        />
      </section>
      
      {/* CTA Section */}
      <section className="mt-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">成为AI工具专家</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8">
          加入我们的社区，获取最新AI工具资讯、专业评测和使用技巧。
        </p>
        <a 
          href="/login" 
          className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
        >
          立即注册
        </a>
      </section>
    </div>
  );
}