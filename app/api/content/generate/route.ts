import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/apiKeyValidation';
import { createClient } from '@supabase/supabase-js';
import { generateWithOpenRouter } from '@/lib/openRouterService';

// 环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 请求接口
interface ContentGenerationRequest {
  template_id: string;
  template_name: string;
  template_content: string;
  keywords: string[];
  target_type: 'blog' | 'tool_description' | 'category_page' | 'landing_page';
  apiKey: string;
}

// 响应接口
interface ContentGenerationResponse {
  title: string;
  content: string;
  target_url: string;
  keywords: string[];
}

export async function POST(request: NextRequest) {
  try {
    // 验证API密钥
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '未提供授权头' }, { status: 401 });
    }
    
    const apiKey = authHeader.replace('Bearer ', '');
    const isValidKey = await validateApiKey(apiKey);
    if (!isValidKey) {
      return NextResponse.json({ error: 'API密钥无效' }, { status: 401 });
    }
    
    // 解析请求体
    const requestData: ContentGenerationRequest = await request.json();
    
    // 验证请求数据
    if (!requestData.template_id || !requestData.template_content || !requestData.keywords || !requestData.target_type) {
      return NextResponse.json({ error: '请求数据不完整' }, { status: 400 });
    }
    
    // 检查OpenRouter API密钥是否已配置
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: '未配置OpenRouter API密钥，请在.env.local文件中添加OPENROUTER_API_KEY' }, { status: 500 });
    }
    
    // 调用OpenAI API生成内容
    const generatedContent = await generateContentWithAI(requestData);
    
    // 返回生成的内容
    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error('内容生成错误:', error);
    return NextResponse.json({ error: '内容生成失败' }, { status: 500 });
  }
}

/**
 * 使用AI生成内容
 */
async function generateContentWithAI(requestData: ContentGenerationRequest): Promise<ContentGenerationResponse> {
  try {
    // 构建提示词
    const prompt = `
      你是一个专业的内容创作者。请根据以下信息创建高质量的内容：
      
      内容类型: ${requestData.target_type === 'blog' ? '博客文章' : 
                requestData.target_type === 'tool_description' ? '工具描述' : 
                requestData.target_type === 'category_page' ? '分类页面' : '着陆页'}
      
      关键词: ${requestData.keywords.join(', ')}
      
      内容模板:
      ${requestData.template_content}
      
      请创建一个包含以下内容的JSON响应：
      1. 标题：吸引人且包含主要关键词
      2. 内容：根据提供的模板格式化的完整内容
      3. 目标URL：基于内容类型的建议URL路径（不包含域名）
      
      确保内容：
      - 对搜索引擎友好
      - 包含适当的标题层级（H1, H2, H3等）
      - 自然地融入所有关键词
      - 内容丰富且有价值
      - 语言流畅且专业
    `;
    
    // 调用OpenRouter API
    const systemPrompt = '你是一个专业的内容创作者，擅长创建SEO友好的高质量内容。';
    const aiResponse = await generateWithOpenRouter(prompt, systemPrompt, 'openai/gpt-4', 0.7, 2000);
    
    // 解析AI响应
    let parsedResponse: ContentGenerationResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (err) {
      console.error('解析AI响应失败:', err);
      console.log('原始响应:', aiResponse);
      
      // 尝试从文本中提取信息
      const titleMatch = aiResponse.match(/标题[：:] *(.+)/i);
      const contentMatch = aiResponse.match(/内容[：:] *([\s\S]+?)(?=目标URL[：:]|$)/i);
      const urlMatch = aiResponse.match(/目标URL[：:] *(.+)/i);
      
      parsedResponse = {
        title: titleMatch ? titleMatch[1].trim() : `基于${requestData.template_name}的新内容`,
        content: contentMatch ? contentMatch[1].trim() : aiResponse,
        target_url: urlMatch ? urlMatch[1].trim() : generateDefaultUrl(requestData),
        keywords: requestData.keywords
      };
    }
    
    // 确保所有必要字段都存在
    if (!parsedResponse.title) {
      parsedResponse.title = `基于${requestData.template_name}的新内容`;
    }
    
    if (!parsedResponse.target_url) {
      parsedResponse.target_url = generateDefaultUrl(requestData);
    }
    
    if (!parsedResponse.keywords || !Array.isArray(parsedResponse.keywords)) {
      parsedResponse.keywords = requestData.keywords;
    }
    
    return parsedResponse;
  } catch (error) {
    console.error('生成内容失败:', error);
    throw error;
  }
}

/**
 * 生成默认URL
 */
function generateDefaultUrl(requestData: ContentGenerationRequest): string {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 1000);
  
  switch (requestData.target_type) {
    case 'blog':
      return `/blog/post-${timestamp}-${randomId}`;
    case 'tool_description':
      return `/tools/tool-${timestamp}-${randomId}`;
    case 'category_page':
      return `/categories/category-${timestamp}-${randomId}`;
    default:
      return `/page-${timestamp}-${randomId}`;
  }
}