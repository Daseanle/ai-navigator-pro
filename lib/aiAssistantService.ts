import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 获取相关AI工具信息
 */
export async function getRelevantTools(query: string, limit: number = 5) {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('id, name, tagline, logo_url, website_url, tags(name)')
      .or(`name.ilike.%${query}%,tagline.ilike.%${query}%`)
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('获取相关工具失败:', error);
    return [];
  }
}

/**
 * 获取工具分类信息
 */
export async function getToolCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('获取工具分类失败:', error);
    return [];
  }
}

/**
 * 分析用户意图
 */
export function analyzeUserIntent(message: string) {
  const intent = {
    type: 'general',
    category: null,
    action: null,
    keywords: []
  };

  const lowerMessage = message.toLowerCase();

  // 检测意图类型
  if (lowerMessage.includes('推荐') || lowerMessage.includes('建议')) {
    intent.type = 'recommendation';
    intent.action = 'recommend';
  } else if (lowerMessage.includes('比较') || lowerMessage.includes('对比')) {
    intent.type = 'comparison';
    intent.action = 'compare';
  } else if (lowerMessage.includes('搜索') || lowerMessage.includes('找')) {
    intent.type = 'search';
    intent.action = 'search';
  } else if (lowerMessage.includes('如何') || lowerMessage.includes('怎么')) {
    intent.type = 'tutorial';
    intent.action = 'explain';
  }

  // 检测工具类别
  const categories = {
    '图像': ['图像', '图片', '设计', '绘画', '视觉'],
    '文本': ['写作', '文本', '内容', '文案', '翻译'],
    '代码': ['代码', '编程', '开发', '程序'],
    '音频': ['音频', '音乐', '声音', '语音'],
    '视频': ['视频', '影像', '剪辑', '制作'],
    '数据': ['数据', '分析', '统计', '图表']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      intent.category = category;
      intent.keywords = keywords.filter(keyword => lowerMessage.includes(keyword));
      break;
    }
  }

  return intent;
}