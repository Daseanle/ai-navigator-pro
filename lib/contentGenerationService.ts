import { createClient } from '@supabase/supabase-js';

// 环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const apiKey = process.env.API_KEY || '';

// 内容类型
export type ContentType = 'blog' | 'tutorial' | 'news';

// 内容模板接口
export interface ContentTemplate {
  id: string;
  name: string;
  target_type: 'blog' | 'tool_description' | 'category_page' | 'landing_page';
  keywords: string[];
  template: string;
  frequency_days: number;
  last_generated?: string;
  status: 'active' | 'paused';
}

// 生成内容接口
export interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  target_url: string;
  template_id: string;
  created_at: string;
  status: 'draft' | 'published' | 'rejected';
  keywords: string[];
  performance: {
    impressions: number;
    clicks: number;
    position: number;
  };
}

// 内容生成结果接口
export interface ContentGenerationResult {
  added: number;
  skipped: number;
  errors: number;
}

/**
 * 获取内容模板
 */
export async function getContentTemplates(): Promise<ContentTemplate[]> {
  try {
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 获取所有内容模板
    const { data, error } = await supabase
      .from('content_templates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('获取内容模板错误:', error);
      return [];
    }
    
    return data as ContentTemplate[];
  } catch (err) {
    console.error('获取内容模板异常:', err);
    return [];
  }
}

/**
 * 获取已生成的内容
 */
export async function getGeneratedContent(): Promise<GeneratedContent[]> {
  try {
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 获取所有生成的内容
    const { data, error } = await supabase
      .from('generated_content')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('获取生成内容错误:', error);
      return [];
    }
    
    return data as GeneratedContent[];
  } catch (err) {
    console.error('获取生成内容异常:', err);
    return [];
  }
}

/**
 * 生成内容
 * @param templateId 模板ID，如果不提供则使用所有活跃模板
 * @param contentTypes 内容类型过滤
 * @param limit 每种类型生成的最大数量
 */
export async function generateContent(
  templateId?: string,
  contentTypes?: ContentType[],
  limit: number = 5
): Promise<ContentGenerationResult> {
  try {
    console.log('🤖 开始生成内容...');
    
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 获取OpenRouter API密钥
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openrouterApiKey) {
      console.error('未配置OpenRouter API密钥，无法生成内容');
      throw new Error('未配置OpenRouter API密钥');
    }
    
    // 获取内容模板
    let templatesQuery = supabase
      .from('content_templates')
      .select('*')
      .eq('status', 'active');
    
    // 如果指定了模板ID，则只获取该模板
    if (templateId) {
      templatesQuery = templatesQuery.eq('id', templateId);
    }
    
    // 如果指定了内容类型，则过滤模板
    if (contentTypes && contentTypes.length > 0) {
      const targetTypes = contentTypes.map(type => {
        if (type === 'blog') return 'blog';
        if (type === 'tutorial') return 'tool_description';
        return 'news';
      });
      templatesQuery = templatesQuery.in('target_type', targetTypes);
    }
    
    const { data: templates, error: templatesError } = await templatesQuery;
    
    if (templatesError) {
      console.error('获取内容模板错误:', templatesError);
      return { added: 0, skipped: 0, errors: 1 };
    }
    
    if (!templates || templates.length === 0) {
      console.log('没有找到活跃的内容模板');
      return { added: 0, skipped: 0, errors: 0 };
    }
    
    // 初始化结果计数
    let added = 0;
    let skipped = 0;
    let errors = 0;
    
    // 处理每个模板
    for (const template of templates) {
      try {
        // 检查是否需要生成内容（根据上次生成时间和频率）
        if (template.last_generated) {
          const lastGenerated = new Date(template.last_generated);
          const nextGeneration = new Date(lastGenerated);
          nextGeneration.setDate(nextGeneration.getDate() + template.frequency_days);
          
          if (new Date() < nextGeneration) {
            console.log(`模板 ${template.name} 尚未到生成时间，跳过`);
            skipped++;
            continue;
          }
        }
        
        // 调用内容生成API
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/content/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            template_id: template.id,
            template_name: template.name,
            template_content: template.template,
            keywords: template.keywords,
            target_type: template.target_type,
            apiKey: openrouterApiKey
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error(`生成内容失败 (${template.name}):`, errorData);
          errors++;
          continue;
        }
        
        const generatedContent = await response.json();
        
        // 保存生成的内容到数据库
        const { error: insertError } = await supabase
          .from('generated_content')
          .insert({
            title: generatedContent.title,
            content: generatedContent.content,
            target_url: generatedContent.target_url,
            template_id: template.id,
            created_at: new Date().toISOString(),
            status: 'draft',
            keywords: template.keywords,
            performance: {
              impressions: 0,
              clicks: 0,
              position: 0
            }
          });
        
        if (insertError) {
          console.error(`保存生成内容失败 (${template.name}):`, insertError);
          errors++;
          continue;
        }
        
        // 更新模板的最后生成时间
        const { error: updateError } = await supabase
          .from('content_templates')
          .update({ last_generated: new Date().toISOString() })
          .eq('id', template.id);
        
        if (updateError) {
          console.error(`更新模板最后生成时间失败 (${template.name}):`, updateError);
        }
        
        added++;
        console.log(`成功生成内容: ${generatedContent.title}`);
      } catch (err) {
        console.error(`处理模板时出错 (${template.name}):`, err);
        errors++;
      }
      
      // 如果达到限制，则停止生成
      if (added >= limit) {
        console.log(`已达到生成限制 (${limit})，停止生成`);
        break;
      }
    }
    
    console.log(`内容生成完成: 新增 ${added}, 跳过 ${skipped}, 错误 ${errors}`);
    return { added, skipped, errors };
  } catch (err) {
    console.error('内容生成服务异常:', err);
    return { added: 0, skipped: 0, errors: 1 };
  }
}

/**
 * 调度内容生成
 */
export async function scheduleContentGeneration() {
  try {
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 获取内容生成设置
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'content_generation')
      .single();
    
    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error('获取内容生成设置错误:', settingsError);
      // 设置默认的下次检查时间（1小时后）
      setTimeout(scheduleContentGeneration, 60 * 60 * 1000);
      return;
    }
    
    // 解析设置
    const settingsValue = settings?.value ? JSON.parse(settings.value) : {};
    const enabled = settingsValue.enabled === true;
    const frequencyHours = parseInt(settingsValue.frequency_hours || '24', 10);
    const contentTypes = settingsValue.content_types || ['blog', 'tutorial', 'news'];
    const limitPerRun = parseInt(settingsValue.limit_per_run || '5', 10);
    
    // 如果未启用，设置下次检查时间（1小时后）
    if (!enabled) {
      console.log('内容生成服务未启用，1小时后重新检查');
      setTimeout(scheduleContentGeneration, 60 * 60 * 1000);
      return;
    }
    
    // 计算下次运行时间
    const lastRun = settingsValue.last_run ? new Date(settingsValue.last_run) : null;
    const now = new Date();
    let nextRun: Date;
    
    if (lastRun) {
      nextRun = new Date(lastRun);
      nextRun.setHours(nextRun.getHours() + frequencyHours);
    } else {
      nextRun = now;
    }
    
    // 如果到了下次运行时间，则执行内容生成
    if (now >= nextRun) {
      console.log('开始执行内容生成...');
      
      // 执行内容生成
      const result = await generateContent(undefined, contentTypes as ContentType[], limitPerRun);
      
      // 更新最后运行时间
      await supabase
        .from('settings')
        .update({
          value: JSON.stringify({
            ...settingsValue,
            last_run: now.toISOString()
          })
        })
        .eq('key', 'content_generation');
      
      console.log(`内容生成完成: 新增 ${result.added}, 跳过 ${result.skipped}, 错误 ${result.errors}`);
      
      // 设置下次运行时间
      const delay = frequencyHours * 60 * 60 * 1000;
      console.log(`下次内容生成将在 ${new Date(now.getTime() + delay).toLocaleString()} 执行`);
      setTimeout(scheduleContentGeneration, delay);
    } else {
      // 计算到下次运行的延迟时间
      const delay = nextRun.getTime() - now.getTime();
      console.log(`下次内容生成将在 ${nextRun.toLocaleString()} 执行`);
      setTimeout(scheduleContentGeneration, delay);
    }
  } catch (err) {
    console.error('调度内容生成异常:', err);
    // 出错时，设置1小时后重试
    setTimeout(scheduleContentGeneration, 60 * 60 * 1000);
  }
}

/**
 * 初始化内容生成服务
 */
export function initContentGenerationService() {
  // 仅在生产环境和服务器端运行
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('🔄 初始化内容生成服务...');
    
    // 启动内容生成调度服务
    scheduleContentGeneration();
    
    console.log('✅ 内容生成服务已启动');
  } else {
    console.log('⏸️ 非生产环境或客户端，内容生成服务未启动');
  }
}