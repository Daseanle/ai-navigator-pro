import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // 使用 Supabase 全文搜索
    let searchQuery = supabase
      .from('tools')
      .select(`
        *,
        tool_tags(
          tags(name)
        )
      `)
      .textSearch('fts', query, {
        type: 'websearch',
        config: 'english'
      })
      .range(offset, offset + limit - 1);

    if (category && category !== 'all') {
      searchQuery = searchQuery.eq('category', category);
    }

    const { data: tools, error } = await searchQuery;

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }

    // 获取搜索结果总数
    const { count } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true })
      .textSearch('fts', query, {
        type: 'websearch',
        config: 'english'
      });

    return NextResponse.json({
      tools: tools || [],
      total: count || 0,
      hasMore: (offset + limit) < (count || 0)
    });
  } catch (error) {
    console.error('Full-text search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}