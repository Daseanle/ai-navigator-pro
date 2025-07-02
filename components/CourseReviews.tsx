'use client';

import { useState } from 'react';
import { Star, ThumbsUp, Flag, ChevronDown, ChevronUp } from 'lucide-react';

// 评价数据类型
type Review = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  content: string;
  date: string;
  helpfulCount: number;
  isHelpful?: boolean;
  isReported?: boolean;
};

type CourseReviewsProps = {
  courseId: string;
  initialReviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
  ratingDistribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};

// 模拟获取评价数据的函数
const getReviews = async (courseId: string): Promise<{
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}> => {
  // 这里应该是从API获取数据，现在使用模拟数据
  return {
    reviews: [
      {
        id: 'review-1',
        userId: 'user-1',
        userName: '李明',
        userAvatar: '/images/avatars/user1.svg',
        rating: 5,
        title: '非常实用的AI工具课程',
        content: '这门课程内容非常丰富，讲解清晰，实用性很强。我学习后立即应用到了工作中，效率提升了不少。特别是ChatGPT的提示词技巧部分，对我帮助很大。推荐给所有想要提高工作效率的人！',
        date: '2023-12-10',
        helpfulCount: 24,
        isHelpful: false,
        isReported: false
      },
      {
        id: 'review-2',
        userId: 'user-2',
        userName: '王小红',
        userAvatar: '/images/avatars/user2.svg',
        rating: 4,
        title: '很好的入门课程',
        content: '作为AI工具的入门课程非常不错，内容由浅入深，讲解清晰。唯一的缺点是有些工具的高级用法讲解不够深入，希望能有进阶课程。总体来说值得推荐给AI新手。',
        date: '2023-11-28',
        helpfulCount: 18,
        isHelpful: false,
        isReported: false
      },
      {
        id: 'review-3',
        userId: 'user-3',
        userName: '张三',
        userAvatar: '/images/avatars/user3.svg',
        rating: 5,
        title: '超出预期的优质课程',
        content: '课程质量远超我的预期！讲师经验丰富，案例丰富且实用。我特别喜欢Midjourney部分的讲解，让我快速上手了AI绘画。课程资料也很完善，值得反复学习。',
        date: '2023-11-15',
        helpfulCount: 32,
        isHelpful: false,
        isReported: false
      },
      {
        id: 'review-4',
        userId: 'user-4',
        userName: '刘工',
        userAvatar: '/images/avatars/user4.svg',
        rating: 3,
        title: '内容不错但节奏偏慢',
        content: '课程内容选择很好，覆盖了主流AI工具，但讲解节奏偏慢，有些基础内容可以加快。另外希望能增加更多实战案例和高级应用场景的讲解。',
        date: '2023-10-30',
        helpfulCount: 7,
        isHelpful: false,
        isReported: false
      },
      {
        id: 'review-5',
        userId: 'user-5',
        userName: '赵女士',
        userAvatar: '/images/avatars/user5.svg',
        rating: 5,
        title: '非常适合职场人士的AI课程',
        content: '作为一名营销人员，这门课程对我帮助很大。学习后我能够使用AI工具快速生成高质量内容，大大提高了工作效率。讲师经验丰富，讲解通俗易懂，强烈推荐！',
        date: '2023-10-22',
        helpfulCount: 29,
        isHelpful: false,
        isReported: false
      }
    ],
    averageRating: 4.4,
    totalReviews: 125,
    ratingDistribution: {
      5: 75,
      4: 30,
      3: 15,
      2: 3,
      1: 2
    }
  };
};

const CourseReviews: React.FC<CourseReviewsProps> = ({ 
  courseId, 
  initialReviews = [],
  averageRating = 0,
  totalReviews = 0,
  ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [stats, setStats] = useState({
    averageRating,
    totalReviews,
    ratingDistribution
  });
  const [loading, setLoading] = useState(initialReviews.length === 0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful'>('recent');

  // 加载评价数据
  const loadReviews = async () => {
    if (!loading && reviews.length > 0) return;
    
    setLoading(true);
    try {
      const data = await getReviews(courseId);
      setReviews(data.reviews);
      setStats({
        averageRating: data.averageRating,
        totalReviews: data.totalReviews,
        ratingDistribution: data.ratingDistribution
      });
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // 标记评价有帮助
  const markHelpful = (reviewId: string) => {
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === reviewId
          ? { 
              ...review, 
              helpfulCount: review.isHelpful ? review.helpfulCount - 1 : review.helpfulCount + 1,
              isHelpful: !review.isHelpful 
            }
          : review
      )
    );
  };

  // 举报评价
  const reportReview = (reviewId: string) => {
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === reviewId
          ? { ...review, isReported: true }
          : review
      )
    );
  };

  // 过滤和排序评价
  const filteredAndSortedReviews = reviews
    .filter(review => filterRating === null || review.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.helpfulCount - a.helpfulCount;
      }
    });

  // 计算评分百分比
  const calculateRatingPercentage = (rating: number) => {
    if (stats.totalReviews === 0) return 0;
    return (stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100;
  };

  // 显示的评价数量
  const displayedReviews = showAllReviews 
    ? filteredAndSortedReviews 
    : filteredAndSortedReviews.slice(0, 3);

  // 渲染星级
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">学员评价</h2>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-neutral-800 rounded-lg"></div>
          <div className="h-40 bg-neutral-800 rounded-lg"></div>
          <div className="h-40 bg-neutral-800 rounded-lg"></div>
        </div>
      ) : (
        <>
          {/* 评价统计 */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* 左侧平均评分 */}
              <div className="md:w-1/4 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-white mb-2">{stats.averageRating.toFixed(1)}</div>
                <div className="flex mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={`${star <= Math.round(stats.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'}`}
                    />
                  ))}
                </div>
                <div className="text-sm text-neutral-400">{stats.totalReviews} 条评价</div>
              </div>
              
              {/* 右侧评分分布 */}
              <div className="md:w-3/4">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <button 
                        className={`flex items-center gap-1 min-w-[40px] ${filterRating === rating ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
                        onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                      >
                        {rating} <Star size={12} className="fill-current" />
                      </button>
                      <div className="flex-grow h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400" 
                          style={{ width: `${calculateRatingPercentage(rating)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-neutral-400 min-w-[40px] text-right">
                        {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* 评价筛选和排序 */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="flex gap-4 mb-4 md:mb-0">
              <button 
                className={`px-3 py-1.5 rounded-lg ${filterRating === null ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
                onClick={() => setFilterRating(null)}
              >
                全部评价
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button 
                  key={rating}
                  className={`px-3 py-1.5 rounded-lg ${filterRating === rating ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
                  onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                >
                  {rating} 星
                </button>
              ))}
            </div>
            
            <select
              className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'helpful')}
            >
              <option value="recent">最新</option>
              <option value="helpful">最有帮助</option>
            </select>
          </div>
          
          {/* 评价列表 */}
          {displayedReviews.length > 0 ? (
            <div className="space-y-6">
              {displayedReviews.map((review) => (
                <div key={review.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    {/* 用户头像 */}
                    <div className="flex-shrink-0">
                      {review.userAvatar ? (
                        <img 
                          src={review.userAvatar} 
                          alt={review.userName} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center text-white font-medium">
                          {review.userName.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    {/* 评价内容 */}
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-medium text-white">{review.userName}</span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-sm text-neutral-400">{review.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(review.rating)}
                        {review.title && (
                          <h4 className="ml-2 font-medium text-white">{review.title}</h4>
                        )}
                      </div>
                      
                      <p className="text-neutral-300 mb-4">{review.content}</p>
                      
                      {/* 评价操作 */}
                      <div className="flex items-center gap-4">
                        <button 
                          className={`flex items-center gap-1 text-sm ${review.isHelpful ? 'text-blue-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                          onClick={() => markHelpful(review.id)}
                          disabled={review.isReported}
                        >
                          <ThumbsUp size={14} />
                          有帮助 ({review.helpfulCount})
                        </button>
                        
                        {review.isReported ? (
                          <span className="text-sm text-neutral-500">已举报</span>
                        ) : (
                          <button 
                            className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-300"
                            onClick={() => reportReview(review.id)}
                          >
                            <Flag size={14} />
                            举报
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 加载更多按钮 */}
              {filteredAndSortedReviews.length > 3 && (
                <button 
                  className="flex items-center justify-center gap-1 w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                >
                  {showAllReviews ? (
                    <>
                      显示较少评价 <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      查看全部 {filteredAndSortedReviews.length} 条评价 <ChevronDown size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-900 rounded-xl border border-neutral-800">
              <h3 className="text-xl font-medium text-white mb-2">暂无评价</h3>
              <p className="text-neutral-400">
                {filterRating ? `暂无 ${filterRating} 星评价` : '该课程暂无评价'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseReviews;