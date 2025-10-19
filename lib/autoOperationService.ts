import { syncExternalTools } from './autoTools';
import { generateToolReviews } from './reviewService';
import { generateContent, ContentType } from './contentGenerationService';
import { runSeoOptimization } from './seoService';
import { createClient } from '@supabase/supabase-js';

// 环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 自动化操作结果接口
export interface AutoOperationResult {
  success: boolean;
  message: string;
  details: {
    toolSync?: {
      added: number;
      skipped: number;
      errors: number;
    };
    toolReviews?: {
      added: number;
      skipped: number;
      errors: number;
    };
    contentGeneration?: {
      success: number;
      failed: number;
    };
    seoOptimization?: {
      success: number;
      failed: number;
    };
  };
}

// 自动化操作设置接口
export interface AutoOperationSettings {
  toolSync: {
    enabled: boolean;
    intervalHours: number;
  };
  toolReviews: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    categoriesPerRun: number;
    toolsPerCategory: number;
  };
  contentGeneration: {
    enabled: boolean;
    types: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  seoOptimization: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
}

// 获取自动化操作设置
export async function getAutoOperationSettings(): Promise<AutoOperationSettings> {
  try {
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 获取设置
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'auto_operation')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('获取自动化操作设置错误:', error);
      return getDefaultSettings();
    }
    
    // 如果设置存在，解析并返回
    if (settings?.value) {
      return JSON.parse(settings.value);
    }
    
    // 否则返回默认设置
    return getDefaultSettings();
  } catch (error) {
    console.error('获取自动化操作设置异常:', error);
    return getDefaultSettings();
  }
}

// 保存自动化操作设置
export async function saveAutoOperationSettings(settings: AutoOperationSettings): Promise<boolean> {
  try {
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 保存设置
    const { error } = await supabase
      .from('settings')
      .upsert({
        key: 'auto_operation',
        value: JSON.stringify(settings)
      });
    
    if (error) {
      console.error('保存自动化操作设置错误:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('保存自动化操作设置异常:', error);
    return false;
  }
}

// 获取默认设置
function getDefaultSettings(): AutoOperationSettings {
  return {
    toolSync: {
      enabled: true,
      intervalHours: 24
    },
    toolReviews: {
      enabled: true,
      frequency: 'weekly',
      categoriesPerRun: 2,
      toolsPerCategory: 5
    },
    contentGeneration: {
      enabled: false,
      types: ['blog', 'tutorial'],
      frequency: 'weekly'
    },
    seoOptimization: {
      enabled: false,
      frequency: 'weekly'
    }
  };
}

// 执行一键式自动化操作
export async function runAutoOperation(): Promise<AutoOperationResult> {
  const result: AutoOperationResult = {
    success: true,
    message: '自动化操作完成',
    details: {}
  };
  
  try {
    // 获取设置
    const settings = await getAutoOperationSettings();
    
    // 1. 同步外部工具
    if (settings.toolSync.enabled) {
      try {
        console.log('开始同步外部工具...');
        const syncResult = await syncExternalTools();
        result.details.toolSync = syncResult;
        console.log('工具同步完成:', syncResult);
      } catch (error) {
        console.error('工具同步失败:', error);
        result.details.toolSync = { added: 0, skipped: 0, errors: 1 };
        result.success = false;
        result.message = '部分操作失败';
      }
    }
    
    // 2. 生成工具评测
    if (settings.toolReviews.enabled) {
      try {
        console.log('开始生成工具评测...');
        // 获取所有分类
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data: categories } = await supabase.from('categories').select('id');
        
        // 随机选择指定数量的分类
        let categoryIds: string[] = [];
        if (categories && categories.length > 0) {
          const shuffled = [...categories].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, settings.toolReviews.categoriesPerRun);
          categoryIds = selected.map(cat => cat.id);
        }
        
        const reviewResult = await generateToolReviews(
          categoryIds,
          settings.toolReviews.toolsPerCategory
        );
        
        result.details.toolReviews = reviewResult;
        console.log('工具评测生成完成:', reviewResult);
      } catch (error) {
        console.error('工具评测生成失败:', error);
        result.details.toolReviews = { added: 0, skipped: 0, errors: 1 };
        result.success = false;
        result.message = '部分操作失败';
      }
    }
    
    // 3. 内容生成
    if (settings.contentGeneration.enabled) {
      try {
        console.log('开始生成内容...');
        const contentTypes = settings.contentGeneration.types as ContentType[];
        const contentResult = await generateContent(undefined, contentTypes, 5);
        
        result.details.contentGeneration = { 
          success: contentResult.added, 
          failed: contentResult.errors 
        };
        console.log('内容生成完成:', contentResult);
      } catch (error) {
        console.error('内容生成失败:', error);
        result.details.contentGeneration = { success: 0, failed: 1 };
        result.success = false;
        result.message = '部分操作失败';
      }
    }
    
    // 4. SEO优化
    if (settings.seoOptimization.enabled) {
      try {
        console.log('开始SEO优化...');
        const seoResult = await runSeoOptimization(undefined, 5);
        
        result.details.seoOptimization = { 
          success: seoResult.added, 
          failed: seoResult.errors 
        };
        console.log('SEO优化完成:', seoResult);
      } catch (error) {
        console.error('SEO优化失败:', error);
        result.details.seoOptimization = { success: 0, failed: 1 };
        result.success = false;
        result.message = '部分操作失败';
      }
    }
    
    return result;
  } catch (error) {
    console.error('自动化操作执行失败:', error);
    return {
      success: false,
      message: '自动化操作执行失败: ' + (error instanceof Error ? error.message : String(error)),
      details: {}
    };
  }
}