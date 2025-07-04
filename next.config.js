const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  // 移除 experimental.appDir 配置
  images: {
    domains: ['supabase.co', 'your-cdn-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // 性能优化
  compress: true,
  poweredByHeader: false,
  // 国际化配置
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
  },
  // 安全头部
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
});