'use client';

import { useState } from 'react';
import { Star, StarHalf, User, Award, ThumbsUp, ThumbsDown, BarChart2, HelpCircle } from 'lucide-react';

type RatingCriteria = {
  id: string;
  name: string;
  description: string;
  weight: number;
};

type ExpertRating = {
  criteriaId: string;
  score: number;
  comment?: string;
};

type UserRating = {
  userId: string;
  userName: string;
  userAvatar?: string;
  overallScore: number;
  comment?: string;
  helpful?: number;
  date: string;
};

type RatingSystemProps = {
  toolName: string;
  toolId: string;
  expertRatings: ExpertRating[];
  userRatings: UserRating[];
  ratingCriteria: RatingCriteria[];
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  className?: string;
};

export default function RatingSystem({
  toolName,
  toolId,
  expertRatings,
  userRatings,
  ratingCriteria,
  currentUser = null,
  className = ''
}: RatingSystemProps) {
  const [userRatingValue, setUserRatingValue] = useState<number>(0);
  const [userRatingHover, setUserRatingHover] = useState<number>(0);
  const [userComment, setUserComment] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'expert' | 'user'>('expert');
  const [helpfulMarked, setHelpfulMarked] = useState<{[key: string]: 'up' | 'down' | null}>({});
  
  // 计算专家总评分
  const calculateExpertScore = () => {
    if (expertRatings.length === 0 || ratingCriteria.length === 0) return 0;
    
    let totalScore = 0;
    let totalWeight = 0;
    
    ratingCriteria.forEach(criteria => {
      const rating = expertRatings.find(r => r.criteriaId === criteria.id);
      if (rating) {
        totalScore += rating.score * criteria.weight;
        totalWeight += criteria.weight;
      }
    });
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  };
  
  // 计算用户总评分
  const calculateUserScore = () => {
    if (userRatings.length === 0) return 0;
    
    const totalScore = userRatings.reduce((sum, rating) => sum + rating.overallScore, 0);
    return totalScore / userRatings.length;
  };
  
  // 获取评分分布
  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // 5星到1星的数量
    
    userRatings.forEach(rating => {
      const starIndex = Math.floor(rating.overallScore) - 1;
      if (starIndex >= 0 && starIndex < 5) {
        distribution[starIndex]++;
      }
    });
    
    return distribution.reverse(); // 返回1星到5星的数量
  };
  
  // 提交用户评分
  const submitUserRating = () => {
    if (!currentUser) {
      alert('请先登录后再评分');
      return;
    }
    
    if (userRatingValue === 0) {
      alert('请选择评分星级');
      return;
    }
    
    // 这里应该调用API提交评分
    alert(`评分 ${userRatingValue} 星和评论已提交，谢谢！`);
    
    // 重置表单
    setUserRatingValue(0);
    setUserComment('');
  };
  
  // 标记评论有用/无用
  const markHelpful = (userId: string, type: 'up' | 'down') => {
    if (!currentUser) {
      alert('请先登录后再标记');
      return;
    }
    
    setHelpfulMarked(prev => {
      // 如果已经给了相同的反馈，则取消
      if (prev[userId] === type) {
        const newMarked = {...prev};
        delete newMarked[userId];
        return newMarked;
      }
      
      // 否则设置新的反馈
      return {
        ...prev,
        [userId]: type
      };
    });
  };
  
  // 渲染星级评分
  const renderStars = (score: number, size: number = 20) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score - fullStars >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} size={size} className="text-yellow-400 fill-yellow-400" />;
          } else if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} size={size} className="text-yellow-400 fill-yellow-400" />;
          } else {
            return <Star key={i} size={size} className="text-neutral-600" />;
          }
        })}
      </div>
    );
  };
  
  // 渲染用户评分输入
  const renderUserRatingInput = () => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          return (
            <Star 
              key={i} 
              size={24} 
              className={`cursor-pointer ${(userRatingHover || userRatingValue) >= starValue ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'}`}
              onClick={() => setUserRatingValue(starValue)}
              onMouseEnter={() => setUserRatingHover(starValue)}
              onMouseLeave={() => setUserRatingHover(0)}
            />
          );
        })}
        {userRatingValue > 0 && (
          <span className="ml-2 text-white">{userRatingValue}.0</span>
        )}
      </div>
    );
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // 计算专家评分和用户评分
  const expertScore = calculateExpertScore();
  const userScore = calculateUserScore();
  const ratingDistribution = getRatingDistribution();
  const totalUserRatings = userRatings.length;

  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden ${className}`}>
      {/* 评分系统头部 */}
      <div className="p-6 border-b border-neutral-800">
        <h2 className="text-xl font-bold text-white mb-1">{toolName} 评分</h2>
        <p className="text-neutral-400 text-sm">专家评测和用户真实体验</p>
      </div>
      
      {/* 评分概览 */}
      <div className="p-6 border-b border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 专家评分 */}
          <div className="bg-neutral-800/30 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Award size={20} className="text-yellow-400 mr-2" />
              <h3 className="text-white font-medium">专家评分</h3>
            </div>
            
            <div className="flex items-center">
              <div className="text-4xl font-bold text-white mr-3">
                {expertScore.toFixed(1)}
              </div>
              <div>
                {renderStars(expertScore)}
                <div className="text-neutral-400 text-sm mt-1">
                  基于 {expertRatings.length} 项评估标准
                </div>
              </div>
            </div>
          </div>
          
          {/* 用户评分 */}
          <div className="bg-neutral-800/30 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <User size={20} className="text-blue-400 mr-2" />
              <h3 className="text-white font-medium">用户评分</h3>
            </div>
            
            <div className="flex items-center">
              <div className="text-4xl font-bold text-white mr-3">
                {userScore.toFixed(1)}
              </div>
              <div>
                {renderStars(userScore)}
                <div className="text-neutral-400 text-sm mt-1">
                  来自 {totalUserRatings} 位用户
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 评分分布 */}
        <div className="mt-6">
          <div className="flex items-center mb-3">
            <BarChart2 size={18} className="text-neutral-400 mr-2" />
            <h3 className="text-white font-medium">评分分布</h3>
          </div>
          
          <div className="space-y-2">
            {ratingDistribution.map((count, index) => {
              const starCount = 5 - index;
              const percentage = totalUserRatings > 0 ? (count / totalUserRatings) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center">
                  <div className="w-12 text-sm text-neutral-400">{starCount} 星</div>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-neutral-800 rounded-full h-2.5">
                      <div 
                        className="bg-yellow-400 h-2.5 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm text-neutral-400">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* 评分详情标签页 */}
      <div className="border-b border-neutral-800">
        <div className="flex">
          <button
            onClick={() => setActiveTab('expert')}
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'expert' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-neutral-400 hover:text-white'}`}
          >
            专家评测
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'user' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-neutral-400 hover:text-white'}`}
          >
            用户评价 ({totalUserRatings})
          </button>
        </div>
      </div>
      
      {/* 评分详情内容 */}
      <div className="p-6">
        {activeTab === 'expert' ? (
          <div>
            <h3 className="text-lg font-medium text-white mb-4">专业评测标准</h3>
            <div className="space-y-6">
              {ratingCriteria.map(criteria => {
                const rating = expertRatings.find(r => r.criteriaId === criteria.id);
                const score = rating ? rating.score : 0;
                
                return (
                  <div key={criteria.id} className="border border-neutral-800 rounded-lg overflow-hidden">
                    <div className="bg-neutral-800/30 p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <h4 className="text-white font-medium">{criteria.name}</h4>
                          <div className="ml-2 text-neutral-500 cursor-help group relative">
                            <HelpCircle size={14} />
                            <div className="absolute left-0 bottom-full mb-2 w-64 bg-neutral-800 p-3 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              <p className="text-sm text-neutral-300">{criteria.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {renderStars(score, 16)}
                          <span className="ml-2 text-white">{score.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {rating?.comment && (
                      <div className="p-4">
                        <p className="text-neutral-300 text-sm">{rating.comment}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {/* 用户评分输入 */}
            {!userRatings.some(r => r.userId === currentUser?.id) && (
              <div className="mb-8 border border-neutral-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">分享你的体验</h3>
                
                <div className="mb-4">
                  <label className="block text-neutral-400 text-sm mb-2">评分</label>
                  {renderUserRatingInput()}
                </div>
                
                <div className="mb-4">
                  <label className="block text-neutral-400 text-sm mb-2">评价 (可选)</label>
                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder={currentUser ? '分享你对这个工具的看法...' : '请先登录后再评价'}
                    disabled={!currentUser}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white resize-none min-h-[100px]"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={submitUserRating}
                    disabled={!currentUser || userRatingValue === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    提交评价
                  </button>
                </div>
              </div>
            )}
            
            {/* 用户评价列表 */}
            <div className="space-y-6">
              {userRatings.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  暂无用户评价，成为第一个评价这个工具的人吧！
                </div>
              ) : (
                userRatings.map(rating => (
                  <div key={rating.userId} className="border border-neutral-800 rounded-lg overflow-hidden">
                    <div className="bg-neutral-800/30 p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-white overflow-hidden mr-3">
                            {rating.userAvatar ? (
                              <img src={rating.userAvatar} alt={rating.userName} className="w-full h-full object-cover" />
                            ) : (
                              rating.userName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="text-white font-medium">{rating.userName}</div>
                            <div className="text-neutral-500 text-sm">{formatDate(rating.date)}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {renderStars(rating.overallScore, 16)}
                          <span className="ml-2 text-white">{rating.overallScore.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {rating.comment && (
                      <div className="p-4">
                        <p className="text-neutral-300 text-sm">{rating.comment}</p>
                        
                        <div className="mt-4 flex items-center justify-end">
                          <div className="text-sm text-neutral-500 mr-4">
                            这条评价对你有帮助吗？
                          </div>
                          <button 
                            onClick={() => markHelpful(rating.userId, 'up')}
                            className={`p-1.5 rounded mr-2 ${helpfulMarked[rating.userId] === 'up' ? 'bg-green-900/30 text-green-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                          >
                            <ThumbsUp size={14} />
                          </button>
                          <button 
                            onClick={() => markHelpful(rating.userId, 'down')}
                            className={`p-1.5 rounded ${helpfulMarked[rating.userId] === 'down' ? 'bg-red-900/30 text-red-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                          >
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}