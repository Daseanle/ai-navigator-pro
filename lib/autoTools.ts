import { supabase } from './supabaseClient';
import { Tool } from './api';
import axios from 'axios';
import { addSyncHistory } from './syncHistory';

// 定义外部API工具数据结构
interface ExternalTool {
  id: string;
  name: string;
  description: string;
  image_url: string;
  website: string;
  categories: string[];
  pricing?: string;
}

// 将外部API数据转换为我们的数据结构
function transformExternalTool(tool: ExternalTool): Omit<Tool, 'id'> & { pricing: string } {
  // 生成slug - 将工具名称转换为小写并替换空格为连字符
  const slug = tool.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  return {
    slug,
    name: tool.name,
    tagline: tool.description,
    logo_url: tool.image_url || '/images/tools/default-logo.png', // 使用默认图片如果没有提供
    website_url: tool.website,
    tags: tool.categories.map(category => ({ name: category })),
    pricing: tool.pricing || 'Free' // 默认为免费
  };
}

// 从外部API获取工具数据
async function fetchExternalTools(): Promise<ExternalTool[]> {
  try {
    // 检查OpenRouter API密钥是否已配置
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('未配置OpenRouter API密钥，请在.env.local文件中添加OPENROUTER_API_KEY');
      return [];
    }
    
    // 使用OpenRouter API获取AI工具数据
    // 这里我们使用OpenRouter API生成一些AI工具数据
    const { generateWithOpenRouter } = await import('./openRouterService');
    
    const prompt = `
请生成10个流行的AI工具信息，每个工具包含以下字段：
- id: 唯一标识符
- name: 工具名称
- description: 简短描述（不超过100字符）
- image_url: 图片URL（使用占位图，例如https://placehold.co/200x200?text=工具名）
- website: 网站URL（使用example.com域名）
- categories: 分类标签数组（每个工具2-3个标签）
- pricing: 价格模式（Free、Freemium或Paid）

请确保工具涵盖不同领域，如内容创作、图像生成、代码辅助、数据分析等。
请以JSON数组格式返回，不要包含任何其他文本。
`;
    
    const systemPrompt = '你是一个AI工具专家，了解各种最新的AI工具和应用。你的回答应该准确、客观，并符合要求的格式。';
    
    const response = await generateWithOpenRouter(prompt, systemPrompt, 'openai/gpt-4', 0.7, 2000);
    
    // 解析JSON响应
    try {
      // 尝试直接解析
      const tools = JSON.parse(response) as ExternalTool[];
      return tools;
    } catch (parseError) {
      console.error('解析工具数据失败，尝试提取JSON部分:', parseError);
      
      // 尝试从响应中提取JSON部分
      const jsonMatch = response.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        try {
          const tools = JSON.parse(jsonStr) as ExternalTool[];
          return tools;
        } catch (secondParseError) {
          console.error('第二次解析工具数据失败:', secondParseError);
        }
      }
      
      // 如果无法解析，返回默认工具数据
      console.log('无法解析AI响应，使用默认工具数据');
      return [
        {
          id: 'tool1',
          name: 'AI Writer Pro',
          description: '使用先进的AI技术帮助你创作高质量内容',
          image_url: 'https://placehold.co/200x200?text=AI+Writer',
          website: 'https://aiwriterpro.example.com',
          categories: ['内容创作', '写作辅助'],
          pricing: 'Freemium'
        },
        {
          id: 'tool2',
          name: 'DataViz AI',
          description: '将复杂数据转化为直观可视化图表的AI工具',
          image_url: 'https://placehold.co/200x200?text=DataViz',
          website: 'https://dataviz.example.com',
          categories: ['数据分析', '可视化'],
          pricing: 'Paid'
        },
        {
          id: 'tool3',
          name: 'CodeAssist',
          description: 'AI驱动的代码助手，提高开发效率',
          image_url: 'https://placehold.co/200x200?text=CodeAssist',
          website: 'https://codeassist.example.com',
          categories: ['开发工具', '编程辅助'],
          pricing: 'Free'
        }
      ];
    }
  } catch (error) {
    console.error('获取外部工具数据失败:', error);
    return [];
  }
}

// 检查工具是否已存在
async function toolExists(slug: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('tools')
    .select('id')
    .eq('slug', slug)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 是未找到记录的错误代码
    console.error('检查工具是否存在时出错:', error);
  }
  
  return !!data;
}

// 添加新工具到数据库
async function addToolToDatabase(tool: Omit<Tool, 'id'> & { pricing: string }): Promise<boolean> {
  try {
    // 1. 添加工具基本信息
    const { data: toolData, error: toolError } = await supabase
      .from('tools')
      .insert({
        slug: tool.slug,
        name: tool.name,
        tagline: tool.tagline,
        logo_url: tool.logo_url,
        website_url: tool.website_url,
        pricing: tool.pricing
      })
      .select('id')
      .single();
    
    if (toolError) {
      console.error('添加工具失败:', tool.name, toolError);
      return false;
    }
    
    // 2. 添加工具标签
    if (tool.tags && tool.tags.length > 0) {
      const toolId = toolData.id;
      
      // 首先检查标签是否存在，不存在则创建
      for (const tag of tool.tags) {
        // 检查标签是否存在
        const { data: existingTag, error: tagCheckError } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tag.name)
          .single();
        
        let tagId;
        
        if (tagCheckError && tagCheckError.code === 'PGRST116') {
          // 标签不存在，创建新标签
          const { data: newTag, error: createTagError } = await supabase
            .from('tags')
            .insert({ name: tag.name })
            .select('id')
            .single();
          
          if (createTagError) {
            console.error('创建标签失败:', createTagError);
            continue;
          }
          
          tagId = newTag.id;
        } else if (existingTag) {
          tagId = existingTag.id;
        } else {
          continue; // 跳过此标签
        }
        
        // 创建工具与标签的关联
        const { error: toolTagError } = await supabase
          .from('tool_tags')
          .insert({
            tool_id: toolId,
            tag_id: tagId
          });
        
        if (toolTagError) {
          console.error('关联工具和标签失败:', toolTagError);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('添加工具到数据库时出错:', error);
    return false;
  }
}

// 自动同步工具的主函数
export async function syncExternalTools(): Promise<{
  added: number;
  skipped: number;
  errors: number;
}> {
  let externalTools: any[] = [];
  
  const result = {
    added: 0,
    skipped: 0,
    errors: 0
  };
  
  try {
    // 1. 获取外部工具数据
    externalTools = await fetchExternalTools();
    console.log(`获取到 ${externalTools.length} 个外部工具`);
    
    // 2. 处理每个工具
    for (const externalTool of externalTools) {
      const transformedTool = transformExternalTool(externalTool);
      
      // 检查工具是否已存在
      const exists = await toolExists(transformedTool.slug);
      
      if (exists) {
        console.log(`工具 "${transformedTool.name}" 已存在，跳过`);
        result.skipped++;
        continue;
      }
      
      // 添加新工具
      const success = await addToolToDatabase(transformedTool);
      
      if (success) {
        console.log(`成功添加工具: ${transformedTool.name}`);
        result.added++;
      } else {
        console.error(`添加工具失败: ${transformedTool.name}`);
        result.errors++;
      }
    }
    
    console.log(`同步完成: 添加 ${result.added} 个, 跳过 ${result.skipped} 个, 错误 ${result.errors} 个`);
    return result;
  } catch (error) {
    console.error('同步工具时出错:', error);
    result.errors = externalTools?.length || 0;
    return result;
  }
}

// 定时执行同步的函数
export async function scheduleToolSync(intervalHours = 24): Promise<NodeJS.Timeout> {
  // 立即执行一次
  await syncExternalTools();
  
  // 设置定时执行
  const intervalMs = intervalHours * 60 * 60 * 1000;
  const timer = setInterval(async () => {
    console.log(`执行定时工具同步 - ${new Date().toISOString()}`);
    await syncExternalTools();
  }, intervalMs);
  
  return timer;
}