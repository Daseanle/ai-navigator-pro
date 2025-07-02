'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'company' | 'team' | 'mission'>('company');

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">关于我们</h1>
      
      {/* 标签页导航 */}
      <div className="flex justify-center border-b border-neutral-800 mb-10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('company')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'company' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-neutral-400 hover:text-white'}`}
        >
          公司介绍
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'team' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-neutral-400 hover:text-white'}`}
        >
          团队成员
        </button>
        <button
          onClick={() => setActiveTab('mission')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'mission' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-neutral-400 hover:text-white'}`}
        >
          使命与愿景
        </button>
      </div>
      
      {/* 公司介绍 */}
      {activeTab === 'company' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">AI Navigator Pro 简介</h2>
            <p className="text-neutral-300 leading-relaxed">
              AI Navigator Pro 成立于2023年，是一家专注于AI工具导航与评测的科技公司。我们致力于为用户提供最全面、最专业的AI工具信息，帮助个人和企业在快速发展的AI领域中找到最适合自己需求的工具和解决方案。
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">我们的故事</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              随着人工智能技术的爆发式发展，市场上涌现出大量的AI工具和应用。然而，用户在选择适合自己的AI工具时常常感到困惑和无所适从。我们的创始团队意识到这一问题，决定创建一个专业的AI工具导航平台，为用户提供客观、全面的AI工具信息和评测。
            </p>
            <p className="text-neutral-300 leading-relaxed">
              经过不懈努力，AI Navigator Pro 已经成为行业内领先的AI工具导航平台，拥有数千名活跃用户和数百个精选AI工具。我们将继续扩展我们的服务范围，为用户提供更多有价值的内容和功能。
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">我们的价值观</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">专业客观</h3>
                <p className="text-neutral-400">
                  我们坚持以专业、客观的态度评测每一款AI工具，为用户提供真实可靠的信息。
                </p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">用户至上</h3>
                <p className="text-neutral-400">
                  用户的需求和体验是我们最关注的焦点，我们不断优化平台，提升用户体验。
                </p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">持续创新</h3>
                <p className="text-neutral-400">
                  我们保持对新技术的敏锐洞察，不断创新我们的服务和内容，引领行业发展。
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
      
      {/* 团队成员 */}
      {activeTab === 'team' && (
        <div>
          <p className="text-neutral-300 text-center mb-10 max-w-3xl mx-auto">
            我们的团队由AI领域的专家、产品设计师和开发工程师组成，拥有丰富的行业经验和专业知识。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 团队成员卡片 */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="aspect-square bg-neutral-800">
                <img src="/images/avatars/team-member-1.jpg" alt="团队成员" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">张明</h3>
                <p className="text-blue-400 mb-3">创始人 & CEO</p>
                <p className="text-neutral-400 mb-4">
                  前Google AI研究员，拥有10年AI领域经验，致力于让AI技术更加普及和易用。
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-neutral-500 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-neutral-500 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="aspect-square bg-neutral-800">
                <img src="/images/avatars/team-member-2.jpg" alt="团队成员" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">李华</h3>
                <p className="text-blue-400 mb-3">CTO</p>
                <p className="text-neutral-400 mb-4">
                  全栈开发专家，曾在多家科技公司担任技术负责人，专注于构建高性能、可扩展的Web应用。
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-neutral-500 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-neutral-500 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="aspect-square bg-neutral-800">
                <img src="/images/avatars/team-member-3.jpg" alt="团队成员" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">王芳</h3>
                <p className="text-blue-400 mb-3">产品总监</p>
                <p className="text-neutral-400 mb-4">
                  拥有丰富的产品设计和用户体验经验，专注于打造直观、易用的产品界面和功能。
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-neutral-500 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-neutral-500 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 使命与愿景 */}
      {activeTab === 'mission' && (
        <div className="space-y-12">
          <section className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">我们的使命</h2>
            <p className="text-xl text-neutral-300 leading-relaxed">
              帮助每个人找到最适合自己需求的AI工具，让AI技术真正赋能个人和企业的发展。
            </p>
          </section>
          
          <section className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">我们的愿景</h2>
            <p className="text-xl text-neutral-300 leading-relaxed">
              成为全球最权威、最全面的AI工具导航平台，引领AI工具评测行业的发展。
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">我们的目标</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-white mb-4">短期目标</h3>
                <ul className="space-y-3 text-neutral-300">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    扩展我们的AI工具库，覆盖更多领域和类别
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    提升平台用户体验，优化界面和功能
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    建立专业的AI工具评测团队和标准
                  </li>
                </ul>
              </div>
              
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-white mb-4">长期目标</h3>
                <ul className="space-y-3 text-neutral-300">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    成为AI工具行业的权威评测平台
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    建立全球最大的AI工具用户社区
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    推动AI工具行业的标准化和规范化发展
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      )}
      
      {/* 联系我们 */}
      <div className="mt-16 bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">联系我们</h2>
        <p className="text-neutral-300 mb-6">
          如果您有任何问题、建议或合作意向，欢迎随时与我们联系。
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="mailto:contact@ainavigatorpro.com" 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            发送邮件
          </a>
          <Link 
            href="/contact" 
            className="px-6 py-3 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-700 transition-colors"
          >
            联系表单
          </Link>
        </div>
      </div>
    </div>
  );
}

// SEO 元数据已移至 metadata.ts 文件