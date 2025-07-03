import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const errorData = await request.json();

    // 记录错误到数据库
    const { error } = await supabase
      .from('error_logs')
      .insert({
        message: errorData.message,
        stack: errorData.stack,
        context: errorData.context,
        user_agent: errorData.userAgent,
        url: errorData.url,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to log error to database:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in error logging API:', error);
    return NextResponse.json({ error: 'Failed to log error' }, { status: 500 });
  }
}