import { NextRequest, NextResponse } from 'next/server';
import { syncExternalTools } from '@/lib/autoTools';
import { supabase } from '@/lib/supabaseClient';
import { addSyncHistory } from '@/lib/syncHistory';

// 设置API路由处理程序
export async function GET(request: NextRequest) {
  try {
    // 检查API密钥（简单的安全措施）
    const apiKey = request.nextUrl.searchParams.get('key');
    const validApiKey = process.env.TOOLS_SYNC_API_KEY || 'default-sync-key';
    
    if (apiKey !== validApiKey) {
      return NextResponse.json(
        { error: '无效的API密钥' },
        { status: 401 }
      );
    }
    
    // 检查数据库连接
    const { data: healthCheck, error: healthError } = await supabase.from('tools').select('count').limit(1);
    
    if (healthError) {
      console.error('数据库连接检查失败:', healthError);
      return NextResponse.json(
        { 
          error: '数据库连接失败', 
          details: healthError.message,
          code: healthError.code,
          hint: healthError.hint || '请检查数据库连接配置和表结构',
          timestamp: new Date().toISOString(),
          requestId: Math.random().toString(36).substring(2, 15)
        },
        { status: 500 }
      );
    }
    
    // 检查数据库表结构
    try {
      const { error: schemaError } = await supabase.from('tools').select('slug, name, tagline, logo_url, website_url, pricing').limit(0);
      
      if (schemaError) {
        console.error('数据库表结构检查失败:', schemaError);
        return NextResponse.json(
          { 
            error: '数据库表结构错误', 
            details: schemaError.message,
            code: schemaError.code,
            hint: '请确保数据库表结构与代码匹配',
            timestamp: new Date().toISOString(),
            requestId: Math.random().toString(36).substring(2, 15)
          },
          { status: 500 }
        );
      }
    } catch (schemaCheckError) {
      console.error('数据库表结构检查异常:', schemaCheckError);
    }
    
    // 执行工具同步
    const result = await syncExternalTools();
    
    // 记录同步历史
    await addSyncHistory(result, 'success');
    
    // 返回同步结果
    return NextResponse.json({
      success: true,
      message: `同步完成: 添加 ${result.added} 个, 跳过 ${result.skipped} 个, 错误 ${result.errors} 个`,
      result
    });
  } catch (error) {
    console.error('同步API错误:', error);
    
    // 提供更详细的错误信息
    let errorMessage = '同步过程中发生错误';
    let errorDetails = error instanceof Error ? error.message : String(error);
    let statusCode = 500;
    
    // 根据错误类型提供更具体的错误信息
    if (errorDetails.includes('violates row-level security policy')) {
      errorMessage = '数据库权限错误';
      errorDetails = '当前用户没有足够的权限执行此操作，请联系系统管理员';
      statusCode = 403;
    } else if (errorDetails.includes('connection')) {
      errorMessage = '数据库连接错误';
      statusCode = 503;
    }
    
    // 记录同步错误历史
    await addSyncHistory(
      { added: 0, skipped: 0, errors: 1 },
      'error',
      errorDetails
    );
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: errorDetails,
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substring(2, 15)
      },
      { status: statusCode }
    );
  }
}