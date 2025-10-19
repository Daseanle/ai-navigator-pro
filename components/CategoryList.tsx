import { supabase } from '@/lib/supabaseClient';

type Category = {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  count?: number;
};

async function getCategories(): Promise<Category[]> {
  // 在实际实现中，你需要创建一个categories表
  // 这里使用模拟数据
  const mockCategories: Category[] = [
    { id: 1, name: '聊天机器人', slug: 'chatbots', icon: '💬', count: 12 },
    { id: 2, name: '图像生成', slug: 'image-generation', icon: '🎨', count: 8 },
    { id: 3, name: '文本处理', slug: 'text-processing', icon: '📝', count: 15 },
    { id: 4, name: '代码助手', slug: 'code-assistants', icon: '👨‍💻', count: 7 },
    { id: 5, name: '音频处理', slug: 'audio-processing', icon: '🎵', count: 5 },
    { id: 6, name: '视频生成', slug: 'video-generation', icon: '🎬', count: 3 },
  ];

  // 实际数据库查询示例（取消注释使用）
  /*
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, icon, count');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data as Category[];
  */

  return mockCategories;
}

export default async function CategoryList() {
  const categories = await getCategories();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {categories.map(category => (
        <a 
          key={category.id}
          href={`/categories/${category.slug}`}
          className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center hover:border-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/5"
        >
          <div className="text-3xl mb-2">{category.icon}</div>
          <h3 className="font-medium text-white">{category.name}</h3>
          {category.count !== undefined && (
            <p className="text-sm text-neutral-400 mt-1">{category.count} 个工具</p>
          )}
        </a>
      ))}
    </div>
  );
}