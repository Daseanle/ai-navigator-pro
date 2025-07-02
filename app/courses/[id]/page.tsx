'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, Users, Star, BookOpen, CheckCircle, Play, Download, Award } from 'lucide-react';
import CourseReviews from '@/components/CourseReviews';
import RelatedCourses from '@/components/RelatedCourses';
import CourseDiscussion from '@/components/CourseDiscussion';

// 模拟课程数据类型
type CourseSection = {
  id: string;
  title: string;
  duration: string;
  lectures: {
    id: string;
    title: string;
    duration: string;
    type: 'video' | 'article' | 'quiz';
    preview?: boolean;
  }[];
};

type Course = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  coverImage?: string;
  instructor: {
    name: string;
    avatar?: string;
    title?: string;
    bio?: string;
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
  sections: CourseSection[];
  whatYouWillLearn: string[];
  requirements: string[];
  targetAudience: string[];
  lastUpdated: string;
};

// 模拟获取课程详情的函数
const getCourseDetail = async (id: string): Promise<Course> => {
  // 这里应该是从API获取数据，现在使用模拟数据
  return {
    id,
    title: 'AI工具掌握：从入门到精通',
    description: '全面学习如何使用现代AI工具提升工作效率和创造力',
    longDescription: '本课程将带你深入了解当今最流行的AI工具，从基础概念到高级应用。你将学习如何利用ChatGPT、Midjourney、DALL-E等工具解决实际问题，提高工作效率，并探索创意可能性。无论你是AI新手还是有经验的用户，本课程都能帮助你更有效地利用这些强大工具。',
    coverImage: '/images/tools/ai-course-cover.jpg',
    instructor: {
      name: '张教授',
      avatar: '/images/avatars/instructor1.svg',
      title: 'AI应用专家',
      bio: '张教授拥有10年AI领域经验，曾在多家科技公司担任AI产品顾问，著有《AI工具实战指南》等书籍。'
    },
    duration: '12小时',
    level: 'intermediate',
    studentsCount: 1240,
    rating: 4.8,
    reviewsCount: 256,
    price: {
      current: 299,
      original: 599,
      currency: '¥'
    },
    tags: ['AI工具', '效率提升', '创意生成', '实战案例'],
    featured: true,
    sections: [
      {
        id: 'section-1',
        title: '课程介绍',
        duration: '45分钟',
        lectures: [
          {
            id: 'lecture-1-1',
            title: '欢迎来到课程',
            duration: '5分钟',
            type: 'video',
            preview: true
          },
          {
            id: 'lecture-1-2',
            title: 'AI工具的发展历程',
            duration: '15分钟',
            type: 'video',
            preview: true
          },
          {
            id: 'lecture-1-3',
            title: '课程概述和学习路径',
            duration: '10分钟',
            type: 'video'
          },
          {
            id: 'lecture-1-4',
            title: '准备工作和环境设置',
            duration: '15分钟',
            type: 'article'
          }
        ]
      },
      {
        id: 'section-2',
        title: 'ChatGPT基础与应用',
        duration: '3小时',
        lectures: [
          {
            id: 'lecture-2-1',
            title: 'ChatGPT介绍与账号设置',
            duration: '20分钟',
            type: 'video'
          },
          {
            id: 'lecture-2-2',
            title: '有效提示词工程入门',
            duration: '30分钟',
            type: 'video'
          },
          {
            id: 'lecture-2-3',
            title: '实战：内容创作与编辑',
            duration: '45分钟',
            type: 'video'
          },
          {
            id: 'lecture-2-4',
            title: '实战：代码辅助与问题解决',
            duration: '45分钟',
            type: 'video'
          },
          {
            id: 'lecture-2-5',
            title: '高级提示词技巧',
            duration: '40分钟',
            type: 'video'
          }
        ]
      },
      {
        id: 'section-3',
        title: 'Midjourney图像生成精通',
        duration: '2.5小时',
        lectures: [
          {
            id: 'lecture-3-1',
            title: 'Midjourney介绍与设置',
            duration: '25分钟',
            type: 'video'
          },
          {
            id: 'lecture-3-2',
            title: '基础提示词结构与参数',
            duration: '35分钟',
            type: 'video'
          },
          {
            id: 'lecture-3-3',
            title: '风格化与艺术效果控制',
            duration: '40分钟',
            type: 'video'
          },
          {
            id: 'lecture-3-4',
            title: '实战：产品设计与营销素材',
            duration: '50分钟',
            type: 'video'
          }
        ]
      }
    ],
    whatYouWillLearn: [
      '掌握ChatGPT、Midjourney、DALL-E等主流AI工具的使用方法',
      '学习高效的提示词工程技巧，获得更精准的AI输出',
      '通过实战案例学习AI工具在不同场景的应用',
      '了解如何将多种AI工具组合使用，构建高效工作流',
      '学习如何评估和选择适合特定任务的AI工具',
      '掌握AI工具的局限性及如何规避常见问题'
    ],
    requirements: [
      '基本的计算机操作能力',
      '有互联网连接和现代浏览器',
      '无需编程经验（但对于代码相关章节有基础会更好）',
      '好奇心和学习热情'
    ],
    targetAudience: [
      '希望提高工作效率的专业人士',
      '内容创作者、设计师和营销人员',
      '对AI技术感兴趣的学生和教育工作者',
      '创业者和产品经理',
      '希望了解AI工具应用的技术爱好者'
    ],
    lastUpdated: '2023-12-15'
  };
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await getCourseDetail(courseId);
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // 切换章节展开/折叠状态
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // 格式化价格
  const formatPrice = (amount: number, currency: string = '¥') => {
    return `${currency}${amount.toFixed(2)}`;
  };

  // 计算折扣百分比
  const calculateDiscount = (original?: number, current?: number) => {
    if (!original || !current || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  // 处理报名
  const handleEnroll = async () => {
    if (!course) return;
    
    setEnrolling(true);
    
    // 模拟API调用
    setTimeout(() => {
      setEnrolled(true);
      setEnrolling(false);
    }, 1500);
  };

  // 课程难度对应的颜色和标签
  const levelInfo = {
    beginner: { color: 'bg-green-500', text: '入门' },
    intermediate: { color: 'bg-yellow-500', text: '中级' },
    advanced: { color: 'bg-red-500', text: '高级' }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-pulse flex flex-col w-full">
          <div className="h-8 bg-neutral-800 rounded w-3/4 mb-6"></div>
          <div className="h-64 bg-neutral-800 rounded mb-6"></div>
          <div className="h-4 bg-neutral-800 rounded w-full mb-4"></div>
          <div className="h-4 bg-neutral-800 rounded w-5/6 mb-4"></div>
          <div className="h-4 bg-neutral-800 rounded w-4/6 mb-4"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">课程未找到</h1>
        <p className="text-neutral-400 mb-8">抱歉，我们无法找到您请求的课程。</p>
        <a 
          href="/courses" 
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          浏览所有课程
        </a>
      </div>
    );
  }

  const discount = calculateDiscount(course.price?.original, course.price?.current);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* 课程标题和基本信息 */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{course.title}</h1>
        <p className="text-xl text-neutral-300 mb-6">{course.description}</p>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400 mb-4">
          {course.rating && (
            <div className="flex items-center">
              <Star size={16} className="mr-1 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-medium">{course.rating.toFixed(1)}</span>
              {course.reviewsCount && (
                <span className="text-neutral-500 ml-1">({course.reviewsCount}条评价)</span>
              )}
            </div>
          )}
          
          {course.studentsCount && (
            <div className="flex items-center">
              <Users size={16} className="mr-1" />
              {course.studentsCount.toLocaleString()}名学生
            </div>
          )}
          
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            {course.duration}
          </div>
          
          <div className="flex items-center">
            <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-md ${levelInfo[course.level].color}`}>
              {levelInfo[course.level].text}
            </span>
          </div>
          
          <div className="flex items-center">
            最后更新于 {course.lastUpdated}
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-white overflow-hidden mr-3">
            {course.instructor.avatar ? (
              <img src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" />
            ) : (
              course.instructor.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="text-white font-medium">{course.instructor.name}</div>
            {course.instructor.title && (
              <div className="text-sm text-neutral-400">{course.instructor.title}</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧内容区 */}
        <div className="lg:col-span-2">
          {/* 课程封面 */}
          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8">
            {course.coverImage ? (
              <img 
                src={course.coverImage} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <BookOpen size={64} className="text-white/80" />
              </div>
            )}
          </div>
          
          {/* 课程详情标签页 */}
          <div className="mb-8">
            <div className="border-b border-neutral-800 mb-6">
              <div className="flex space-x-8">
                <button className="px-4 py-2 text-white font-medium border-b-2 border-blue-500">
                  课程详情
                </button>
                <a href="#course-reviews" className="px-4 py-2 text-neutral-400 hover:text-white transition-colors">
                  评价 ({course.reviewsCount || 0})
                </a>
                <a href="#instructor-info" className="px-4 py-2 text-neutral-400 hover:text-white transition-colors">
                  讲师介绍
                </a>
                <Link href="#course-discussion" className="px-4 py-3 text-neutral-400 hover:text-white">
                    讨论区
                  </Link>
              </div>
            </div>
            
            {/* 课程描述 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">关于本课程</h2>
              <p className="text-neutral-300 whitespace-pre-line">{course.longDescription}</p>
            </div>
            
            {/* 你将学到什么 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">你将学到什么</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex">
                    <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-neutral-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 课程要求 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">课程要求</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-300">
                {course.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            {/* 适合人群 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">适合人群</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-300">
                {course.targetAudience.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            {/* 课程大纲 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">课程大纲</h2>
              <div className="space-y-4">
                {course.sections.map((section) => (
                  <div key={section.id} className="border border-neutral-800 rounded-lg overflow-hidden">
                    {/* 章节标题 */}
                    <button 
                      className="w-full flex justify-between items-center p-4 bg-neutral-900 hover:bg-neutral-800 transition-colors"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center">
                        <div className="mr-3">
                          {expandedSections.includes(section.id) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                              <path d="M5 12h14"/>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                              <path d="M12 5v14M5 12h14"/>
                            </svg>
                          )}
                        </div>
                        <div className="text-left">
                          <h3 className="text-white font-medium">{section.title}</h3>
                          <div className="text-sm text-neutral-400">{section.lectures.length}个讲座 • {section.duration}</div>
                        </div>
                      </div>
                    </button>
                    
                    {/* 章节内容 */}
                    {expandedSections.includes(section.id) && (
                      <div className="border-t border-neutral-800">
                        {section.lectures.map((lecture, index) => (
                          <div 
                            key={lecture.id} 
                            className={`flex items-center p-4 ${index !== section.lectures.length - 1 ? 'border-b border-neutral-800' : ''}`}
                          >
                            <div className="mr-3">
                              {lecture.type === 'video' && <Play size={16} className="text-neutral-400" />}
                              {lecture.type === 'article' && <BookOpen size={16} className="text-neutral-400" />}
                              {lecture.type === 'quiz' && <Award size={16} className="text-neutral-400" />}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center">
                                <h4 className="text-neutral-300">{lecture.title}</h4>
                                {lecture.preview && (
                                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-900 text-blue-300 rounded">预览</span>
                                )}
                              </div>
                              <div className="text-sm text-neutral-500">{lecture.duration}</div>
                            </div>
                            {lecture.preview && (
                              <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                                预览
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 讲师信息 */}
          <div id="instructor-info" className="mb-10 p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
            <h2 className="text-xl font-bold text-white mb-4">讲师介绍</h2>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {course.instructor.avatar ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <img 
                      src={course.instructor.avatar} 
                      alt={course.instructor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-neutral-500">
                      {course.instructor.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{course.instructor.name}</h3>
                {course.instructor.title && (
                  <p className="text-sm text-neutral-400 mb-2">{course.instructor.title}</p>
                )}
                {course.instructor.bio && (
                  <p className="text-neutral-300">{course.instructor.bio}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* 课程评价 */}
          <div id="course-reviews">
            <CourseReviews 
              courseId={course.id} 
              averageRating={course.rating} 
              totalReviews={course.reviewsCount} 
            />
          </div>
        </div>
        
        {/* 右侧购买卡片 */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden sticky top-24">
            {/* 预览图 */}
            <div className="relative h-48 overflow-hidden">
              {course.coverImage ? (
                <img 
                  src={course.coverImage} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                  <BookOpen size={48} className="text-white/80" />
                </div>
              )}
              
              {/* 播放按钮 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 bg-blue-600/90 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <Play size={24} className="text-white ml-1" />
                </button>
              </div>
              
              {/* 预览标签 */}
              <div className="absolute bottom-4 right-4">
                <span className="px-2 py-1 text-xs font-medium text-white bg-black/70 rounded">
                  预览课程
                </span>
              </div>
            </div>
            
            {/* 价格信息 */}
            <div className="p-6">
              <div className="mb-6">
                {course.price ? (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl font-bold text-white">
                        {formatPrice(course.price.current, course.price.currency)}
                      </span>
                      {course.price.original && course.price.original > course.price.current && (
                        <span className="text-lg text-neutral-500 line-through">
                          {formatPrice(course.price.original, course.price.currency)}
                        </span>
                      )}
                    </div>
                    {discount > 0 && (
                      <div className="text-sm text-green-400 mb-2">
                        节省 {discount}%，限时优惠
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-green-400 mb-4">免费</div>
                )}
              </div>
              
              {/* 行动按钮 */}
              {enrolled ? (
                <div className="space-y-4">
                  <a 
                    href="#" 
                    className="block w-full py-3 bg-green-600 hover:bg-green-700 text-white text-center font-medium rounded-lg transition-colors"
                  >
                    继续学习
                  </a>
                  <div className="text-center text-sm text-neutral-400">
                    您已成功报名此课程
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <button 
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        处理中...
                      </span>
                    ) : '立即报名'}
                  </button>
                  <button className="w-full py-3 bg-transparent border border-neutral-700 hover:border-neutral-600 text-white font-medium rounded-lg transition-colors">
                    添加到愿望清单
                  </button>
                </div>
              )}
              
              {/* 课程包含内容 */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium text-white">本课程包含：</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-neutral-300">
                    <Play size={16} className="mr-2 text-neutral-400" />
                    {course.sections.reduce((total, section) => total + section.lectures.length, 0)}个视频讲座
                  </li>
                  <li className="flex items-center text-neutral-300">
                    <Clock size={16} className="mr-2 text-neutral-400" />
                    总时长 {course.duration}
                  </li>
                  <li className="flex items-center text-neutral-300">
                    <Download size={16} className="mr-2 text-neutral-400" />
                    可下载的学习资源
                  </li>
                  <li className="flex items-center text-neutral-300">
                    <Award size={16} className="mr-2 text-neutral-400" />
                    完成证书
                  </li>
                </ul>
              </div>
              
              {/* 分享和优惠券 */}
              <div className="mt-6 pt-6 border-t border-neutral-800 flex justify-between">
                <button className="text-neutral-400 hover:text-white transition-colors">
                  分享
                </button>
                <button className="text-neutral-400 hover:text-white transition-colors">
                  使用优惠券
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 课程讨论区 */}
      <div id="course-discussion" className="py-12 border-t border-neutral-800">
        <div className="container mx-auto px-4">
          <CourseDiscussion 
            courseId={course.id} 
            currentUser={{
              id: 'current-user',
              name: '当前用户',
              avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
              role: 'student'
            }} 
          />
        </div>
      </div>

      {/* 相关课程推荐 */}
      <RelatedCourses courseId={course.id} tags={course.tags} />
    </div>
  );
}