'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">隐私政策</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-neutral-300 mb-6">
          最后更新日期：2023年12月1日
        </p>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">引言</h2>
          <p className="text-neutral-300 mb-4">
            AI Navigator Pro（以下简称"我们"、"我们的"或"本网站"）尊重您的隐私，并致力于保护您的个人数据。本隐私政策将告知您我们如何处理您的个人数据，包括当您访问我们的网站时我们收集的数据，以及您的隐私权和法律保护。
          </p>
          <p className="text-neutral-300">
            请仔细阅读本隐私政策，以了解我们为何以及如何使用您的个人数据。如果您不同意本政策中的任何条款，请不要使用我们的网站和服务。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">我们收集的数据</h2>
          <p className="text-neutral-300 mb-4">
            我们可能会收集、使用、存储和传输不同类型的个人数据，这些数据已按以下类别分组：
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">身份数据</h3>
          <p className="text-neutral-300 mb-4">
            包括姓名、用户名或类似标识符、出生日期等。
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">联系数据</h3>
          <p className="text-neutral-300 mb-4">
            包括电子邮件地址、电话号码、通讯地址等。
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">技术数据</h3>
          <p className="text-neutral-300 mb-4">
            包括互联网协议(IP)地址、您的登录数据、浏览器类型和版本、时区设置和位置、浏览器插件类型和版本、操作系统和平台，以及您用于访问本网站的设备上的其他技术。
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">使用数据</h3>
          <p className="text-neutral-300 mb-4">
            包括有关您如何使用我们的网站、产品和服务的信息。
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">营销和通信数据</h3>
          <p className="text-neutral-300 mb-4">
            包括您接收我们和第三方营销信息的偏好，以及您的通信偏好。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">我们如何收集您的数据</h2>
          <p className="text-neutral-300 mb-4">
            我们使用不同的方法收集您的数据，包括：
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">直接互动</h3>
          <p className="text-neutral-300 mb-4">
            当您填写表格、通过电子邮件或其他方式与我们通信时，您可能会向我们提供您的身份、联系和财务数据。这包括当您：
          </p>
          <ul className="list-disc pl-6 text-neutral-300 space-y-2">
            <li>创建账户</li>
            <li>订阅我们的服务或出版物</li>
            <li>请求向您发送营销信息</li>
            <li>参与竞赛、促销或调查</li>
            <li>给我们反馈</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">自动技术或交互</h3>
          <p className="text-neutral-300 mb-4">
            当您与我们的网站互动时，我们可能会自动收集有关您的设备、浏览操作和模式的技术数据。我们使用 Cookie、服务器日志和其他类似技术收集这些数据。
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">第三方或公开可用的来源</h3>
          <p className="text-neutral-300 mb-4">
            我们可能会从各种第三方和公开来源接收有关您的个人数据，例如：
          </p>
          <ul className="list-disc pl-6 text-neutral-300 space-y-2">
            <li>分析提供商，如 Google</li>
            <li>广告网络</li>
            <li>搜索信息提供商</li>
          </ul>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">我们如何使用您的数据</h2>
          <p className="text-neutral-300 mb-4">
            我们仅在法律允许的情况下使用您的个人数据。最常见的是，我们将在以下情况下使用您的个人数据：
          </p>
          <ul className="list-disc pl-6 text-neutral-300 space-y-2">
            <li>当我们需要履行与您签订的合同时</li>
            <li>当它符合我们的合法利益（或第三方的合法利益）时，并且您的利益和基本权利不会凌驾于这些利益之上</li>
            <li>当我们需要遵守法律或监管义务时</li>
            <li>当您同意我们处理您的个人数据时</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">我们使用您的个人数据的目的</h3>
          <p className="text-neutral-300 mb-4">
            我们已在下面列出了我们使用您的个人数据的所有方式，包括我们依赖的法律依据以及我们可能有的合法利益：
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-neutral-800 mt-4">
              <thead>
                <tr className="bg-neutral-900">
                  <th className="border border-neutral-800 p-3 text-left">目的</th>
                  <th className="border border-neutral-800 p-3 text-left">数据类型</th>
                  <th className="border border-neutral-800 p-3 text-left">法律依据</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-neutral-800 p-3">注册您成为新客户</td>
                  <td className="border border-neutral-800 p-3">身份、联系</td>
                  <td className="border border-neutral-800 p-3">履行与您的合同</td>
                </tr>
                <tr>
                  <td className="border border-neutral-800 p-3">处理和交付您的订单</td>
                  <td className="border border-neutral-800 p-3">身份、联系、财务、交易、营销和通信</td>
                  <td className="border border-neutral-800 p-3">履行与您的合同、我们的合法利益</td>
                </tr>
                <tr>
                  <td className="border border-neutral-800 p-3">管理我们与您的关系</td>
                  <td className="border border-neutral-800 p-3">身份、联系、个人资料、营销和通信</td>
                  <td className="border border-neutral-800 p-3">履行与您的合同、遵守法律义务、我们的合法利益</td>
                </tr>
                <tr>
                  <td className="border border-neutral-800 p-3">使您能够参与抽奖、竞赛或完成调查</td>
                  <td className="border border-neutral-800 p-3">身份、联系、个人资料、使用、营销和通信</td>
                  <td className="border border-neutral-800 p-3">履行与您的合同、我们的合法利益</td>
                </tr>
                <tr>
                  <td className="border border-neutral-800 p-3">管理和保护我们的业务和网站</td>
                  <td className="border border-neutral-800 p-3">身份、联系、技术</td>
                  <td className="border border-neutral-800 p-3">我们的合法利益、遵守法律义务</td>
                </tr>
                <tr>
                  <td className="border border-neutral-800 p-3">向您提供相关内容和广告</td>
                  <td className="border border-neutral-800 p-3">身份、联系、个人资料、使用、营销和通信、技术</td>
                  <td className="border border-neutral-800 p-3">我们的合法利益、您的同意</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">数据安全</h2>
          <p className="text-neutral-300 mb-4">
            我们已经实施了适当的安全措施，以防止您的个人数据被意外丢失、使用或访问、更改或披露。此外，我们限制只有那些出于业务需要而需要了解的员工、代理商、承包商和其他第三方才能访问您的个人数据。他们只会根据我们的指示处理您的个人数据，并且他们有保密义务。
          </p>
          <p className="text-neutral-300">
            我们已经制定了处理任何可疑的个人数据泄露的程序，并将在法律要求的情况下通知您和任何适用的监管机构。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">数据保留</h2>
          <p className="text-neutral-300 mb-4">
            我们只会在满足收集目的所需的时间内保留您的个人数据，包括出于满足任何法律、会计或报告要求的目的。
          </p>
          <p className="text-neutral-300">
            为确定个人数据的适当保留期限，我们考虑了个人数据的数量、性质和敏感性，未经授权使用或披露您的个人数据的潜在风险，我们处理您的个人数据的目的以及我们是否可以通过其他方式实现这些目的，以及适用的法律要求。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">您的法律权利</h2>
          <p className="text-neutral-300 mb-4">
            根据数据保护法，您有权：
          </p>
          <ul className="list-disc pl-6 text-neutral-300 space-y-2">
            <li><strong>请求访问</strong>您的个人数据</li>
            <li><strong>请求更正</strong>我们持有的关于您的个人数据</li>
            <li><strong>请求删除</strong>您的个人数据</li>
            <li><strong>反对处理</strong>您的个人数据</li>
            <li><strong>请求限制处理</strong>您的个人数据</li>
            <li><strong>请求转移</strong>您的个人数据</li>
            <li><strong>撤回同意</strong>在我们依赖同意处理您的数据的情况下</li>
          </ul>
          <p className="text-neutral-300 mt-4">
            如果您希望行使上述任何权利，请联系我们。您无需为访问您的个人数据（或行使任何其他权利）支付费用。但是，如果您的请求明显没有根据、重复或过度，我们可能会收取合理的费用。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">第三方链接</h2>
          <p className="text-neutral-300 mb-4">
            本网站可能包含指向第三方网站、插件和应用程序的链接。点击这些链接或启用这些连接可能允许第三方收集或共享有关您的数据。我们不控制这些第三方网站，也不对其隐私声明负责。当您离开我们的网站时，我们鼓励您阅读您访问的每个网站的隐私政策。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Cookie</h2>
          <p className="text-neutral-300 mb-4">
            您可以将您的浏览器设置为拒绝所有或某些浏览器 Cookie，或在网站设置 Cookie 时提醒您。如果您禁用或拒绝 Cookie，请注意，本网站的某些部分可能无法访问或无法正常工作。有关我们使用的 Cookie 的更多信息，请参阅我们的 <Link href="/cookie-policy" className="text-blue-400 hover:underline">Cookie 政策</Link>。
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">隐私政策的变更</h2>
          <p className="text-neutral-300 mb-4">
            我们保留随时更新或更改我们的隐私政策的权利。任何更改都将在本页面上发布。您应该定期查看本页面以了解任何变更。
          </p>
          <p className="text-neutral-300 mb-4">
            如果我们对本隐私政策进行重大更改，我们将通过电子邮件或在我们的网站上发布通知来通知您。
          </p>
        </section>
      </div>
      
      <div className="mt-12 flex justify-between items-center border-t border-neutral-800 pt-6">
        <Link href="/cookie-policy" className="text-blue-400 hover:underline">
          Cookie 政策
        </Link>
        <Link href="/terms-of-service" className="text-blue-400 hover:underline">
          服务条款
        </Link>
      </div>
    </div>
  );
}

// 客户端组件不能导出metadata，需要使用layout.tsx文件定义元数据