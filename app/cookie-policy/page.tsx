'use client';

import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Cookie 政策</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-neutral-300 mb-6">
          最后更新日期：2023年12月1日
        </p>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">什么是 Cookie？</h2>
          <p className="text-neutral-300 mb-4">
            Cookie 是网站在您的设备上存储的小型文本文件。它们被广泛用于使网站正常运行，并提供有关网站所有者的信息。
          </p>
          <p className="text-neutral-300">
            Cookie 可以是"持久性"或"会话性"的。持久性 Cookie 在您关闭浏览器后仍保留在您的计算机上，直到您删除它们或它们过期。会话性 Cookie 在您关闭浏览器时被删除。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">我们如何使用 Cookie</h2>
          <p className="text-neutral-300 mb-4">
            当您访问我们的网站时，我们可能会在您的设备上放置一些 Cookie。这些 Cookie 用于以下目的：
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">必要的 Cookie</h3>
          <p className="text-neutral-300 mb-4">
            这些 Cookie 对于网站的正常运行是必不可少的，包括允许您登录到安全区域、使用购物车和处理电子支付。您不能通过我们的系统拒绝这些 Cookie。
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">分析 Cookie</h3>
          <p className="text-neutral-300 mb-4">
            这些 Cookie 允许我们计算访问量和流量来源，以便我们可以测量和改进我们网站的性能。它们帮助我们了解哪些页面最受欢迎和最不受欢迎，并了解访问者如何在网站上移动。
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">功能性 Cookie</h3>
          <p className="text-neutral-300 mb-4">
            这些 Cookie 使网站能够提供增强的功能和个性化。它们可能由我们或我们放置在网站上的第三方服务提供商设置。
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">定向 Cookie</h3>
          <p className="text-neutral-300 mb-4">
            这些 Cookie 可能由我们的广告合作伙伴通过我们的网站设置。它们可能被这些公司用来建立您的兴趣档案，并在其他网站上向您展示相关广告。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">我们使用的具体 Cookie</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-neutral-800 mt-4">
              <thead>
                <tr className="bg-neutral-900">
                  <th className="border border-neutral-800 p-3 text-left">Cookie 名称</th>
                  <th className="border border-neutral-800 p-3 text-left">提供者</th>
                  <th className="border border-neutral-800 p-3 text-left">目的</th>
                  <th className="border border-neutral-800 p-3 text-left">过期时间</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-neutral-800 p-3">_session</td>
                  <td className="border border-neutral-800 p-3">ainavigatorpro.com</td>
                  <td className="border border-neutral-800 p-3">维护用户会话状态</td>
                  <td className="border border-neutral-800 p-3">会话结束</td>
                </tr>
                <tr>
                  <td className="border border-neutral-800 p-3">_auth</td>
                  <td className="border border-neutral-800 p-3">ainavigatorpro.com</td>
                  <td className="border border-neutral-800 p-3">存储认证信息</td>
                  <td className="border border-neutral-800 p-3">30天</td>
                </tr>
                <tr>
                  <td className="border border-neutral-800 p-3">_ga</td>
                  <td className="border border-neutral-800 p-3">Google Analytics</td>
                  <td className="border border-neutral-800 p-3">区分用户</td>
                  <td className="border border-neutral-800 p-3">2年</td>
                </tr>
                <tr>
                  <td className="border border-neutral-800 p-3">_gid</td>
                  <td className="border border-neutral-800 p-3">Google Analytics</td>
                  <td className="border border-neutral-800 p-3">区分用户</td>
                  <td className="border border-neutral-800 p-3">24小时</td>
                </tr>
                <tr>
                  <td className="border border-neutral-800 p-3">_fbp</td>
                  <td className="border border-neutral-800 p-3">Facebook</td>
                  <td className="border border-neutral-800 p-3">广告投放</td>
                  <td className="border border-neutral-800 p-3">3个月</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">如何管理 Cookie</h2>
          <p className="text-neutral-300 mb-4">
            大多数网络浏览器允许您通过浏览器设置控制 Cookie。您可以设置浏览器拒绝这些 Cookie，或在设置 Cookie 时通知您。如果您禁用或拒绝 Cookie，请注意，本网站的某些部分可能无法访问或无法正常工作。
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">如何在不同浏览器中管理 Cookie</h3>
          <ul className="list-disc pl-6 text-neutral-300 space-y-2">
            <li>
              <strong>Chrome</strong>: 访问"设置" &gt; "隐私和安全" &gt; "Cookie 和其他网站数据"
            </li>
            <li>
              <strong>Firefox</strong>: 访问"选项" &gt; "隐私与安全" &gt; "Cookie 和网站数据"
            </li>
            <li>
              <strong>Safari</strong>: 访问"偏好设置" &gt; "隐私" &gt; "Cookie 和网站数据"
            </li>
            <li>
              <strong>Edge</strong>: 访问"设置" &gt; "Cookie 和网站权限" &gt; "Cookie 和网站数据"
            </li>
          </ul>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">第三方 Cookie</h2>
          <p className="text-neutral-300 mb-4">
            除了我们设置的 Cookie 外，我们还允许第三方在我们的网站上设置 Cookie。这些第三方包括：
          </p>
          <ul className="list-disc pl-6 text-neutral-300 space-y-2">
            <li>分析服务提供商（如 Google Analytics），帮助我们了解访问者如何使用我们的网站</li>
            <li>社交媒体平台（如 Facebook、Twitter），使您能够分享我们网站上的内容</li>
            <li>广告合作伙伴，帮助我们投放相关广告</li>
          </ul>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Cookie 政策的变更</h2>
          <p className="text-neutral-300 mb-4">
            我们可能会不时更新我们的 Cookie 政策。我们将通过在此页面上发布新版本来通知您任何变更。我们建议您定期查看此页面以了解任何变更。
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">联系我们</h2>
          <p className="text-neutral-300 mb-4">
            如果您对我们的 Cookie 政策有任何疑问，请通过以下方式联系我们：
          </p>
          <p className="text-neutral-300">
            电子邮件：<a href="mailto:privacy@ainavigatorpro.com" className="text-blue-400 hover:underline">privacy@ainavigatorpro.com</a>
          </p>
        </section>
      </div>
      
      <div className="mt-12 flex justify-between items-center border-t border-neutral-800 pt-6">
        <Link href="/privacy-policy" className="text-blue-400 hover:underline">
          隐私政策
        </Link>
        <Link href="/terms-of-service" className="text-blue-400 hover:underline">
          服务条款
        </Link>
      </div>
    </div>
  );
}

// SEO 元数据已移至 metadata.ts 文件