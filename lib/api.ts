import { supabase } from './supabaseClient';

// --- 类型定义 ---
export type Tool = {
  id: string;  // 改为string类型以匹配UUID
  slug: string;
  name: string;
  tagline: string;
  logo_url: string;
  website_url: string;
  tags: { name: string }[];
};

export type ToolDetail = Tool & {
  reviews: {
    conclusion: string;
    pros: string[];
    cons: string[];
    score_overall: number;
  } | null;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  count?: number;
};

// --- 工具相关API ---

// 获取热门工具
export async function getHotTools(limit: number = 4): Promise<Tool[]> {
  const { data, error } = await supabase
    .from('tools')
    .select(`id, slug, name, tagline, logo_url, website_url, tags (name)`)
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching hot tools:', error);
    return [];
  }
  return data as Tool[];
}

// 获取工具详情
export async function getToolDetail(slug: string): Promise<ToolDetail | null> {
  const { data, error } = await supabase
    .from('tools')
    .select(`
      id,
      slug,
      name,
      tagline,
      logo_url,
      website_url,
      reviews (conclusion, pros, cons, score_overall),
      tags (name)
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Error fetching tool data:', error);
    return null;
  }
  
  // Supabase 返回的 reviews 是一个数组，我们取第一个
  const formattedData = {
    ...data,
    reviews: data.reviews && data.reviews.length > 0 ? data.reviews[0] : null,
  };

  return formattedData as unknown as ToolDetail;
}

// 搜索工具
export async function searchTools(query: string): Promise<Tool[]> {
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from('tools')
    .select(`id, slug, name, tagline, logo_url, website_url, tags (name)`)
    .or(`name.ilike.%${query}%,tagline.ilike.%${query}%`);

  if (error) {
    console.error('Search error:', error);
    return [];
  }
  return data as Tool[];
}

// --- 分类相关API ---

// 获取所有分类
export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, icon, count');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data as Category[];
}

// 获取分类详情
export async function getCategoryDetail(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, icon')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Error fetching category:', error);
    return null;
  }
  return data as Category;
}

// 获取分类下的工具
export async function getCategoryTools(categorySlug: string): Promise<Tool[]> {
  // 在实际实现中，你需要创建一个工具与分类的关联表
  // 这里使用简化的查询方式，通过标签匹配分类
  const { data, error } = await supabase
    .from('tools')
    .select(`id, slug, name, tagline, logo_url, website_url, tags (name)`)
    .eq('tags.name', categorySlug);

  if (error) {
    console.error('Error fetching category tools:', error);
    return [];
  }
  return data as Tool[];
}

// --- 用户相关API ---

// 获取用户收藏的工具
export async function getUserSavedTools(userId: string): Promise<Tool[]> {
  // 在实际实现中，你需要创建一个用户收藏表
  // 这里返回模拟数据
  return [];
}

// 添加工具到收藏
export async function saveToolForUser(userId: string, toolId: number): Promise<boolean> {
  // 在实际实现中，你需要创建一个用户收藏表并插入数据
  return true;
}

// 从收藏中移除工具
export async function removeToolFromSaved(userId: string, toolId: number): Promise<boolean> {
  // 在实际实现中，你需要从用户收藏表中删除数据
  return true;
}