/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除过时的 experimental.appDir 配置
  // 图片优化
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
};

module.exports = nextConfig;