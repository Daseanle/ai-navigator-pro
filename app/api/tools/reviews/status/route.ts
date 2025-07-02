import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const apiKey = process.env.API_KEY || '';

export async function GET(request: NextRequest) {
  // 验证API密钥
  const authHeader = request.headers.get('authorization');
  const providedApiKey = authHeader ? authHeader.split(' ')[1] : null;
  
  // 如果在生产环境中且API密钥不匹配，则拒绝访问
  if (process.env.NODE_ENV === 'production' && providedApiKey !== apiKey) {
    return NextResponse.json(
      { error: '无效的API密钥' },
      { status: 401 }
    );
  }

  try {
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 获取最新的评测历史记录
    const { data: latestReview, error: latestReviewError } = await supabase
      .from('tool_review_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (latestReviewError) {
      console.error('获取最新评测记录错误:', latestReviewError);
      return NextResponse.json(
        { error: '获取评测状态失败' },
        { status: 500 }
      );
    }
    
    // 获取评测设置
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'review_automation')
      .single();
    
    if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 是 "未找到记录" 错误
      console.error('获取评测设置错误:', settingsError);
      return NextResponse.json(
        { error: '获取评测设置失败' },
        { status: 500 }
      );
    }
    
    // 解析设置
    const reviewSettings = settings?.value ? JSON.parse(settings.value) : {
      enabled: false,
      frequency: 'daily', // daily, weekly, monthly
      lastRun: null,
      nextRun: null,
      categoriesPerRun: 1,
      toolsPerCategory: 5
    };
    
    // 计算下次运行时间（如果未设置）
    if (reviewSettings.enabled && !reviewSettings.nextRun && latestReview?.[0]) {
      const lastRunDate = new Date(latestReview[0].created_at);
      let nextRunDate;
      
      switch (reviewSettings.frequency) {
        case 'daily':
          nextRunDate = new Date(lastRunDate);
          nextRunDate.setDate(lastRunDate.getDate() + 1);
          break;
        case 'weekly':
          nextRunDate = new Date(lastRunDate);
          nextRunDate.setDate(lastRunDate.getDate() + 7);
          break;
        case 'monthly':
          nextRunDate = new Date(lastRunDate);
          nextRunDate.setMonth(lastRunDate.getMonth() + 1);
          break;
        default:
          nextRunDate = new Date(lastRunDate);
          nextRunDate.setDate(lastRunDate.getDate() + 1);
      }
      
      reviewSettings.lastRun = lastRunDate.toISOString();
      reviewSettings.nextRun = nextRunDate.toISOString();
    }
    
    // 获取待评测工具数量
    const { count: pendingToolsCount, error: pendingToolsError } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true })
      .is('review_id', null);
    
    if (pendingToolsError) {
      console.error('获取待评测工具数量错误:', pendingToolsError);
      // 继续执行，不返回错误
    }
    
    // 返回状态信息
    return NextResponse.json({
      latestReview: latestReview?.[0] || null,
      settings: reviewSettings,
      pendingTools: pendingToolsCount || 0,
      isAutomated: reviewSettings.enabled
    });
  } catch (error) {
    console.error('评测状态API错误:', error);
    return NextResponse.json(
      { error: '获取评测状态时发生错误' },
      { status: 500 }
    );
  }
}

// 更新评测设置
export async function POST(request: NextRequest) {
  // 验证API密钥
  const authHeader = request.headers.get('authorization');
  const providedApiKey = authHeader ? authHeader.split(' ')[1] : null;
  
  // 如果在生产环境中且API密钥不匹配，则拒绝访问
  if (process.env.NODE_ENV === 'production' && providedApiKey !== apiKey) {
    return NextResponse.json(
      { error: '无效的API密钥' },
      { status: 401 }
    );
  }

  try {
    // 获取请求体
    const body = await request.json();
    
    // 验证请求体
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: '无效的请求体' },
        { status: 400 }
      );
    }
    
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 获取当前设置
    const { data: existingSettings, error: getError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'review_automation')
      .single();
    
    // 合并设置
    const currentSettings = existingSettings?.value ? JSON.parse(existingSettings.value) : {
      enabled: false,
      frequency: 'daily',
      lastRun: null,
      nextRun: null,
      categoriesPerRun: 1,
      toolsPerCategory: 5
    };
    
    const newSettings = {
      ...currentSettings,
      ...body,
    };
    
    // 如果启用状态改变，重新计算下次运行时间
    if (body.enabled !== undefined && body.enabled !== currentSettings.enabled && body.enabled) {
      const now = new Date();
      let nextRunDate;
      
      switch (newSettings.frequency) {
        case 'daily':
          nextRunDate = new Date(now);
          nextRunDate.setDate(now.getDate() + 1);
          break;
        case 'weekly':
          nextRunDate = new Date(now);
          nextRunDate.setDate(now.getDate() + 7);
          break;
        case 'monthly':
          nextRunDate = new Date(now);
          nextRunDate.setMonth(now.getMonth() + 1);
          break;
        default:
          nextRunDate = new Date(now);
          nextRunDate.setDate(now.getDate() + 1);
      }
      
      newSettings.nextRun = nextRunDate.toISOString();
    }
    
    // 更新或插入设置
    let updateResult;
    if (existingSettings) {
      updateResult = await supabase
        .from('settings')
        .update({ value: JSON.stringify(newSettings) })
        .eq('key', 'review_automation');
    } else {
      updateResult = await supabase
        .from('settings')
        .insert({ key: 'review_automation', value: JSON.stringify(newSettings) });
    }
    
    if (updateResult.error) {
      console.error('更新评测设置错误:', updateResult.error);
      return NextResponse.json(
        { error: '更新评测设置失败' },
        { status: 500 }
      );
    }
    
    // 返回更新后的设置
    return NextResponse.json({
      settings: newSettings,
      message: '评测设置已更新'
    });
  } catch (error) {
    console.error('更新评测设置API错误:', error);
    return NextResponse.json(
      { error: '更新评测设置时发生错误' },
      { status: 500 }
    );
  }
}