'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

type FAQCategory = {
  id: string;
  name: string;
  faqs: {
    id: string;
    question: string;
    answer: string;
  }[];
};

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('general');

  // FAQ 数据
  const faqCategories: FAQCategory[] = [
    {
      id: 'general',
      name: '一般问题',
      faqs: [
        {
          id: 'what-is',
          question: 'AI Navigator Pro 是什么？',
          answer: 'AI Navigator Pro 是一个专注于AI工具导航与评测的平台，我们致力于为用户提供最全面、最专业的AI工具信息，帮助个人和企业在快速发展的AI领域中找到最适合自己需求的工具和解决方案。'
        },
        {
          id: 'how-to-use',
          question: '如何使用 AI Navigator Pro？',
          answer: '您可以通过搜索、浏览分类或查看我们的推荐来找到适合您需求的AI工具。每个工具页面都包含详细的介绍、评测、用户评价和使用教程，帮助您全面了解该工具的功能和适用场景。'
        },
        {
          id: 'is-free',
          question: 'AI Navigator Pro 是免费使用的吗？',
          answer: '是的，AI Navigator Pro 的基本功能是完全免费的，包括浏览工具、阅读评测和查看教程等。我们也提供高级会员服务，包含更多专业功能，如详细的工具对比分析、专家咨询和优先获取最新AI工具信息等。'
        }
      ]
    },
    {
      id: 'tools',
      name: 'AI工具相关',
      faqs: [
        {
          id: 'tool-criteria',
          question: '你们如何评测AI工具？',
          answer: '我们的评测团队由AI领域的专家组成，评测标准包括功能完整性、易用性、性能表现、价格合理性、客户支持等多个维度。每款工具都会经过实际使用和测试，确保评测结果客观公正。'
        },
        {
          id: 'submit-tool',
          question: '如何提交我的AI工具？',
          answer: '您可以通过我们的联系页面提交您的AI工具信息，或直接发送邮件至 submit@ainavigatorpro.com。请提供工具名称、官网链接、简介、主要功能和定价信息等。我们的团队会在收到提交后的3个工作日内进行审核。'
        },
        {
          id: 'tool-update',
          question: '如何更新我的工具信息？',
          answer: '如果您是工具开发者或所有者，您可以通过联系我们的方式申请更新工具信息。请提供您的身份验证信息和需要更新的内容，我们会在验证后进行更新。'
        }
      ]
    },
    {
      id: 'account',
      name: '账户与会员',
      faqs: [
        {
          id: 'create-account',
          question: '如何创建账户？',
          answer: '点击网站右上角的"登录/注册"按钮，选择"创建新账户"，填写您的电子邮箱和密码，然后按照提示完成注册流程即可。您也可以选择使用Google、Facebook或Twitter账号直接登录。'
        },
        {
          id: 'forgot-password',
          question: '忘记密码怎么办？',
          answer: '在登录页面点击"忘记密码"链接，输入您注册时使用的电子邮箱，我们会向您发送密码重置链接。点击邮件中的链接，设置新密码即可。'
        },
        {
          id: 'membership-benefits',
          question: '会员有哪些特权？',
          answer: 'AI Navigator Pro 会员可以享受多项特权，包括：无广告浏览体验、高级工具对比功能、专家一对一咨询服务、优先获取最新AI工具信息、参与专属线上活动和工作坊等。详细信息请查看我们的会员页面。'
        }
      ]
    },
    {
      id: 'business',
      name: '商务合作',
      faqs: [
        {
          id: 'advertising',
          question: '如何在 AI Navigator Pro 投放广告？',
          answer: '我们提供多种广告位和推广方式，包括首页轮播、工具列表推荐位、专题页面赞助等。如需了解详情和价格，请联系我们的广告团队：ads@ainavigatorpro.com。'
        },
        {
          id: 'partnership',
          question: '如何成为合作伙伴？',
          answer: '我们欢迎各类合作机会，包括内容合作、技术合作和商业合作等。请发送详细合作提案至 partnership@ainavigatorpro.com，我们的团队会尽快与您联系。'
        },
        {
          id: 'api-access',
          question: '是否提供API接口？',
          answer: '是的，我们提供API接口，允许开发者获取我们的AI工具数据库信息。API使用需要申请密钥，并遵守我们的使用条款。详细信息请查看我们的API文档页面。'
        }
      ]
    }
  ];

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 切换展开/折叠状态
  const toggleItem = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // 过滤FAQ
  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  // 当前分类的FAQ
  const currentCategoryFAQs = searchTerm
    ? filteredFAQs.find(cat => cat.id === activeCategory)?.faqs || []
    : faqCategories.find(cat => cat.id === activeCategory)?.faqs || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-2 text-center">常见问题</h1>
      <p className="text-xl text-neutral-400 mb-10 text-center">找到您关心的问题的答案</p>
      
      {/* 搜索框 */}
      <div className="relative max-w-2xl mx-auto mb-10">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neutral-500" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="搜索问题..."
          className="block w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* 分类导航 */}
        <div className="md:col-span-1">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sticky top-8">
            <h2 className="text-lg font-semibold text-white mb-4">问题分类</h2>
            <nav className="space-y-1">
              {faqCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeCategory === category.id ? 'bg-blue-600 text-white' : 'text-neutral-300 hover:bg-neutral-800'}`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* FAQ列表 */}
        <div className="md:col-span-3">
          {searchTerm && filteredFAQs.length === 0 ? (
            <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-xl">
              <p className="text-neutral-400">没有找到与 "{searchTerm}" 相关的问题</p>
            </div>
          ) : currentCategoryFAQs.length === 0 ? (
            <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-xl">
              <p className="text-neutral-400">该分类下暂无问题</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentCategoryFAQs.map(faq => (
                <div key={faq.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  >
                    <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                    {expandedItems.includes(faq.id) ? (
                      <ChevronUp className="h-5 w-5 text-neutral-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-neutral-400" />
                    )}
                  </button>
                  
                  {expandedItems.includes(faq.id) && (
                    <div className="px-6 pb-6 text-neutral-300 leading-relaxed">
                      <div className="border-t border-neutral-800 pt-4">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* 联系我们 */}
          <div className="mt-12 bg-blue-900/30 border border-blue-800 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-3">没有找到您的问题？</h3>
            <p className="text-neutral-300 mb-6">如果您有其他问题，请随时与我们联系，我们的团队将很乐意为您提供帮助。</p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              联系我们
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}