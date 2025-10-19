import { Clock, Users, Star, BookOpen } from 'lucide-react';

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  instructor: {
    name: string;
    avatar?: string;
    title?: string;
  };
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  studentsCount?: number;
  rating?: number;
  reviewsCount?: number;
  price?: {
    current: number;
    original?: number;
    currency?: string;
  };
  tags?: string[];
  featured?: boolean;
  className?: string;
};

export default function CourseCard({
  id,
  title,
  description,
  coverImage,
  instructor,
  duration,
  level,
  studentsCount,
  rating,
  reviewsCount,
  price,
  tags = [],
  featured = false,
  className = ''
}: CourseCardProps) {
  // 课程难度对应的颜色和标签
  const levelInfo = {
    beginner: { color: 'bg-green-500', text: '入门' },
    intermediate: { color: 'bg-yellow-500', text: '中级' },
    advanced: { color: 'bg-red-500', text: '高级' }
  };

  // 格式化价格
  const formatPrice = (amount: number, currency: string = '¥') => {
    return `${currency}${amount.toFixed(2)}`;
  };

  // 计算折扣百分比
  const discountPercentage = price?.original 
    ? Math.round(((price.original - price.current) / price.original) * 100) 
    : 0;

  return (
    <div 
      className={`bg-neutral-900 border ${featured ? 'border-indigo-500/50' : 'border-neutral-800'} rounded-xl overflow-hidden hover:shadow-lg hover:shadow-indigo-500/10 transition-all ${className}`}
    >
      {/* 课程封面 */}
      <div className="relative h-48 overflow-hidden">
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
            <BookOpen size={48} className="text-white/80" />
          </div>
        )}
        
        {/* 难度标签 */}
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 text-xs font-medium text-white rounded-md ${levelInfo[level].color}`}>
            {levelInfo[level].text}
          </span>
        </div>
        
        {/* 精选标签 */}
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded-md">
              精选课程
            </span>
          </div>
        )}
      </div>
      
      {/* 课程内容 */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{title}</h3>
        <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{description}</p>
        
        {/* 讲师信息 */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-white overflow-hidden mr-3">
            {instructor.avatar ? (
              <img src={instructor.avatar} alt={instructor.name} className="w-full h-full object-cover" />
            ) : (
              instructor.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-white">{instructor.name}</div>
            {instructor.title && (
              <div className="text-xs text-neutral-400">{instructor.title}</div>
            )}
          </div>
        </div>
        
        {/* 课程元数据 */}
        <div className="flex flex-wrap gap-4 text-sm text-neutral-400 mb-4">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            {duration}
          </div>
          
          {studentsCount !== undefined && (
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              {studentsCount.toLocaleString()}人学习
            </div>
          )}
          
          {rating !== undefined && (
            <div className="flex items-center">
              <Star size={14} className="mr-1 text-yellow-400 fill-yellow-400" />
              {rating.toFixed(1)}
              {reviewsCount !== undefined && (
                <span className="text-neutral-500 ml-1">({reviewsCount})</span>
              )}
            </div>
          )}
        </div>
        
        {/* 标签 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-0.5 bg-neutral-800 text-xs text-neutral-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* 价格和按钮 */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-neutral-800">
          {price ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">
                  {formatPrice(price.current, price.currency)}
                </span>
                {price.original && price.original > price.current && (
                  <span className="text-sm text-neutral-500 line-through">
                    {formatPrice(price.original, price.currency)}
                  </span>
                )}
              </div>
              {discountPercentage > 0 && (
                <div className="text-xs text-green-400">
                  省{discountPercentage}%
                </div>
              )}
            </div>
          ) : (
            <div className="text-lg font-bold text-green-400">免费</div>
          )}
          
          <a 
            href={`/courses/${id}`} 
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            查看详情
          </a>
        </div>
      </div>
    </div>
  );
}