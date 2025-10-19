'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function SolutionsPage() {
  const [activeIndustry, setActiveIndustry] = useState<string>('marketing');
  
  const industries = [
    { id: 'marketing', name: '市场营销' },
    { id: 'education', name: '教育' },
    { id: 'healthcare', name: '医疗健康' },
    { id: 'finance', name: '金融' },
    { id: 'legal', name: '法律' },
    { id: 'ecommerce', name: '电子商务' },
    { id: 'content', name: '内容创作' },
    { id: 'hr', name: '人力资源' },
  ];
  
  const solutions = {
    marketing: {
      title: 'AI 驱动的市场营销解决方案',
      description: '利用 AI 技术优化您的营销策略，提高转化率，并实现个性化营销。',
      benefits: [
        '自动化内容创作和社交媒体管理',
        '智能受众细分和个性化推荐',
        '预测分析和营销效果优化',
        '多渠道营销自动化',
        '实时市场趋势分析'
      ],
      tools: [
        { name: 'MarketMuse', description: '内容策略和 SEO 优化平台', logo: '/images/tools/marketmuse.png' },
        { name: 'Jasper', description: 'AI 驱动的营销文案和内容创作', logo: '/images/tools/jasper.png' },
        { name: 'Lately', description: '社交媒体内容创作和管理', logo: '/images/tools/lately.png' },
        { name: 'Persado', description: '情感语言优化平台', logo: '/images/tools/persado.png' },
      ],
      caseStudy: {
        title: '某电子商务品牌提高转化率 35%',
        content: '一家中型电子商务品牌使用 AI 营销工具优化其电子邮件营销活动和产品描述，在 3 个月内将转化率提高了 35%，同时将内容创作时间减少了 60%。'
      }
    },
    education: {
      title: 'AI 教育解决方案',
      description: '通过 AI 技术提供个性化学习体验，提高教学效率，并自动化管理任务。',
      benefits: [
        '个性化学习路径和内容推荐',
        '自动评分和反馈系统',
        '智能学习助手和辅导',
        '教育内容自动生成',
        '学生参与度和进度分析'
      ],
      tools: [
        { name: 'Duolingo', description: '个性化语言学习平台', logo: '/images/tools/duolingo.png' },
        { name: 'Gradescope', description: 'AI 辅助评分和反馈系统', logo: '/images/tools/gradescope.png' },
        { name: 'Quizlet', description: '智能学习工具和闪卡', logo: '/images/tools/quizlet.png' },
        { name: 'Century', description: '个性化学习平台', logo: '/images/tools/century.png' },
      ],
      caseStudy: {
        title: '某大学提高学生成绩和参与度',
        content: '一所大学在其在线课程中实施了 AI 学习助手和个性化学习路径，导致学生参与度提高 40%，平均成绩提高 15%，同时教师工作负担减轻。'
      }
    },
    healthcare: {
      title: 'AI 医疗健康解决方案',
      description: '利用 AI 技术提高诊断准确性，优化患者护理，并简化医疗流程。',
      benefits: [
        '医学影像分析和诊断辅助',
        '患者数据分析和预测',
        '医疗记录自动化和管理',
        '药物研发和发现',
        '远程患者监测和护理'
      ],
      tools: [
        { name: 'Viz.ai', description: '医学影像分析和诊断辅助', logo: '/images/tools/vizai.png' },
        { name: 'Babylon Health', description: 'AI 驱动的健康评估和咨询', logo: '/images/tools/babylon.png' },
        { name: 'Tempus', description: '精准医疗数据分析平台', logo: '/images/tools/tempus.png' },
        { name: 'Atomwise', description: 'AI 药物发现平台', logo: '/images/tools/atomwise.png' },
      ],
      caseStudy: {
        title: '某医院提高诊断准确性和效率',
        content: '一家医院使用 AI 医学影像分析工具辅助放射科医生，将诊断时间减少了 30%，同时提高了罕见疾病的检测率，改善了患者预后。'
      }
    },
    finance: {
      title: 'AI 金融解决方案',
      description: '通过 AI 技术优化风险评估，提供个性化金融建议，并自动化合规流程。',
      benefits: [
        '风险评估和欺诈检测',
        '算法交易和投资分析',
        '个性化金融建议和规划',
        '客户服务自动化',
        '合规和监管报告'
      ],
      tools: [
        { name: 'Alphasense', description: '金融智能搜索引擎', logo: '/images/tools/alphasense.png' },
        { name: 'Kensho', description: 'AI 市场分析和预测', logo: '/images/tools/kensho.png' },
        { name: 'Onfido', description: 'AI 身份验证和 KYC', logo: '/images/tools/onfido.png' },
        { name: 'Personetics', description: '个性化金融见解和建议', logo: '/images/tools/personetics.png' },
      ],
      caseStudy: {
        title: '某银行减少欺诈损失 60%',
        content: '一家中型银行实施了 AI 欺诈检测系统，在实施后的 6 个月内将欺诈相关损失减少了 60%，同时减少了 80% 的误报，提高了客户满意度。'
      }
    },
    legal: {
      title: 'AI 法律解决方案',
      description: '利用 AI 技术简化法律研究，自动化文档审查，并提高法律服务效率。',
      benefits: [
        '法律研究和案例分析',
        '合同审查和管理',
        '法律文档自动生成',
        '预测性法律分析',
        '电子证据发现和分析'
      ],
      tools: [
        { name: 'ROSS Intelligence', description: 'AI 法律研究助手', logo: '/images/tools/ross.png' },
        { name: 'Kira Systems', description: '合同分析和审查', logo: '/images/tools/kira.png' },
        { name: 'Casetext', description: 'AI 辅助法律研究平台', logo: '/images/tools/casetext.png' },
        { name: 'LawGeex', description: '自动合同审查', logo: '/images/tools/lawgeex.png' },
      ],
      caseStudy: {
        title: '某律所提高效率并降低成本',
        content: '一家中型律师事务所使用 AI 合同审查工具，将合同审查时间减少了 80%，同时提高了准确性，使律师能够专注于更高价值的工作，并为客户提供更具竞争力的定价。'
      }
    },
    ecommerce: {
      title: 'AI 电子商务解决方案',
      description: '通过 AI 技术优化产品推荐，提高客户体验，并自动化库存管理。',
      benefits: [
        '个性化产品推荐',
        '智能定价和促销优化',
        '库存预测和管理',
        '视觉搜索和产品发现',
        '客户服务自动化'
      ],
      tools: [
        { name: 'Nosto', description: '个性化电子商务体验平台', logo: '/images/tools/nosto.png' },
        { name: 'Syte', description: 'AI 视觉搜索和产品发现', logo: '/images/tools/syte.png' },
        { name: 'Bloomreach', description: '电子商务搜索和内容个性化', logo: '/images/tools/bloomreach.png' },
        { name: 'Reflektion', description: '实时个性化平台', logo: '/images/tools/reflektion.png' },
      ],
      caseStudy: {
        title: '某零售商提高转化率和客单价',
        content: '一家在线零售商实施了 AI 产品推荐和个性化系统，在 3 个月内将转化率提高了 25%，平均订单价值增加了 15%，同时改善了客户满意度和忠诚度。'
      }
    },
    content: {
      title: 'AI 内容创作解决方案',
      description: '利用 AI 技术生成高质量内容，优化编辑流程，并提高内容效果。',
      benefits: [
        '自动化内容生成和编辑',
        '内容个性化和优化',
        '多语言内容创作和翻译',
        '内容性能分析和优化',
        '视觉内容生成和编辑'
      ],
      tools: [
        { name: 'Copysmith', description: 'AI 内容生成平台', logo: '/images/tools/copysmith.png' },
        { name: 'Grammarly', description: '写作辅助和编辑工具', logo: '/images/tools/grammarly.png' },
        { name: 'Midjourney', description: 'AI 图像生成', logo: '/images/tools/midjourney.png' },
        { name: 'Descript', description: '音频和视频编辑平台', logo: '/images/tools/descript.png' },
      ],
      caseStudy: {
        title: '某媒体公司提高内容产量和质量',
        content: '一家数字媒体公司使用 AI 内容创作工具，将内容产量提高了 200%，同时减少了 50% 的编辑时间，并通过数据驱动的内容优化提高了读者参与度。'
      }
    },
    hr: {
      title: 'AI 人力资源解决方案',
      description: '通过 AI 技术优化招聘流程，提高员工体验，并自动化 HR 任务。',
      benefits: [
        '智能简历筛选和候选人匹配',
        '员工参与度分析和预测',
        'HR 流程自动化',
        '员工培训和发展个性化',
        '员工流失预测和保留策略'
      ],
      tools: [
        { name: 'Pymetrics', description: '基于神经科学的人才匹配', logo: '/images/tools/pymetrics.png' },
        { name: 'HireVue', description: 'AI 驱动的面试和评估', logo: '/images/tools/hirevue.png' },
        { name: 'Textio', description: '招聘文案优化平台', logo: '/images/tools/textio.png' },
        { name: 'Eightfold', description: 'AI 人才智能平台', logo: '/images/tools/eightfold.png' },
      ],
      caseStudy: {
        title: '某科技公司改善招聘效率和质量',
        content: '一家快速增长的科技公司使用 AI 招聘工具，将招聘周期缩短了 40%，提高了候选人质量，并减少了 30% 的招聘成本，同时改善了候选人多样性。'
      }
    }
  };
  
  const currentSolution = solutions[activeIndustry as keyof typeof solutions];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">AI 行业解决方案</h1>
        <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
          探索 AI 如何为不同行业提供创新解决方案，提高效率，降低成本，并创造新的价值。
        </p>
      </div>
      
      {/* 行业选择器 */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {industries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => setActiveIndustry(industry.id)}
            className={`px-5 py-2.5 rounded-full font-medium transition-colors ${activeIndustry === industry.id ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
          >
            {industry.name}
          </button>
        ))}
      </div>
      
      {/* 解决方案内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* 左侧：解决方案介绍 */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">{currentSolution.title}</h2>
            <p className="text-lg text-neutral-300">{currentSolution.description}</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">主要优势</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentSolution.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-neutral-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-2">案例研究: {currentSolution.caseStudy.title}</h3>
            <p className="text-neutral-400">{currentSolution.caseStudy.content}</p>
          </div>
        </div>
        
        {/* 右侧：推荐工具 */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">推荐 AI 工具</h3>
          <div className="space-y-4">
            {currentSolution.tools.map((tool, index) => (
              <div key={index} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center">
                <div className="w-12 h-12 bg-neutral-800 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-medium">{tool.name}</h4>
                  <p className="text-neutral-400 text-sm">{tool.description}</p>
                </div>
              </div>
            ))}
            
            <Link 
              href={`/tools?category=${activeIndustry}`}
              className="block text-center py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors"
            >
              查看更多 {industries.find(i => i.id === activeIndustry)?.name} AI 工具
            </Link>
          </div>
        </div>
      </div>
      
      {/* 行业解决方案指南 */}
      <div className="border-t border-neutral-800 pt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">AI 行业实施指南</h2>
          <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
            了解如何在您的组织中成功实施 AI 解决方案，从评估需求到衡量成果。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-400 font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">需求评估</h3>
            <p className="text-neutral-400 mb-4">
              识别您组织中可以从 AI 解决方案中受益的关键领域和流程。评估当前挑战和目标。
            </p>
            <ul className="text-neutral-500 space-y-1 text-sm">
              <li>• 流程审核和瓶颈识别</li>
              <li>• 利益相关者访谈和需求收集</li>
              <li>• 优先级排序和可行性分析</li>
            </ul>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-400 font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">解决方案选择</h3>
            <p className="text-neutral-400 mb-4">
              研究和评估适合您特定需求的 AI 工具和平台。考虑集成能力、可扩展性和总拥有成本。
            </p>
            <ul className="text-neutral-500 space-y-1 text-sm">
              <li>• 供应商评估和比较</li>
              <li>• 概念验证和试点测试</li>
              <li>• ROI 分析和业务案例开发</li>
            </ul>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-400 font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">实施和集成</h3>
            <p className="text-neutral-400 mb-4">
              制定实施计划，准备数据，并将 AI 解决方案集成到您现有的系统和工作流程中。
            </p>
            <ul className="text-neutral-500 space-y-1 text-sm">
              <li>• 数据准备和清理</li>
              <li>• 系统集成和定制</li>
              <li>• 用户培训和变更管理</li>
            </ul>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-400 font-bold text-xl">4</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">监控和优化</h3>
            <p className="text-neutral-400 mb-4">
              持续监控 AI 解决方案的性能，收集反馈，并进行必要的调整以优化结果。
            </p>
            <ul className="text-neutral-500 space-y-1 text-sm">
              <li>• 性能指标跟踪和分析</li>
              <li>• 用户反馈收集和分析</li>
              <li>• 持续改进和优化</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* 咨询服务 CTA */}
      <div className="mt-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 md:mr-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">需要定制 AI 解决方案？</h2>
          <p className="text-lg text-neutral-300 max-w-2xl">
            我们的 AI 专家团队可以帮助您评估需求，选择合适的工具，并实施定制的 AI 解决方案，以满足您组织的特定挑战。
          </p>
        </div>
        <Link 
          href="/contact" 
          className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          联系我们
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}

// --- SEO 元数据已移至 metadata.ts 文件 ---