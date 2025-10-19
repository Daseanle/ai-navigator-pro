'use client';

import { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // 定价数据
  const plans = [
    {
      name: '免费',
      description: '适合初次了解AI工具的用户',
      price: {
        monthly: 0,
        yearly: 0,
      },
      features: [
        { name: '浏览所有AI工具', included: true },
        { name: '阅读基础工具评测', included: true },
        { name: '查看基础使用教程', included: true },
        { name: '参与社区讨论', included: true },
        { name: '无广告体验', included: false },
        { name: '高级工具对比', included: false },
        { name: '专家一对一咨询', included: false },
        { name: '优先获取最新AI工具信息', included: false },
      ],
      cta: '开始使用',
      ctaLink: '/login',
      popular: false,
    },
    {
      name: '专业版',
      description: '适合个人专业用户和小型团队',
      price: {
        monthly: 49,
        yearly: 39,
      },
      features: [
        { name: '浏览所有AI工具', included: true },
        { name: '阅读详细工具评测', included: true },
        { name: '查看高级使用教程', included: true },
        { name: '参与社区讨论', included: true },
        { name: '无广告体验', included: true },
        { name: '高级工具对比', included: true },
        { name: '专家一对一咨询', included: false },
        { name: '优先获取最新AI工具信息', included: false },
      ],
      cta: '选择专业版',
      ctaLink: '/login?plan=pro',
      popular: true,
    },
    {
      name: '企业版',
      description: '适合企业和团队使用',
      price: {
        monthly: 199,
        yearly: 159,
      },
      features: [
        { name: '浏览所有AI工具', included: true },
        { name: '阅读详细工具评测', included: true },
        { name: '查看高级使用教程', included: true },
        { name: '参与社区讨论', included: true },
        { name: '无广告体验', included: true },
        { name: '高级工具对比', included: true },
        { name: '专家一对一咨询', included: true },
        { name: '优先获取最新AI工具信息', included: true },
      ],
      cta: '选择企业版',
      ctaLink: '/login?plan=enterprise',
      popular: false,
    },
  ];

  // 特性说明
  const featureExplanations: Record<string, string> = {
    '浏览所有AI工具': '访问我们平台上的所有AI工具信息，包括详细介绍、功能列表和用户评价。',
    '阅读基础工具评测': '查看基础版工具评测，包含主要功能和基本使用体验评价。',
    '阅读详细工具评测': '查看详细的工具评测，包含深度分析、性能测试和专家意见。',
    '查看基础使用教程': '访问基础的工具使用教程，帮助您快速上手。',
    '查看高级使用教程': '访问高级使用教程，包含进阶技巧、最佳实践和案例分析。',
    '参与社区讨论': '加入我们的用户社区，与其他用户交流经验和想法。',
    '无广告体验': '享受无广告的浏览体验，提高使用效率。',
    '高级工具对比': '使用我们的高级对比功能，同时比较多个工具的功能、性能和价格。',
    '专家一对一咨询': '获得AI领域专家的一对一咨询服务，解决您的特定问题。',
    '优先获取最新AI工具信息': '第一时间获取最新AI工具信息和独家内容。',
  };

  // 常见问题
  const faqs = [
    {
      question: '如何选择适合我的会员计划？',
      answer: '如果您只是想了解AI工具的基本信息，免费计划就足够了。如果您需要更深入的工具评测和教程，专业版是不错的选择。对于企业用户或需要专业咨询的用户，企业版提供了最全面的服务。'
    },
    {
      question: '会员可以随时取消吗？',
      answer: '是的，您可以随时取消会员订阅。如果您在订阅期内取消，您仍然可以使用会员服务直到当前订阅期结束。我们不提供部分退款。'
    },
    {
      question: '年付计划有什么优势？',
      answer: '选择年付计划可以享受约20%的折扣，相当于每年免费获得2个月的服务。此外，年付用户还可以获得一些专属福利，如优先参与我们的线上活动和工作坊。'
    },
    {
      question: '可以升级或降级我的会员计划吗？',
      answer: '是的，您可以随时升级会员计划，升级后的费用将按剩余时间比例计算。如果您想降级计划，新的计划将在当前订阅期结束后生效。'
    },
    {
      question: '支持哪些支付方式？',
      answer: '我们支持多种支付方式，包括信用卡、支付宝、微信支付和PayPal等。所有支付信息都经过加密处理，确保您的支付安全。'
    },
    {
      question: '有团队或教育折扣吗？',
      answer: '是的，我们为团队和教育机构提供特别折扣。如果您需要5个以上的账户，或者您是教育机构，请联系我们的销售团队获取定制报价。'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-2 text-center">会员计划</h1>
      <p className="text-xl text-neutral-400 mb-12 text-center">选择最适合您需求的计划，开启AI工具探索之旅</p>
      
      {/* 计费周期切换 */}
      <div className="flex justify-center mb-12">
        <div className="bg-neutral-900 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-md font-medium ${billingPeriod === 'monthly' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            月付
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2 rounded-md font-medium ${billingPeriod === 'yearly' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            年付
            <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">省20%</span>
          </button>
        </div>
      </div>
      
      {/* 定价卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`relative bg-neutral-900 border ${plan.popular ? 'border-blue-500' : 'border-neutral-800'} rounded-xl overflow-hidden transition-transform hover:scale-105`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                最受欢迎
              </div>
            )}
            
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
              <p className="text-neutral-400 mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">¥{plan.price[billingPeriod]}</span>
                <span className="text-neutral-400 ml-2">
                  {plan.price[billingPeriod] > 0 ? `/ ${billingPeriod === 'monthly' ? '月' : '月，年付'}` : ''}
                </span>
              </div>
              
              <Link 
                href={plan.ctaLink}
                className={`block w-full py-3 px-4 rounded-lg font-semibold text-center ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white'} transition-colors mb-8`}
              >
                {plan.cta}
              </Link>
              
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <span className="block h-5 w-5 rounded-full border border-neutral-700"></span>
                      )}
                    </div>
                    <div className="ml-3 flex items-center">
                      <span className={feature.included ? 'text-neutral-300' : 'text-neutral-500'}>
                        {feature.name}
                      </span>
                      <button
                        className="ml-1.5 text-neutral-500 hover:text-neutral-300"
                        onMouseEnter={() => setShowTooltip(feature.name)}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <HelpCircle className="h-4 w-4" />
                        {showTooltip === feature.name && (
                          <div className="absolute z-10 w-64 p-4 mt-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg text-sm text-neutral-300 text-left">
                            {featureExplanations[feature.name]}
                          </div>
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      {/* 企业定制 */}
      <div className="mt-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">需要定制解决方案？</h2>
        <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
          如果您的企业有特殊需求，我们可以提供定制化的解决方案。包括API集成、白标服务、专属培训等。
        </p>
        <Link 
          href="/contact"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          联系销售团队
        </Link>
      </div>
      
      {/* 常见问题 */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">常见问题</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
              <p className="text-neutral-400">{faq.answer}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link 
            href="/faq"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            查看更多常见问题
          </Link>
        </div>
      </div>
      
      {/* 满意保证 */}
      <div className="mt-16 text-center">
        <div className="inline-block bg-green-900/20 p-3 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">7天无理由退款保证</h2>
        <p className="text-neutral-300 max-w-2xl mx-auto">
          我们对我们的服务充满信心。如果您在使用7天内对会员服务不满意，可以申请全额退款，无需任何理由。
        </p>
      </div>
    </div>
  );
}