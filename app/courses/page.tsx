'use client';

import { useState, useEffect } from 'react';
import CourseCard from '@/components/CourseCard';
import { Search, Filter, ChevronDown } from 'lucide-react';

// 模拟课程数据类型
type Course = {
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
};

// 模拟获取课程列表的函数
const getCourses = async (): Promise<Course[]> => {
  // 这里应该是从API获取数据，现在使用模拟数据
  return [
    {
      id: 'course-1',
      title: 'AI工具掌握：从入门到精通',
      description: '全面学习如何使用现代AI工具提升工作效率和创造力',
      coverImage: '/images/tools/ai-course-cover.jpg',
      instructor: {
        name: '张教授',
        avatar: '/images/avatars/instructor1.svg',
        title: 'AI应用专家'
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
      tags: ['AI工具', '效率提升'],
      featured: true
    },
    {
      id: 'course-2',
      title: 'ChatGPT提示词工程高级指南',
      description: '掌握提示词工程技巧，让AI输出更精准、更有创意',
      coverImage: '/images/tools/chatgpt.svg',
      instructor: {
        name: '李明',
        avatar: '/images/avatars/instructor2.svg',
        title: 'AI内容创作专家'
      },
      duration: '8小时',
      level: 'advanced',
      studentsCount: 856,
      rating: 4.7,
      reviewsCount: 178,
      price: {
        current: 399,
        original: 499,
        currency: '¥'
      },
      tags: ['ChatGPT', '提示词工程'],
      featured: false
    },
    {
      id: 'course-3',
      title: 'Midjourney图像生成艺术',
      description: '从零开始学习Midjourney，创作惊艳的AI艺术作品',
      coverImage: '/images/tools/midjourney.svg',
      instructor: {
        name: '王艺',
        avatar: '/images/avatars/instructor3.svg',
        title: '数字艺术家'
      },
      duration: '10小时',
      level: 'beginner',
      studentsCount: 1120,
      rating: 4.9,
      reviewsCount: 320,
      price: {
        current: 349,
        original: 499,
        currency: '¥'
      },
      tags: ['Midjourney', '数字艺术'],
      featured: true
    },
    {
      id: 'course-4',
      title: 'AI编程助手实战指南',
      description: '学习如何使用GitHub Copilot和ChatGPT提升编程效率',
      coverImage: '/images/tools/github-copilot.svg',
      instructor: {
        name: '赵程',
        avatar: '/images/avatars/instructor4.svg',
        title: '资深软件工程师'
      },
      duration: '15小时',
      level: 'intermediate',
      studentsCount: 780,
      rating: 4.6,
      reviewsCount: 145,
      price: {
        current: 449,
        original: 599,
        currency: '¥'
      },
      tags: ['编程', 'GitHub Copilot'],
      featured: false
    },
    {
      id: 'course-5',
      title: 'AI营销内容创作实战',
      description: '利用AI工具创建高转化率的营销内容和社交媒体素材',
      coverImage: '/images/tools/marketing-ai.svg',
      instructor: {
        name: '陈媛',
        avatar: '/images/avatars/instructor5.svg',
        title: '数字营销专家'
      },
      duration: '8小时',
      level: 'beginner',
      studentsCount: 950,
      rating: 4.7,
      reviewsCount: 210,
      price: {
        current: 299,
        original: 399,
        currency: '¥'
      },
      tags: ['营销', '内容创作'],
      featured: false
    },
    {
      id: 'course-6',
      title: 'AI数据分析与可视化',
      description: '使用AI工具简化数据分析流程，创建专业数据可视化',
      coverImage: '/images/tools/data-analysis.svg',
      instructor: {
        name: '林数',
        avatar: '/images/avatars/instructor6.svg',
        title: '数据科学家'
      },
      duration: '14小时',
      level: 'advanced',
      studentsCount: 620,
      rating: 4.8,
      reviewsCount: 130,
      price: {
        current: 499,
        original: 699,
        currency: '¥'
      },
      tags: ['数据分析', '可视化'],
      featured: false
    }
  ];
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 过滤和排序课程
  const filteredAndSortedCourses = courses
    .filter(course => {
      // 搜索过滤
      const matchesSearch = searchQuery === '' || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // 难度级别过滤
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      
      return matchesSearch && matchesLevel;
    })
    .sort((a, b) => {
      // 排序
      switch (selectedSort) {
        case 'popular':
          return (b.studentsCount || 0) - (a.studentsCount || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          // 这里应该基于创建日期排序，但模拟数据中没有这个字段
          return 0;
        case 'price-low':
          return (a.price?.current || 0) - (b.price?.current || 0);
        case 'price-high':
          return (b.price?.current || 0) - (a.price?.current || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">AI导航专业课程</h1>
        <p className="text-xl text-neutral-300 max-w-3xl">
          精选AI工具专业课程，从入门到精通，提升你的AI应用能力
        </p>
      </header>

      {/* 搜索和筛选 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 搜索框 */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-neutral-500" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="搜索课程、主题或讲师..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 筛选按钮（移动端） */}
          <button
            className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            筛选
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* 桌面端筛选选项 */}
          <div className="hidden md:flex gap-4">
            {/* 难度筛选 */}
            <select
              className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="all">所有难度</option>
              <option value="beginner">入门</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>

            {/* 排序方式 */}
            <select
              className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              <option value="popular">最受欢迎</option>
              <option value="rating">最高评分</option>
              <option value="newest">最新发布</option>
              <option value="price-low">价格从低到高</option>
              <option value="price-high">价格从高到低</option>
            </select>
          </div>
        </div>

        {/* 移动端筛选选项（可折叠） */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-2 gap-4 md:hidden">
            {/* 难度筛选 */}
            <div>
              <label className="block text-sm text-neutral-400 mb-1">难度</label>
              <select
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white appearance-none cursor-pointer"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="all">所有难度</option>
                <option value="beginner">入门</option>
                <option value="intermediate">中级</option>
                <option value="advanced">高级</option>
              </select>
            </div>

            {/* 排序方式 */}
            <div>
              <label className="block text-sm text-neutral-400 mb-1">排序方式</label>
              <select
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white appearance-none cursor-pointer"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                <option value="popular">最受欢迎</option>
                <option value="rating">最高评分</option>
                <option value="newest">最新发布</option>
                <option value="price-low">价格从低到高</option>
                <option value="price-high">价格从高到低</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 课程列表 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-48 bg-neutral-800 rounded-t-xl"></div>
              <div className="p-5 bg-neutral-900 rounded-b-xl border border-neutral-800">
                <div className="h-6 bg-neutral-800 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-neutral-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-800 rounded w-5/6 mb-4"></div>
                <div className="h-8 bg-neutral-800 rounded w-1/3 mt-6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAndSortedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCourses.map(course => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              coverImage={course.coverImage}
              instructor={course.instructor}
              duration={course.duration}
              level={course.level}
              studentsCount={course.studentsCount}
              rating={course.rating}
              reviewsCount={course.reviewsCount}
              price={course.price}
              tags={course.tags}
              featured={course.featured}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-neutral-900 rounded-xl border border-neutral-800">
          <h3 className="text-xl font-bold text-white mb-2">未找到匹配的课程</h3>
          <p className="text-neutral-400 mb-6">尝试调整搜索条件或浏览我们的所有课程</p>
          <button
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => {
              setSearchQuery('');
              setSelectedLevel('all');
              setSelectedSort('popular');
            }}
          >
            查看所有课程
          </button>
        </div>
      )}

      {/* 订阅课程更新 */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">获取最新课程更新</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-6">
          订阅我们的课程通讯，第一时间获取新课程发布、限时优惠和学习资源。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="输入您的邮箱"
            className="flex-grow px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
            订阅
          </button>
        </div>
      </div>
    </div>
  );
}