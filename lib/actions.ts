// lib/actions.ts
'use server'; // [关键] 声明这是一个服务器端模块，里面的函数都可以在客户端调用

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// 定义 Server Action 的返回类型
interface ActionResult {
  success: boolean;
  message: string;
}

/**
 * 提交新评论的 Server Action
 * @param toolId - 评论所属工具的ID
 * @param formData - 表单数据，包含评论内容
 */
export async function submitComment(
  toolId: number,
  formData: FormData
): Promise<ActionResult> {
  const supabase = createServerActionClient({ cookies });

  // 1. 检查用户是否登录
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { success: false, message: '请先登录后再评论' };
  }

  // 2. 获取评论内容
  const content = formData.get('comment') as string;
  if (!content || content.trim().length === 0) {
    return { success: false, message: '评论内容不能为空' };
  }

  // 3. 将评论插入数据库
  const { error } = await supabase
    .from('comments')
    .insert({
      content: content.trim(),
      tool_id: toolId,
      user_id: session.user.id,
    });

  if (error) {
    console.error('Error inserting comment:', error);
    return { success: false, message: `数据库错误: ${error.message}` };
  }

  // 4. [重要] 清除缓存，让页面重新获取数据以显示新评论
  // 这里的 '/tool/[slug]' 需要根据实际情况调整，但通常这样写可以动态匹配
  // 为了保险起见，我们直接清除整个站点的缓存，简单有效
  revalidatePath('/', 'layout');

  return { success: true, message: '评论成功！' };
}

/**
 * 收藏/取消收藏工具的 Server Action
 * @param toolId - 工具的ID
 * @param isBookmarked - 当前是否已收藏（用于切换状态）
 */
export async function toggleBookmark(
  toolId: number,
  isBookmarked: boolean
): Promise<ActionResult> {
  const supabase = createServerActionClient({ cookies });

  // 1. 检查用户是否登录
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { success: false, message: '请先登录后再操作' };
  }

  const userId = session.user.id;

  if (isBookmarked) {
    // 取消收藏
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .match({ user_id: userId, tool_id: toolId });

    if (error) {
      console.error('Error removing bookmark:', error);
      return { success: false, message: `数据库错误: ${error.message}` };
    }
  } else {
    // 添加收藏
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        tool_id: toolId,
      });

    if (error) {
      console.error('Error adding bookmark:', error);
      return { success: false, message: `数据库错误: ${error.message}` };
    }
  }

  // 清除缓存
  revalidatePath('/', 'layout');

  return { 
    success: true, 
    message: isBookmarked ? '已取消收藏' : '已添加到收藏' 
  };
}

/**
 * 点赞/取消点赞工具的 Server Action
 * @param toolId - 工具的ID
 * @param isUpvoted - 当前是否已点赞（用于切换状态）
 */
export async function toggleUpvote(
  toolId: number,
  isUpvoted: boolean
): Promise<ActionResult> {
  const supabase = createServerActionClient({ cookies });

  // 1. 检查用户是否登录
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { success: false, message: '请先登录后再操作' };
  }

  const userId = session.user.id;

  if (isUpvoted) {
    // 取消点赞
    const { error: removeError } = await supabase
      .from('upvotes')
      .delete()
      .match({ user_id: userId, tool_id: toolId });

    if (removeError) {
      console.error('Error removing upvote:', removeError);
      return { success: false, message: `数据库错误: ${removeError.message}` };
    }

    // 更新工具的点赞计数
    const { error: updateError } = await supabase.rpc('decrement_upvotes', { tool_id: toolId });
    if (updateError) {
      console.error('Error updating upvote count:', updateError);
    }
  } else {
    // 添加点赞
    const { error: addError } = await supabase
      .from('upvotes')
      .insert({
        user_id: userId,
        tool_id: toolId,
      });

    if (addError) {
      console.error('Error adding upvote:', addError);
      return { success: false, message: `数据库错误: ${addError.message}` };
    }

    // 更新工具的点赞计数
    const { error: updateError } = await supabase.rpc('increment_upvotes', { tool_id: toolId });
    if (updateError) {
      console.error('Error updating upvote count:', updateError);
    }
  }

  // 清除缓存
  revalidatePath('/', 'layout');

  return { 
    success: true, 
    message: isUpvoted ? '已取消点赞' : '已点赞' 
  };
}