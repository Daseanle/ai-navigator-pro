// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()
  
  // 检查是否访问管理员页面
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
  
  if (isAdminPage) {
    // 如果没有会话，重定向到登录页面
    if (!session) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    // 检查用户角色是否为管理员
    const { data: { user } } = await supabase.auth.getUser()
    
    // 从用户元数据中获取角色信息
    // 注意：实际项目中，角色信息可能存储在用户元数据或单独的表中
    const userRole = user?.user_metadata?.role || 'user'
    
    // 如果不是管理员，重定向到未授权页面
    if (userRole !== 'admin') {
      const unauthorizedUrl = new URL('/unauthorized', req.url)
      return NextResponse.redirect(unauthorizedUrl)
    }
  }
  
  return res
}