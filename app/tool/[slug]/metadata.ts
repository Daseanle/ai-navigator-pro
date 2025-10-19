import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Metadata } from 'next';

const supabase = createClientComponentClient();

// 获取工具信息
async function getToolInfo(slug: string) {
  const { data } = await supabase
    .from('tools')
    .select('name, tagline')
    .eq('slug', slug)
    .single();
  
  return data;
}

// 获取所有工具的 slug 用于静态生成
export async function generateStaticParams() {
  const { data: tools } = await supabase
    .from('tools')
    .select('slug');

  // 返回一个 Promise 数组，符合 Next.js 15 的要求
  return Promise.all((tools || []).map(async (tool) => {
    return {
      slug: tool.slug,
    };
  }));
}

// 生成元数据
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // 确保在使用 params.slug 之前正确地等待它
  const resolvedParams = await params;
  const toolSlug = resolvedParams.slug;
  const tool = await getToolInfo(toolSlug);
  
  if (!tool) {
    return { title: 'Tool Not Found' };
  }
  
  return {
    title: `${tool.name} | AI Navigator Pro`,
    description: tool.tagline,
  } as Metadata;
}