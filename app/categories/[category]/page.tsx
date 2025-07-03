import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ToolCard from '@/components/ToolCard';

// --- 类型定义 ---
type Tool = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  logo_url: string;
  tags: { name: string }[];
};

type Category = {
  name: string;
  slug: string;
  description: string;
};

// --- 获取所有分类 ---
export async function generateStaticParams() {
  // 使用与 CategoryList 相同的模拟数据
  const categories = [
    { slug: 'chatbots', name: '聊天机器人' },
    { slug: 'image-generation', name: '图像生成' },
    { slug: 'text-processing', name: '文本处理' },
    { slug: 'code-assistants', name: '代码助手' },
    { slug: 'audio-processing', name: '音频处理' },
    { slug: 'video-generation', name: '视频生成' }
  ];
  
  return categories.map((category) => ({
    category: category.slug,
  }));
}

// --- 获取分类信息 ---
async function getCategoryInfo(slug: string): Promise<Category | null> {
  // 使用模拟数据，与CategoryList保持一致
  const mockCategories = {
    'chatbots': { name: '聊天机器人', slug: 'chatbots', description: '智能对话和聊天机器人工具' },
    'image-generation': { name: '图像生成', slug: 'image-generation', description: 'AI图像生成和编辑工具' },
    'text-processing': { name: '文本处理', slug: 'text-processing', description: '文本分析和处理工具' },
    'code-assistants': { name: '代码助手', slug: 'code-assistants', description: '编程和代码生成助手' },
    'audio-processing': { name: '音频处理', slug: 'audio-processing', description: '音频生成和编辑工具' },
    'video-generation': { name: '视频生成', slug: 'video-generation', description: '视频生成和编辑工具' },
  };

  return mockCategories[slug as keyof typeof mockCategories] || null;
}

// --- 获取分类下的工具 ---
async function getCategoryTools(categorySlug: string): Promise<Tool[]> {
  // 在实际实现中，你需要创建一个工具与分类的关联表
  // 这里使用简化的查询方式，通过标签匹配分类
  const { data, error } = await supabase
    .from('tools')
    .select(`
      id,
      slug,
      name,
      tagline,
      logo_url,
      tags (name)
    `)
    .eq('tags.name', categorySlug);

  if (error) {
    console.error('Error fetching category tools:', error);
    return [];
  }

  return data as Tool[];
}

// --- 页面组件 ---
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  // 等待 params 解析完成
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;
  
  const category = await getCategoryInfo(categorySlug);
  
  if (!category) {
    notFound();
  }
  
  const tools = await getCategoryTools(categorySlug);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">{category.name}</h1>
        <p className="text-xl text-neutral-300 max-w-3xl mx-auto">{category.description}</p>
      </header>

      {tools.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900 rounded-xl border border-neutral-800">
          <p className="text-neutral-400 text-lg">该分类下暂无工具</p>
          <a href="/" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            返回首页
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
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

// --- SEO 元数据 ---
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryInfo = await getCategoryInfo(resolvedParams.category);
  
  return {
    title: `${categoryInfo?.name || '分类'} - AI Navigator Pro`,
    description: `探索 ${categoryInfo?.name || '该分类'} 相关的AI工具和资源`
  };
}