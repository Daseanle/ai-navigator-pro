import { createClient } from '@supabase/supabase-js';

// 环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const apiKey = process.env.API_KEY || '';

// SEO优化结果接口
export interface SeoOptimizationResult {
  added: number;
  skipped: number;
  errors: number;
}

// SEO优化项接口
export interface SeoOptimization {
  id: string;
  content_id: string;
  content_type: 'page' | 'blog' | 'tool' | 'category';
  content_url: string;
  title: string;
  meta_description: string;
  keywords: string[];
  h1: string;
  created_at: string;
  status: 'pending' | 'applied' | 'rejected';
  performance_before?: {
    position: number;
    impressions: number;
    clicks: number;
  };
  performance_after?: {
    position: number;
    impressions: number;
    clicks: number;
  };
}

/**
 * 获取SEO优化项列表
 */
export async function getSeoOptimizations(): Promise<SeoOptimization[]> {
  try {
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 获取所有SEO优化项
    const { data, error } = await supabase
      .from('seo_optimizations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('获取SEO优化项错误:', error);
      return [];
    }
    
    return data as SeoOptimization[];
  } catch (err) {
    console.error('获取SEO优化项异常:', err);
    return [];
  }
}

/**
 * 执行SEO优化
 * @param contentType 内容类型过滤
 * @param limit 每次运行处理的最大数量
 */
export async function runSeoOptimization(
  contentType?: 'page' | 'blog' | 'tool' | 'category',
  limit: number = 5
): Promise<SeoOptimizationResult> {
  try {
    console.log('🤖 开始执行SEO优化...');
    
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 获取OpenAI API密钥
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('未配置OpenAI API密钥，无法执行SEO优化');
      throw new Error('未配置OpenAI API密钥');
    }
    
    // 获取OpenRouter API密钥
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openrouterApiKey) {
      console.error('未配置OpenRouter API密钥，无法执行SEO优化');
      throw new Error('未配置OpenRouter API密钥');
    }
    
    // 获取需要优化的内容
    let query = supabase
      .from('generated_content')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    // 如果指定了内容类型，则过滤内容
    if (contentType) {
      let targetType: string;
      if (contentType === 'blog') targetType = 'blog';
      else if (contentType === 'tool') targetType = 'tool_description';
      else if (contentType === 'category') targetType = 'category_page';
      else targetType = 'landing_page';
      
      query = query.eq('target_type', targetType);
    }
    
    const { data: contents, error: contentsError } = await query;
    
    if (contentsError) {
      console.error('获取内容错误:', contentsError);
      return { added: 0, skipped: 0, errors: 1 };
    }
    
    if (!contents || contents.length === 0) {
      console.log('没有找到需要优化的内容');
      return { added: 0, skipped: 0, errors: 0 };
    }
    
    // 初始化结果计数
    let added = 0;
    let skipped = 0;
    let errors = 0;
    
    // 处理每个内容
    for (const content of contents) {
      try {
        // 检查是否已经有针对该内容的SEO优化
        const { data: existingOptimizations, error: checkError } = await supabase
          .from('seo_optimizations')
          .select('id')
          .eq('content_id', content.id)
          .limit(1);
        
        if (checkError) {
          console.error(`检查内容 ${content.id} 的SEO优化状态错误:`, checkError);
          errors++;
          continue;
        }
        
        // 如果已经有优化，则跳过
        if (existingOptimizations && existingOptimizations.length > 0) {
          console.log(`内容 ${content.id} 已有SEO优化，跳过`);
          skipped++;
          continue;
        }
        
        // 调用SEO优化API
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/seo/optimize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            content_id: content.id,
            content_title: content.title,
            content_body: content.content,
            content_url: content.target_url,
            keywords: content.keywords,
            apiKey: openrouterApiKey
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error(`SEO优化失败 (${content.id}):`, errorData);
          errors++;
          continue;
        }
        
        const optimizationResult = await response.json();
        
        // 确定内容类型
        let contentType: 'page' | 'blog' | 'tool' | 'category' = 'page';
        if (content.target_type === 'blog') contentType = 'blog';
        else if (content.target_type === 'tool_description') contentType = 'tool';
        else if (content.target_type === 'category_page') contentType = 'category';
        
        // 保存SEO优化结果到数据库
        const { error: insertError } = await supabase
          .from('seo_optimizations')
          .insert({
            content_id: content.id,
            content_type: contentType,
            content_url: content.target_url,
            title: optimizationResult.title,
            meta_description: optimizationResult.meta_description,
            keywords: optimizationResult.keywords,
            h1: optimizationResult.h1,
            created_at: new Date().toISOString(),
            status: 'pending',
            performance_before: {
              position: content.performance?.position || 0,
              impressions: content.performance?.impressions || 0,
              clicks: content.performance?.clicks || 0
            }
          });
        
        if (insertError) {
          console.error(`保存SEO优化结果失败 (${content.id}):`, insertError);
          errors++;
          continue;
        }
        
        added++;
        console.log(`成功生成SEO优化: ${content.title}`);
      } catch (err) {
        console.error(`处理内容SEO优化时出错 (${content.id}):`, err);
        errors++;
      }
    }
    
    console.log(`SEO优化完成: 新增 ${added}, 跳过 ${skipped}, 错误 ${errors}`);
    return { added, skipped, errors };
  } catch (err) {
    console.error('SEO优化服务异常:', err);
    return { added: 0, skipped: 0, errors: 1 };
  }
}

/**
 * 应用SEO优化
 * @param optimizationId SEO优化项ID
 */
export async function applySeoOptimization(optimizationId: string): Promise<boolean> {
  try {
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 获取SEO优化项
    const { data: optimization, error: getError } = await supabase
      .from('seo_optimizations')
      .select('*')
      .eq('id', optimizationId)
      .single();
    
    if (getError) {
      console.error(`获取SEO优化项 ${optimizationId} 错误:`, getError);
      return false;
    }
    
    if (!optimization) {
      console.error(`未找到SEO优化项 ${optimizationId}`);
      return false;
    }
    
    // 根据内容类型应用SEO优化
    let updateResult;
    
    if (optimization.content_type === 'blog') {
      // 更新博客文章的SEO信息
      updateResult = await supabase
        .from('blog_posts')
        .update({
          title: optimization.title,
          meta_description: optimization.meta_description,
          keywords: optimization.keywords,
          seo_optimized: true
        })
        .eq('id', optimization.content_id);
    } else if (optimization.content_type === 'tool') {
      // 更新工具描述的SEO信息
      updateResult = await supabase
        .from('tools')
        .update({
          seo_title: optimization.title,
          seo_description: optimization.meta_description,
          seo_keywords: optimization.keywords,
          seo_optimized: true
        })
        .eq('id', optimization.content_id);
    } else if (optimization.content_type === 'category') {
      // 更新分类页面的SEO信息
      updateResult = await supabase
        .from('categories')
        .update({
          seo_title: optimization.title,
          seo_description: optimization.meta_description,
          seo_keywords: optimization.keywords,
          seo_optimized: true
        })
        .eq('id', optimization.content_id);
    } else {
      // 更新其他页面的SEO信息
      updateResult = await supabase
        .from('pages')
        .update({
          seo_title: optimization.title,
          seo_description: optimization.meta_description,
          seo_keywords: optimization.keywords,
          seo_optimized: true
        })
        .eq('id', optimization.content_id);
    }
    
    if (updateResult.error) {
      console.error(`应用SEO优化失败 (${optimizationId}):`, updateResult.error);
      return false;
    }
    
    // 更新SEO优化项状态为已应用
    const { error: updateStatusError } = await supabase
      .from('seo_optimizations')
      .update({
        status: 'applied'
      })
      .eq('id', optimizationId);
    
    if (updateStatusError) {
      console.error(`更新SEO优化项状态失败 (${optimizationId}):`, updateStatusError);
      return false;
    }
    
    console.log(`成功应用SEO优化 ${optimizationId}`);
    return true;
  } catch (err) {
    console.error(`应用SEO优化异常 (${optimizationId}):`, err);
    return false;
  }
}

/**
 * 调度SEO优化
 */
export async function scheduleSeoOptimization() {
  try {
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 获取SEO优化设置
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'seo_optimization')
      .single();
    
    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error('获取SEO优化设置错误:', settingsError);
      // 设置默认的下次检查时间（1小时后）
      setTimeout(scheduleSeoOptimization, 60 * 60 * 1000);
      return;
    }
    
    // 解析设置
    const settingsValue = settings?.value ? JSON.parse(settings.value) : {};
    const enabled = settingsValue.enabled === true;
    const frequencyHours = parseInt(settingsValue.frequency_hours || '24', 10);
    const limitPerRun = parseInt(settingsValue.limit_per_run || '5', 10);
    
    // 如果未启用，设置下次检查时间（1小时后）
    if (!enabled) {
      console.log('SEO优化服务未启用，1小时后重新检查');
      setTimeout(scheduleSeoOptimization, 60 * 60 * 1000);
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
    
    // 如果到了下次运行时间，则执行SEO优化
    if (now >= nextRun) {
      console.log('开始执行SEO优化...');
      
      // 执行SEO优化
      const result = await runSeoOptimization(undefined, limitPerRun);
      
      // 更新最后运行时间
      await supabase
        .from('settings')
        .update({
          value: JSON.stringify({
            ...settingsValue,
            last_run: now.toISOString()
          })
        })
        .eq('key', 'seo_optimization');
      
      console.log(`SEO优化完成: 新增 ${result.added}, 跳过 ${result.skipped}, 错误 ${result.errors}`);
      
      // 设置下次运行时间
      const delay = frequencyHours * 60 * 60 * 1000;
      console.log(`下次SEO优化将在 ${new Date(now.getTime() + delay).toLocaleString()} 执行`);
      setTimeout(scheduleSeoOptimization, delay);
    } else {
      // 计算到下次运行的延迟时间
      const delay = nextRun.getTime() - now.getTime();
      console.log(`下次SEO优化将在 ${nextRun.toLocaleString()} 执行`);
      setTimeout(scheduleSeoOptimization, delay);
    }
  } catch (err) {
    console.error('调度SEO优化异常:', err);
    // 出错时，设置1小时后重试
    setTimeout(scheduleSeoOptimization, 60 * 60 * 1000);
  }
}

/**
 * 初始化SEO优化服务
 */
export function initSeoService() {
  // 仅在生产环境和服务器端运行
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('🔄 初始化SEO优化服务...');
    
    // 启动SEO优化调度服务
    scheduleSeoOptimization();
    
    console.log('✅ SEO优化服务已启动');
  } else {
    console.log('⏸️ 非生产环境或客户端，SEO优化服务未启动');
  }
}