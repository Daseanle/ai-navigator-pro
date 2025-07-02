import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
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
  const { data: categories } = await supabase
    .from('categories')
    .select('slug');

  return (categories || []).map((category) => ({
    category: category.slug,
  }));
}

// --- 获取分类信息 ---
async function getCategoryInfo(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('name, slug, description')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data as Category;
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
export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await getCategoryInfo(params.category);
  
  if (!category) {
    notFound();
  }
  
  const tools = await getCategoryTools(params.category);

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
              id={tool.id.toString()}
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
export async function generateMetadata({ params }: { params: { category: string } }) {
  // 确保在使用 params.category 之前正确地等待它
  const categorySlug = params.category;
  const category = await getCategoryInfo(categorySlug);
  
  if (!category) {
    return { title: 'Category Not Found' };
  }
  
  return {
    title: `${category.name} AI 工具 | AI Navigator Pro`,
    description: category.description,
  };
}