import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const apiKey = process.env.API_KEY || '';

// 分页默认值
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

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
    
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || DEFAULT_PAGE.toString(), 10);
    const pageSize = parseInt(searchParams.get('pageSize') || DEFAULT_PAGE_SIZE.toString(), 10);
    
    // 计算偏移量
    const offset = (page - 1) * pageSize;
    
    // 查询总记录数
    const { count, error: countError } = await supabase
      .from('tool_review_history')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('获取评测历史记录数量错误:', countError);
      return NextResponse.json(
        { error: '获取评测历史记录数量失败' },
        { status: 500 }
      );
    }
    
    // 查询分页数据
    const { data, error } = await supabase
      .from('tool_review_history')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);
    
    if (error) {
      console.error('获取评测历史记录错误:', error);
      return NextResponse.json(
        { error: '获取评测历史记录失败' },
        { status: 500 }
      );
    }
    
    // 计算总页数
    const totalPages = Math.ceil((count || 0) / pageSize);
    
    // 返回数据和分页信息
    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        total: count,
        totalPages
      }
    });
  } catch (error) {
    console.error('评测历史记录API错误:', error);
    return NextResponse.json(
      { error: '获取评测历史记录时发生错误' },
      { status: 500 }
    );
  }
}