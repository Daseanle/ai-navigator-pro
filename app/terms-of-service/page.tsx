'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">服务条款</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-neutral-300 mb-6">
          最后更新日期：2023年12月1日
        </p>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">1. 接受条款</h2>
          <p className="text-neutral-300 mb-4">
            欢迎使用 AI Navigator Pro（以下简称"我们"、"我们的"或"本网站"）。本服务条款（"条款"）适用于您访问和使用我们的网站、服务和应用程序（统称为"服务"）。
          </p>
          <p className="text-neutral-300 mb-4">
            通过访问或使用我们的服务，您同意受这些条款的约束。如果您不同意这些条款的任何部分，则您不得访问或使用我们的服务。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">2. 服务描述</h2>
          <p className="text-neutral-300 mb-4">
            AI Navigator Pro 是一个 AI 工具导航和评测平台，旨在帮助用户发现、比较和选择适合其需求的 AI 工具和服务。我们提供工具列表、评测、教程和相关内容，以帮助用户做出明智的决策。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">3. 账户注册与安全</h2>
          <p className="text-neutral-300 mb-4">
            某些功能可能需要您创建账户。您同意提供准确、完整和最新的信息，并对保持账户信息的准确性和完整性负责。
          </p>
          <p className="text-neutral-300 mb-4">
            您负责维护您账户的保密性，并对您账户下发生的所有活动负全部责任。您同意立即通知我们任何未经授权使用您账户的情况。
          </p>
          <p className="text-neutral-300 mb-4">
            我们保留在我们自行决定认为适当的情况下拒绝服务、终止账户、删除或编辑内容或取消订单的权利。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">4. 用户行为与内容</h2>
          <p className="text-neutral-300 mb-4">
            您同意不会使用我们的服务进行任何非法或未经授权的目的，并且您将遵守所有适用的法律和法规。
          </p>
          <p className="text-neutral-300 mb-4">
            您可能有机会发布评论、反馈和其他内容（"用户内容"）。您保留您的用户内容的所有权利，但您授予我们非独占、免版税、可转让、可再许可、全球性的许可，以使用、复制、修改、创建衍生作品、分发、公开展示和以其他方式利用您的用户内容。
          </p>
          <p className="text-neutral-300 mb-4">
            您同意您的用户内容不会：
          </p>
          <ul className="list-disc pl-6 text-neutral-300 space-y-2">
            <li>侵犯任何第三方的权利，包括知识产权</li>
            <li>违反任何法律、法规或道德标准</li>
            <li>包含虚假、欺诈或误导性信息</li>
            <li>包含任何病毒、恶意软件或有害代码</li>
            <li>包含垃圾邮件、连锁信或金字塔计划</li>
            <li>干扰或破坏服务或服务器的正常运行</li>
          </ul>
          <p className="text-neutral-300 mt-4">
            我们保留删除任何违反这些条款的用户内容的权利。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">5. 知识产权</h2>
          <p className="text-neutral-300 mb-4">
            服务及其原始内容、功能和设计是 AI Navigator Pro 及其许可方的专有财产，受版权、商标和其他知识产权法律的保护。
          </p>
          <p className="text-neutral-300 mb-4">
            我们的商标和商业外观不得用于与我们的产品或服务无关的任何产品或服务，尤其是不得以可能导致客户混淆或以任何方式诋毁或贬低我们的方式使用。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">6. 第三方链接与内容</h2>
          <p className="text-neutral-300 mb-4">
            我们的服务可能包含指向第三方网站或服务的链接，这些网站或服务不由我们拥有或控制。
          </p>
          <p className="text-neutral-300 mb-4">
            我们对任何第三方网站或服务的内容、隐私政策或做法不承担任何责任。您进一步确认并同意，我们对您因使用任何第三方网站或服务而可能遭受的任何损失或损害不承担任何责任或义务。
          </p>
          <p className="text-neutral-300 mb-4">
            我们强烈建议您阅读您访问的任何第三方网站的条款和隐私政策。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">7. 免责声明</h2>
          <p className="text-neutral-300 mb-4">
            我们的服务按"原样"和"可用"的基础提供，不提供任何明示或暗示的保证。
          </p>
          <p className="text-neutral-300 mb-4">
            AI Navigator Pro 不保证服务将不间断、及时、安全或无错误，也不保证服务中的任何错误将被纠正。
          </p>
          <p className="text-neutral-300 mb-4">
            我们不保证通过使用服务获得的结果将准确或可靠，或者服务的质量将满足您的期望。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">8. 责任限制</h2>
          <p className="text-neutral-300 mb-4">
            在法律允许的最大范围内，AI Navigator Pro 及其董事、员工、合作伙伴、代理人、供应商或附属机构在任何情况下均不对任何间接的、附带的、特殊的、后果性的或惩罚性的损害负责，包括但不限于利润损失、数据损失、使用损失、商誉损失或其他无形损失。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">9. 赔偿</h2>
          <p className="text-neutral-300 mb-4">
            您同意赔偿、辩护并使 AI Navigator Pro 及其子公司、附属机构、合作伙伴、高管、董事、代理人、承包商、许可人、服务提供商、分包商、供应商、实习生和员工免受任何第三方因您违反这些条款或您使用服务而提出的索赔或要求（包括合理的律师费）。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">10. 可分割性</h2>
          <p className="text-neutral-300 mb-4">
            如果这些条款的任何条款被认为是非法、无效或因任何原因不可执行，则该条款应被视为可与这些条款分离，并且不影响任何其余条款的有效性和可执行性。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">11. 条款变更</h2>
          <p className="text-neutral-300 mb-4">
            我们保留自行决定随时修改或替换这些条款的权利。如果修订是重大的，我们将尽力在新条款生效前至少提前 30 天通知。什么构成重大变更将由我们自行决定。
          </p>
          <p className="text-neutral-300 mb-4">
            通过在任何变更生效后继续访问或使用我们的服务，您同意受修订条款的约束。如果您不同意新条款，您不再被授权使用服务。
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">12. 适用法律</h2>
          <p className="text-neutral-300 mb-4">
            这些条款应受中华人民共和国法律管辖并按其解释，不考虑其冲突法规定。
          </p>
          <p className="text-neutral-300 mb-4">
            我们未能执行这些条款的任何权利或规定不应被视为放弃这些权利。这些条款构成您与 AI Navigator Pro 之间关于我们服务的完整协议。
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">13. 联系我们</h2>
          <p className="text-neutral-300 mb-4">
            如果您对这些条款有任何疑问，请通过以下方式联系我们：
          </p>
          <p className="text-neutral-300">
            电子邮件：<a href="mailto:legal@ainavigatorpro.com" className="text-blue-400 hover:underline">legal@ainavigatorpro.com</a>
          </p>
        </section>
      </div>
      
      <div className="mt-12 flex justify-between items-center border-t border-neutral-800 pt-6">
        <Link href="/privacy-policy" className="text-blue-400 hover:underline">
          隐私政策
        </Link>
        <Link href="/cookie-policy" className="text-blue-400 hover:underline">
          Cookie 政策
        </Link>
      </div>
    </div>
  );
}

// --- SEO 元数据已移至 metadata.ts 文件 ---