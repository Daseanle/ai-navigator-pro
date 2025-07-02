import { calculateNextReviewTime, addReviewHistory } from './reviewHistory';
import { createClient } from '@supabase/supabase-js';

// 环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const apiKey = process.env.API_KEY || '';

interface ReviewResult {
  added: number;
  skipped: number;
  errors: number;
}

// 自动生成工具评测
export async function generateToolReviews(
  categoryFilter?: string[],
  limit: number = 5
): Promise<ReviewResult> {
  try {
    console.log('🤖 开始生成工具评测...');
    
    // 获取API密钥
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('未配置OpenAI API密钥，无法生成评测');
      throw new Error('未配置OpenAI API密钥');
    }
    
    // 调用批量生成评测API
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/tools/reviews/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        categoryFilter,
        limit,
        skipExisting: true
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '批量生成评测失败');
    }
    
    const result = await response.json();
    
    // 记录成功
    await addReviewHistory({
      added: result.results?.length || 0,
      skipped: result.skipped || 0,
      errors: result.errors?.length || 0
    });
    
    // 返回结果
    return {
      added: result.results?.length || 0,
      skipped: result.skipped || 0,
      errors: result.errors?.length || 0
    };
  } catch (error) {
    console.error('生成工具评测失败:', error);
    // 记录错误
    await addReviewHistory(
      { added: 0, skipped: 0, errors: 1 },
      'error',
      error instanceof Error ? error.message : String(error)
    );
    
    throw error;
  }
}

// 定时执行评测任务
export async function scheduleReviewGeneration() {
  try {
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 获取评测设置
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'review_automation')
      .single();
    
    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error('获取评测设置错误:', settingsError);
      // 设置默认的下次检查时间（1小时后）
      setTimeout(scheduleReviewGeneration, 60 * 60 * 1000);
      return;
    }
    
    // 解析设置
    const reviewSettings = settings?.value ? JSON.parse(settings.value) : {
      enabled: false,
      frequency: 'daily',
      lastRun: null,
      nextRun: null,
      categoriesPerRun: 1,
      toolsPerCategory: 5
    };
    
    // 如果自动化未启用，设置下次检查时间（1小时后）
    if (!reviewSettings.enabled) {
      console.log('⏸️ 工具评测自动化已禁用，1小时后重新检查');
      setTimeout(scheduleReviewGeneration, 60 * 60 * 1000);
      return;
    }
    
    // 计算下次运行时间
    const now = new Date();
    let nextRunTime;
    
    if (reviewSettings.nextRun) {
      nextRunTime = new Date(reviewSettings.nextRun);
    } else {
      // 如果未设置下次运行时间，则设置为明天的当前时间
      nextRunTime = calculateNextReviewTime(reviewSettings.frequency);
      
      // 更新设置
      const updatedSettings = {
        ...reviewSettings,
        nextRun: nextRunTime.toISOString()
      };
      
      await supabase
        .from('settings')
        .update({ value: JSON.stringify(updatedSettings) })
        .eq('key', 'review_automation');
    }
    
    // 计算等待时间（毫秒）
    const timeUntilNextRun = Math.max(0, nextRunTime.getTime() - now.getTime());
    
    console.log(`⏱️ 下次评测计划时间: ${nextRunTime.toISOString()}，等待 ${Math.round(timeUntilNextRun / (60 * 1000))} 分钟`);
    
    // 如果是生产环境，设置定时器
    if (process.env.NODE_ENV === 'production') {
      setTimeout(async () => {
        try {
          console.log('🔄 开始执行定时评测生成任务...');
          
          // 获取分类列表
          const { data: categories, error: categoriesError } = await supabase
            .from('categories')
            .select('id, name');
          
          if (categoriesError) {
            console.error('获取分类列表错误:', categoriesError);
            // 重新调度下一次任务
            scheduleReviewGeneration();
            return;
          }
          
          // 确定要处理的分类
          let categoriesToProcess = categories || [];
          
          // 如果设置了每次处理的分类数量，则随机选择指定数量的分类
          if (reviewSettings.categoriesPerRun > 0 && reviewSettings.categoriesPerRun < categoriesToProcess.length) {
            // 随机打乱分类数组
            categoriesToProcess = categoriesToProcess.sort(() => 0.5 - Math.random());
            // 选择指定数量的分类
            categoriesToProcess = categoriesToProcess.slice(0, reviewSettings.categoriesPerRun);
          }
          
          // 对每个分类生成评测
          for (const category of categoriesToProcess) {
            console.log(`🔍 处理分类: ${category.name}`);
            
            try {
              const result = await generateToolReviews(
                [category.id],
                reviewSettings.toolsPerCategory || 5
              );
              
              console.log(`✅ 分类 ${category.name} 评测生成完成:`, {
                成功: result.added,
                跳过: result.skipped,
                错误: result.errors
              });
            } catch (err) {
              console.error(`分类 ${category.name} 生成评测异常:`, err);
            }
            
            // 在分类之间添加延迟，避免API限制
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
          
          // 更新上次运行时间和下次运行时间
          const now = new Date();
          const nextRunTime = calculateNextReviewTime(reviewSettings.frequency);
          
          // 更新设置
          const updatedSettings = {
            ...reviewSettings,
            lastRun: now.toISOString(),
            nextRun: nextRunTime.toISOString()
          };
          
          await supabase
            .from('settings')
            .update({ value: JSON.stringify(updatedSettings) })
            .eq('key', 'review_automation');
          
          console.log('🏁 工具评测生成完成，下次计划时间:', nextRunTime.toISOString());
          
          // 重新调度下一次任务
          scheduleReviewGeneration();
        } catch (error) {
          console.error('定时评测生成任务失败:', error);
          // 重新调度下一次任务
          scheduleReviewGeneration();
        }
      }, timeUntilNextRun);
    } else {
      console.log('🔧 开发环境下不执行定时评测生成任务');
    }
  } catch (error) {
    console.error('调度评测生成错误:', error);
    // 发生错误时，1小时后重试
    setTimeout(scheduleReviewGeneration, 60 * 60 * 1000);
  }
}

// 初始化评测服务
export function initReviewService() {
  // 仅在生产环境和服务器端运行
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('🔄 初始化工具评测服务...');
    
    // 启动评测调度服务
    scheduleReviewGeneration();
    
    console.log('✅ 工具评测服务已启动');
  } else {
    console.log('⏸️ 非生产环境或客户端，评测服务未启动');
  }
}