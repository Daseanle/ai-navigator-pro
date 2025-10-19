import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const actionData = await request.json();

    // 记录用户行为到数据库
    const { error } = await supabase
      .from('user_analytics')
      .insert({
        action: actionData.action,
        data: actionData.data,
        user_id: actionData.userId,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to track user action:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json({ error: 'Failed to track action' }, { status: 500 });
  }
}