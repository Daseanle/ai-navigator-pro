import { ArrowRight, ExternalLink } from 'lucide-react';
import ToolCard from './ToolCard';

type Tool = {
  id: number;
  slug: string;
  name: string;
  tagline?: string;
  logo_url?: string;
  tags?: { name: string }[];
};

type SolutionStep = {
  title: string;
  description: string;
  tools: Tool[];
};

type IndustrySolutionProps = {
  industry: string;
  title: string;
  description: string;
  steps: SolutionStep[];
  caseStudies?: {
    title: string;
    company: string;
    description: string;
    results: string[];
    link?: string;
  }[];
  expertTips?: string[];
  className?: string;
};

export default function IndustrySolution({
  industry,
  title,
  description,
  steps,
  caseStudies = [],
  expertTips = [],
  className = ''
}: IndustrySolutionProps) {
  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden ${className}`}>
      {/* 头部 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div className="max-w-3xl">
          <div className="text-indigo-200 text-sm font-medium mb-2">{industry} 行业解决方案</div>
          <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
          <p className="text-indigo-100">{description}</p>
        </div>
      </div>
      
      {/* 主体内容 */}
      <div className="p-6">
        {/* 解决方案步骤 */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6">实施步骤</h3>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* 步骤数字 */}
                <div className="absolute top-0 left-0 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                
                {/* 步骤内容 */}
                <div className="pl-16">
                  <h4 className="text-lg font-semibold text-white mb-2">{step.title}</h4>
                  <p className="text-neutral-300 mb-4">{step.description}</p>
                  
                  {/* 推荐工具 */}
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-neutral-400 mb-3">推荐工具</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {step.tools.map(tool => (
                        <ToolCard
                          key={tool.id}
                          slug={tool.slug}
                          name={tool.name}
                          tagline={tool.tagline}
                          logo_url={tool.logo_url}
                          tags={tool.tags}
                          compact={true}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 连接线 */}
                {index < steps.length - 1 && (
                  <div className="absolute top-10 left-5 w-0.5 bg-indigo-600/30 h-24"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* 案例研究 */}
        {caseStudies.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-6">成功案例</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudies.map((caseStudy, index) => (
                <div key={index} className="bg-neutral-800 rounded-xl p-5">
                  <div className="text-sm text-neutral-400 mb-1">{caseStudy.company}</div>
                  <h4 className="text-lg font-semibold text-white mb-3">{caseStudy.title}</h4>
                  <p className="text-neutral-300 mb-4">{caseStudy.description}</p>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-neutral-400 mb-2">成果</h5>
                    <ul className="space-y-1">
                      {caseStudy.results.map((result, idx) => (
                        <li key={idx} className="text-neutral-300 text-sm flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {caseStudy.link && (
                    <a 
                      href={caseStudy.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-400 text-sm flex items-center hover:text-indigo-300 transition-colors"
                    >
                      查看完整案例 <ExternalLink size={14} className="ml-1" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 专家提示 */}
        {expertTips.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">专家提示</h3>
            <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-xl p-5">
              <ul className="space-y-4">
                {expertTips.map((tip, index) => (
                  <li key={index} className="text-neutral-300 flex items-start">
                    <span className="text-indigo-400 mr-3">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      
      {/* 底部 CTA */}
      <div className="border-t border-neutral-800 p-6">
        <a 
          href={`/solutions/${industry.toLowerCase().replace(/\s+/g, '-')}`}
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          查看更多{industry}行业解决方案 <ArrowRight size={16} className="ml-2" />
        </a>
      </div>
    </div>
  );
}