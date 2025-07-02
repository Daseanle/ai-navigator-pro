'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen, Clock, CheckCircle, ChevronRight, Play } from 'lucide-react';

// 课程类型定义
type Lecture = {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz';
  duration: string;
  completed?: boolean;
};

type Section = {
  id: string;
  title: string;
  lectures: Lecture[];
};

type Course = {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  instructor: {
    name: string;
    avatar?: string;
  };
  sections: Section[];
  progress: number;
};

// 模拟获取课程数据
const getCourseData = async (courseId: string): Promise<Course> => {
  // 这里应该是从API获取数据，现在使用模拟数据
  return {
    id: courseId,
    title: 'AI 工具高级应用与开发',
    description: '全面学习如何使用现代AI工具提升工作效率和创造力',
    coverImage: '/images/tools/ai-course-cover.jpg',
    instructor: {
      name: '张教授',
      avatar: '/images/avatars/instructor1.svg',
    },
    progress: 35,
    sections: [
      {
        id: 'section-1',
        title: '课程介绍',
        lectures: [
          {
            id: 'lecture-1-1',
            title: '欢迎来到课程',
            type: 'video',
            duration: '5:23',
            completed: true
          },
          {
            id: 'lecture-1-2',
            title: '如何使用课程平台',
            type: 'video',
            duration: '8:45',
            completed: true
          }
        ]
      },
      {
        id: 'section-2',
        title: 'AI 工具基础',
        lectures: [
          {
            id: 'lecture-2-1',
            title: 'AI 工具概述',
            type: 'video',
            duration: '15:30',
            completed: true
          },
          {
            id: 'lecture-2-2',
            title: 'AI 工具选择策略',
            type: 'article',
            duration: '10:00',
            completed: false
          },
          {
            id: 'lecture-2-3',
            title: '基础知识测验',
            type: 'quiz',
            duration: '15:00',
            completed: false
          }
        ]
      },
      {
        id: 'section-3',
        title: 'AI 工具高级应用',
        lectures: [
          {
            id: 'lecture-3-1',
            title: '自然语言处理工具',
            type: 'video',
            duration: '22:15',
            completed: false
          },
          {
            id: 'lecture-3-2',
            title: '计算机视觉工具',
            type: 'video',
            duration: '18:40',
            completed: false
          }
        ]
      }
    ]
  };
};

// 计算已完成讲座数量
const calculateCompletedLectures = (sections: Section[]): number => {
  let completed = 0;
  sections.forEach(section => {
    section.lectures.forEach(lecture => {
      if (lecture.completed) {
        completed++;
      }
    });
  });
  return completed;
};

// 计算总讲座数量
const calculateTotalLectures = (sections: Section[]): number => {
  return sections.reduce((total, section) => total + section.lectures.length, 0);
};

// 获取下一个未完成讲座
const getNextUncompletedLecture = (sections: Section[]): { sectionId: string, lectureId: string } | null => {
  for (const section of sections) {
    for (const lecture of section.lectures) {
      if (!lecture.completed) {
        return { sectionId: section.id, lectureId: lecture.id };
      }
    }
  }
  // 如果所有讲座都已完成，返回第一个讲座
  if (sections.length > 0 && sections[0].lectures.length > 0) {
    return { sectionId: sections[0].id, lectureId: sections[0].lectures[0].id };
  }
  return null;
};

// 课程学习页面组件
export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 加载课程数据
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseData(courseId);
        setCourse(data);
        setLoading(false);
      } catch (err) {
        setError('加载课程数据失败');
        setLoading(false);
      }
    };
    
    loadCourse();
  }, [courseId]);
  
  // 继续学习按钮点击处理
  const handleContinueLearning = () => {
    if (!course) return;
    
    const nextLecture = getNextUncompletedLecture(course.sections);
    if (nextLecture) {
      router.push(`/courses/${courseId}/learn/${nextLecture.sectionId}/${nextLecture.lectureId}`);
    }
  };
  
  // 跳转到特定讲座
  const navigateToLecture = (sectionId: string, lectureId: string) => {
    router.push(`/courses/${courseId}/learn/${sectionId}/${lectureId}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="animate-spin mr-2 h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span>加载中...</span>
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-4">{error || '发生错误'}</h2>
        <a 
          href={`/courses/${courseId}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回课程页面
        </a>
      </div>
    );
  }
  
  const completedLectures = calculateCompletedLectures(course.sections);
  const totalLectures = calculateTotalLectures(course.sections);
  const progressPercentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
  
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* 课程标题和进度 */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-neutral-400 mb-4">{course.description}</p>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow">
              <div className="flex items-center mb-1">
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between text-sm text-neutral-400">
                <span>{progressPercentage}% 完成</span>
                <span>{completedLectures}/{totalLectures} 讲座</span>
              </div>
            </div>
            
            <button
              onClick={handleContinueLearning}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              继续学习
              <ChevronRight size={18} className="ml-1" />
            </button>
          </div>
        </div>
        
        {/* 课程内容 */}
        <div className="space-y-6">
          {course.sections.map((section, sectionIndex) => (
            <div key={section.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              {/* 章节标题 */}
              <div className="p-4 bg-neutral-800 border-b border-neutral-700">
                <h2 className="text-lg font-bold">
                  {sectionIndex + 1}. {section.title}
                </h2>
              </div>
              
              {/* 章节讲座列表 */}
              <div className="divide-y divide-neutral-800">
                {section.lectures.map((lecture, lectureIndex) => (
                  <button
                    key={lecture.id}
                    onClick={() => navigateToLecture(section.id, lecture.id)}
                    className="w-full flex items-start p-4 hover:bg-neutral-800/50 transition-colors text-left"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center mr-3">
                      {lecture.completed ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <Play size={14} className="text-neutral-400 ml-0.5" />
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium mb-1">
                        {sectionIndex + 1}.{lectureIndex + 1} {lecture.title}
                      </h3>
                      <div className="flex items-center text-sm text-neutral-500">
                        <span className="capitalize mr-2">
                          {lecture.type === 'video' ? '视频' : 
                           lecture.type === 'article' ? '文章' : '测验'}
                        </span>
                        <Clock size={14} className="mr-1" />
                        <span>{lecture.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-2">
                      {lecture.completed ? (
                        <span className="px-2 py-1 bg-green-900/30 text-green-500 text-xs rounded-full">
                          已完成
                        </span>
                      ) : (
                        <ChevronRight size={18} className="text-neutral-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}