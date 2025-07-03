import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 简单的内存存储（生产环境建议使用Redis）
const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
  // 只对API路由应用速率限制
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15分钟
    const maxRequests = 100;

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      const userData = rateLimitMap.get(ip);
      if (now > userData.resetTime) {
        userData.count = 1;
        userData.resetTime = now + windowMs;
      } else {
        userData.count++;
        if (userData.count > maxRequests) {
          return new NextResponse('Too Many Requests', { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil((userData.resetTime - now) / 1000).toString()
            }
          });
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*'
};