import { Star, Zap, CheckCircle, XCircle, Award, BarChart3, Lightbulb, DollarSign } from 'lucide-react';

type ReviewScore = {
  category: string;
  score: number;
  icon?: React.ReactNode;
};

type ToolReviewProps = {
  toolName: string;
  conclusion: string;
  pros: string[];
  cons: string[];
  overallScore: number;
  detailedScores?: ReviewScore[];
  useCases?: string[];
  expertOpinion?: string;
  pricingNote?: string;
  className?: string;
};

// 评分星级组件
const RatingStars = ({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) => {
  const starSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };
  
  const starSize = starSizes[size];
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={starSize} 
          className={`mr-1 ${i < Math.round(score) ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'}`} 
        />
      ))}
      <span className={`ml-2 font-medium text-white ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
        {score.toFixed(1)}
      </span>
    </div>
  );
};

// 评分条组件
const ScoreBar = ({ score, label, icon }: { score: number; label: string; icon?: React.ReactNode }) => {
  // 根据分数计算颜色
  const getColorClass = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-neutral-300">{label}</span>
        </div>
        <span className="text-sm font-medium text-white">{score.toFixed(1)}</span>
      </div>
      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColorClass(score)} rounded-full`} 
          style={{ width: `${(score / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function ToolReview({
  toolName,
  conclusion,
  pros,
  cons,
  overallScore,
  detailedScores = [],
  useCases = [],
  expertOpinion,
  pricingNote,
  className = ''
}: ToolReviewProps) {
  // 默认评分维度图标
  const defaultIcons: Record<string, React.ReactNode> = {
    '易用性': <Zap size={16} className="text-blue-400" />,
    '功能': <CheckCircle size={16} className="text-green-400" />,
    '性能': <BarChart3 size={16} className="text-purple-400" />,
    '创新性': <Lightbulb size={16} className="text-yellow-400" />,
    '价格': <DollarSign size={16} className="text-emerald-400" />,
  };

  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden ${className}`}>
      {/* 评测标题 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award size={18} />
            {toolName} 专业评测
          </h3>
          <RatingStars score={overallScore} size="lg" />
        </div>
      </div>
      
      <div className="p-6">
        {/* 评测结论 */}
        <div className="mb-8">
          <h4 className="text-sm font-medium text-neutral-400 mb-2">专家结论</h4>
          <p className="text-white">{conclusion}</p>
        </div>
        
        {/* 详细评分 */}
        {detailedScores.length > 0 && (
          <div className="mb-8">
            <h4 className="text-sm font-medium text-neutral-400 mb-4">详细评分</h4>
            <div className="space-y-3">
              {detailedScores.map((score, index) => (
                <ScoreBar 
                  key={index} 
                  score={score.score} 
                  label={score.category} 
                  icon={score.icon || defaultIcons[score.category]}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* 优缺点对比 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-600/10 border border-green-500/30 p-5 rounded-xl">
            <h4 className="font-semibold mb-3 flex items-center">
              <CheckCircle size={18} className="mr-2 text-green-400"/>优点 (Pros)
            </h4>
            <ul className="list-disc list-inside space-y-2 text-neutral-300">
              {pros.map((pro, index) => <li key={index}>{pro}</li>)}
            </ul>
          </div>
          <div className="bg-red-600/10 border border-red-500/30 p-5 rounded-xl">
            <h4 className="font-semibold mb-3 flex items-center">
              <XCircle size={18} className="mr-2 text-red-400"/>缺点 (Cons)
            </h4>
            <ul className="list-disc list-inside space-y-2 text-neutral-300">
              {cons.map((con, index) => <li key={index}>{con}</li>)}
            </ul>
          </div>
        </div>
        
        {/* 使用场景 */}
        {useCases.length > 0 && (
          <div className="mb-8">
            <h4 className="text-sm font-medium text-neutral-400 mb-3">最佳使用场景</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {useCases.map((useCase, index) => (
                <li key={index} className="bg-neutral-800 p-3 rounded-lg text-neutral-300 text-sm">
                  {useCase}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* 专家观点 */}
        {expertOpinion && (
          <div className="mb-8">
            <h4 className="text-sm font-medium text-neutral-400 mb-2">专家观点</h4>
            <blockquote className="border-l-4 border-blue-500 pl-4 py-1 italic text-neutral-300">
              {expertOpinion}
            </blockquote>
          </div>
        )}
        
        {/* 价格提示 */}
        {pricingNote && (
          <div className="bg-blue-900/20 border border-blue-800/30 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <DollarSign size={20} className="text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-white mb-1">价格信息</h4>
                <p className="text-sm text-neutral-300">{pricingNote}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}