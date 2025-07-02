'use client';

import { useState, useEffect } from 'react';
import CourseCard from './CourseCard';

// 课程数据类型
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

type RelatedCoursesProps = {
  courseId: string;
  tags?: string[];
  instructorId?: string;
  limit?: number;
};

// 模拟获取相关课程的函数
const getRelatedCourses = async (params: {
  courseId: string;
  tags?: string[];
  instructorId?: string;
  limit?: number;
}): Promise<Course[]> => {
  // 这里应该是从API获取数据，现在使用模拟数据
  return [
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
    }
  ];
};

const RelatedCourses: React.FC<RelatedCoursesProps> = ({ 
  courseId,
  tags,
  instructorId,
  limit = 3
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedCourses = async () => {
      try {
        const relatedCourses = await getRelatedCourses({
          courseId,
          tags,
          instructorId,
          limit
        });
        setCourses(relatedCourses);
      } catch (error) {
        console.error('Error fetching related courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedCourses();
  }, [courseId, tags, instructorId, limit]);

  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">相关课程推荐</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
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
      </div>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-white mb-6">相关课程推荐</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map(course => (
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
    </div>
  );
};

export default RelatedCourses;