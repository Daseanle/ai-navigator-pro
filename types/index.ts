// types/index.ts

/**
 * 这是一个手动定义的、与您数据库结构大致对应的类型文件。
 * 最佳实践是使用 Supabase CLI 自动生成类型，但手动定义是很好的起步。
 * `npx supabase gen types typescript --project-id <your-project-id> > types/supabase.ts`
 */

// 用户信息
export interface Profile {
  id: string; // uuid
  username: string;
  avatar_url?: string;
  // ... 其他您可能有的 profile 字段
}

// 评论
export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  tool_id: number;
  // 通过 Supabase 关联查询时，可以嵌套 profiles 信息
  profiles?: Profile;
}

// 深度评测
export interface Review {
  id: number;
  conclusion: string;
  pros: string;
  cons: string;
  score_overall: number;
  // ... 其他您 reviews 表中的评分字段
}

// 标签
export interface Tag {
  id: number;
  name: string;
  slug: string;
}

// 分类
export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
}

// 工具详情页所需的数据结构 (来自您之前的代码)
export interface ToolDetail {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  logo_url: string;
  website_url: string;
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Contact for pricing' | null;
  has_api: boolean;
  upvotes_count: number;
  // 关联的数据
  reviews: Review[];
  tags: Pick<Tag, 'name'>[]; // 只选择 name 字段
  comments: Comment[];
  // ... 其他您 tools 表中的字段
}