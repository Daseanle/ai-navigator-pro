'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize, 
         Download, CheckCircle, Lock, FileText, Video, MessageSquare, 
         ChevronDown, Settings, List } from 'lucide-react';
import CourseDiscussion from '@/components/CourseDiscussion';

// 课程类型定义
type Lecture = {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz';
  duration: string;
  videoUrl?: string;
  content?: string;
  completed?: boolean;
  preview?: boolean;
  resources?: {
    name: string;
    type: 'pdf' | 'code' | 'zip' | 'other';
    url: string;
    size: string;
  }[];
};

type Section = {
  id: string;
  title: string;
  lectures: Lecture[];
};

type Course = {
  id: string;
  title: string;
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
    instructor: {
      name: '张教授',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
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
            videoUrl: 'https://example.com/videos/welcome.mp4',
            completed: true,
            preview: true,
            resources: [
              {
                name: '课程大纲',
                type: 'pdf',
                url: 'https://example.com/resources/syllabus.pdf',
                size: '1.2 MB'
              }
            ]
          },
          {
            id: 'lecture-1-2',
            title: '如何使用课程平台',
            type: 'video',
            duration: '8:45',
            videoUrl: 'https://example.com/videos/platform.mp4',
            completed: true,
            preview: false
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
            videoUrl: 'https://example.com/videos/ai-tools-overview.mp4',
            completed: true,
            preview: false,
            resources: [
              {
                name: 'AI 工具列表',
                type: 'pdf',
                url: 'https://example.com/resources/ai-tools-list.pdf',
                size: '2.5 MB'
              },
              {
                name: '示例代码',
                type: 'code',
                url: 'https://example.com/resources/example-code.zip',
                size: '4.8 MB'
              }
            ]
          },
          {
            id: 'lecture-2-2',
            title: 'AI 工具选择策略',
            type: 'article',
            duration: '10:00',
            content: '本文将介绍如何根据不同场景选择合适的AI工具...',
            completed: false,
            preview: false
          },
          {
            id: 'lecture-2-3',
            title: '基础知识测验',
            type: 'quiz',
            duration: '15:00',
            completed: false,
            preview: false
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
            videoUrl: 'https://example.com/videos/nlp-tools.mp4',
            completed: false,
            preview: false
          },
          {
            id: 'lecture-3-2',
            title: '计算机视觉工具',
            type: 'video',
            duration: '18:40',
            videoUrl: 'https://example.com/videos/cv-tools.mp4',
            completed: false,
            preview: false
          }
        ]
      }
    ]
  };
};

// 获取当前讲座信息
const getCurrentLecture = (course: Course, lectureId: string): { lecture: Lecture | null, section: Section | null, index: number, totalLectures: number } => {
  let currentLecture: Lecture | null = null;
  let currentSection: Section | null = null;
  let currentIndex = -1;
  let totalLectures = 0;
  
  // 计算所有讲座的总数
  course.sections.forEach(section => {
    totalLectures += section.lectures.length;
  });
  
  // 找到当前讲座和它所在的章节
  course.sections.forEach(section => {
    const lectureIndex = section.lectures.findIndex(lecture => lecture.id === lectureId);
    if (lectureIndex !== -1) {
      currentLecture = section.lectures[lectureIndex];
      currentSection = section;
      currentIndex = lectureIndex;
    }
  });
  
  return { lecture: currentLecture, section: currentSection, index: currentIndex, totalLectures };
};

// 获取上一个和下一个讲座
const getAdjacentLectures = (course: Course, currentSectionId: string, currentLectureIndex: number): { prev: { sectionId: string, lectureId: string } | null, next: { sectionId: string, lectureId: string } | null } => {
  const sectionIndex = course.sections.findIndex(section => section.id === currentSectionId);
  if (sectionIndex === -1) return { prev: null, next: null };
  
  const currentSection = course.sections[sectionIndex];
  
  // 检查是否有上一个讲座
  let prev: { sectionId: string, lectureId: string } | null = null;
  if (currentLectureIndex > 0) {
    // 同一章节的上一个讲座
    prev = {
      sectionId: currentSectionId,
      lectureId: currentSection.lectures[currentLectureIndex - 1].id
    };
  } else if (sectionIndex > 0) {
    // 上一章节的最后一个讲座
    const prevSection = course.sections[sectionIndex - 1];
    prev = {
      sectionId: prevSection.id,
      lectureId: prevSection.lectures[prevSection.lectures.length - 1].id
    };
  }
  
  // 检查是否有下一个讲座
  let next: { sectionId: string, lectureId: string } | null = null;
  if (currentLectureIndex < currentSection.lectures.length - 1) {
    // 同一章节的下一个讲座
    next = {
      sectionId: currentSectionId,
      lectureId: currentSection.lectures[currentLectureIndex + 1].id
    };
  } else if (sectionIndex < course.sections.length - 1) {
    // 下一章节的第一个讲座
    const nextSection = course.sections[sectionIndex + 1];
    next = {
      sectionId: nextSection.id,
      lectureId: nextSection.lectures[0].id
    };
  }
  
  return { prev, next };
};

// 视频播放器组件
const VideoPlayer = ({ videoUrl, onComplete }: { videoUrl: string, onComplete: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 处理视频元数据加载
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  // 处理视频时间更新
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // 如果视频播放完成，标记为已完成
      if (videoRef.current.currentTime >= videoRef.current.duration - 1) {
        onComplete();
      }
    }
  };
  
  // 播放/暂停切换
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // 静音切换
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // 调整音量
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };
  
  // 调整进度
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  // 全屏切换
  const toggleFullscreen = () => {
    const videoContainer = document.getElementById('video-container');
    if (!videoContainer) return;
    
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(err => {
        console.error(`全屏错误: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  // 格式化时间
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <div id="video-container" className="relative bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onClick={togglePlay}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* 视频控制栏 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* 进度条 */}
        <div className="flex items-center mb-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-1 bg-neutral-600 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, #4b5563 ${(currentTime / (duration || 1)) * 100}%)`
            }}
          />
        </div>
        
        {/* 控制按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* 播放/暂停按钮 */}
            <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            {/* 音量控制 */}
            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-neutral-600 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 ${(isMuted ? 0 : volume) * 100}%, #4b5563 ${(isMuted ? 0 : volume) * 100}%)`
                }}
              />
            </div>
            
            {/* 时间显示 */}
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          {/* 右侧控制按钮 */}
          <div className="flex items-center space-x-4">
            {/* 全屏按钮 */}
            <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* 播放按钮覆盖层 */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button
            onClick={togglePlay}
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <Play size={32} className="text-white ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

// 文章内容组件
const ArticleContent = ({ content, onComplete }: { content: string, onComplete: () => void }) => {
  useEffect(() => {
    // 模拟阅读完成，实际应用中可以基于滚动位置或阅读时间
    const timer = setTimeout(() => {
      onComplete();
    }, 10000); // 10秒后标记为已完成
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className="bg-neutral-900 rounded-lg p-6">
      <div className="prose prose-invert max-w-none">
        {content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

// 测验组件
const QuizContent = ({ onComplete }: { onComplete: () => void }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  
  // 模拟测验问题
  const questions = [
    {
      id: 'q1',
      question: 'AI工具的主要应用领域包括以下哪些？',
      options: [
        { id: 'a', text: '自然语言处理' },
        { id: 'b', text: '计算机视觉' },
        { id: 'c', text: '推荐系统' },
        { id: 'd', text: '以上都是' }
      ],
      correctAnswer: 'd'
    },
    {
      id: 'q2',
      question: '以下哪种AI工具最适合处理图像识别任务？',
      options: [
        { id: 'a', text: 'BERT' },
        { id: 'b', text: 'GPT-3' },
        { id: 'c', text: 'ResNet' },
        { id: 'd', text: 'Word2Vec' }
      ],
      correctAnswer: 'c'
    },
    {
      id: 'q3',
      question: '在选择AI工具时，以下哪个因素最不重要？',
      options: [
        { id: 'a', text: '任务适配性' },
        { id: 'b', text: '计算资源需求' },
        { id: 'c', text: '工具的受欢迎程度' },
        { id: 'd', text: '数据隐私考虑' }
      ],
      correctAnswer: 'c'
    }
  ];
  
  // 处理答案选择
  const handleAnswerChange = (questionId: string, answerId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };
  
  // 提交测验
  const handleSubmit = () => {
    setSubmitted(true);
    
    // 检查所有问题是否都已回答
    const allAnswered = questions.every(q => answers[q.id]);
    if (!allAnswered) return;
    
    // 检查答案是否正确
    const allCorrect = questions.every(q => answers[q.id] === q.correctAnswer);
    if (allCorrect) {
      onComplete();
    }
  };
  
  // 计算得分
  const calculateScore = () => {
    if (!submitted) return null;
    
    const correctCount = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    return {
      correct: correctCount,
      total: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100)
    };
  };
  
  const score = calculateScore();
  
  return (
    <div className="bg-neutral-900 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">知识测验</h2>
      
      {questions.map((q, index) => (
        <div key={q.id} className="mb-8">
          <h3 className="text-lg font-medium text-white mb-3">
            {index + 1}. {q.question}
          </h3>
          
          <div className="space-y-2">
            {q.options.map(option => {
              const isSelected = answers[q.id] === option.id;
              const isCorrect = submitted && option.id === q.correctAnswer;
              const isWrong = submitted && isSelected && option.id !== q.correctAnswer;
              
              return (
                <label 
                  key={option.id} 
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-600/20 border border-blue-600' : 'bg-neutral-800 border border-neutral-700'
                  } ${
                    isCorrect ? 'bg-green-600/20 border-green-600' : ''
                  } ${
                    isWrong ? 'bg-red-600/20 border-red-600' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => handleAnswerChange(q.id, option.id)}
                    disabled={submitted}
                    className="mr-3"
                  />
                  <span className="text-white">{option.text}</span>
                  
                  {submitted && isCorrect && (
                    <CheckCircle size={16} className="ml-auto text-green-500" />
                  )}
                </label>
              );
            })}
          </div>
          
          {submitted && answers[q.id] !== q.correctAnswer && (
            <div className="mt-2 text-red-400 text-sm">
              正确答案: {q.options.find(o => o.id === q.correctAnswer)?.text}
            </div>
          )}
        </div>
      ))}
      
      {score && (
        <div className={`p-4 rounded-lg mb-6 ${
          score.percentage >= 70 ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
        }`}>
          <h3 className="font-bold mb-1">测验结果</h3>
          <p>得分: {score.correct}/{score.total} ({score.percentage}%)</p>
          {score.percentage >= 70 ? (
            <p className="mt-1">恭喜！你已通过测验。</p>
          ) : (
            <p className="mt-1">请复习后再次尝试。</p>
          )}
        </div>
      )}
      
      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          提交答案
        </button>
      ) : score && score.percentage < 70 ? (
        <button
          onClick={() => {
            setSubmitted(false);
            setAnswers({});
          }}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          重新尝试
        </button>
      ) : null}
    </div>
  );
};

// 课程播放页面组件
export default function CourseLecturePage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [adjacentLectures, setAdjacentLectures] = useState<{ prev: { sectionId: string, lectureId: string } | null, next: { sectionId: string, lectureId: string } | null }>({ prev: null, next: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [completedLectures, setCompletedLectures] = useState<Set<string>>(new Set());
  
  const courseId = params.id as string;
  const chapterId = params.chapterId as string;
  const lectureId = params.lectureId as string;
  
  // 加载课程数据
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseData(courseId);
        setCourse(data);
        
        // 初始化已完成讲座集合
        const completed = new Set<string>();
        data.sections.forEach(section => {
          section.lectures.forEach(lecture => {
            if (lecture.completed) {
              completed.add(lecture.id);
            }
          });
        });
        setCompletedLectures(completed);
        
        // 获取当前讲座信息
        const { lecture, section, index } = getCurrentLecture(data, lectureId);
        if (!lecture || !section) {
          setError('找不到指定的讲座');
          return;
        }
        
        setCurrentLecture(lecture);
        setCurrentSection(section);
        
        // 获取相邻讲座
        const adjacent = getAdjacentLectures(data, section.id, index);
        setAdjacentLectures(adjacent);
        
        setLoading(false);
      } catch (err) {
        setError('加载课程数据失败');
        setLoading(false);
      }
    };
    
    loadCourse();
  }, [courseId, lectureId]);
  
  // 标记讲座为已完成
  const markLectureAsCompleted = () => {
    if (!currentLecture) return;
    
    setCompletedLectures(prev => {
      const updated = new Set(prev);
      updated.add(currentLecture.id);
      return updated;
    });
  };
  
  // 导航到其他讲座
  const navigateToLecture = (sectionId: string, lectureId: string) => {
    router.push(`/courses/${courseId}/learn/${sectionId}/${lectureId}`);
  };
  
  // 计算课程总进度
  const calculateProgress = () => {
    if (!course) return 0;
    
    let totalLectures = 0;
    let completedCount = 0;
    
    course.sections.forEach(section => {
      section.lectures.forEach(lecture => {
        totalLectures++;
        if (completedLectures.has(lecture.id)) {
          completedCount++;
        }
      });
    });
    
    return totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;
  };
  
  // 渲染讲座内容
  const renderLectureContent = () => {
    if (!currentLecture) return null;
    
    switch (currentLecture.type) {
      case 'video':
        return currentLecture.videoUrl ? (
          <VideoPlayer 
            videoUrl={currentLecture.videoUrl} 
            onComplete={markLectureAsCompleted} 
          />
        ) : (
          <div className="bg-neutral-900 rounded-lg p-6 text-center text-neutral-400">
            视频资源不可用
          </div>
        );
      
      case 'article':
        return currentLecture.content ? (
          <ArticleContent 
            content={currentLecture.content} 
            onComplete={markLectureAsCompleted} 
          />
        ) : (
          <div className="bg-neutral-900 rounded-lg p-6 text-center text-neutral-400">
            文章内容不可用
          </div>
        );
      
      case 'quiz':
        return (
          <QuizContent onComplete={markLectureAsCompleted} />
        );
      
      default:
        return (
          <div className="bg-neutral-900 rounded-lg p-6 text-center text-neutral-400">
            不支持的内容类型
          </div>
        );
    }
  };
  
  // 渲染讲座类型图标
  const renderLectureTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={16} />;
      case 'article':
        return <FileText size={16} />;
      case 'quiz':
        return <MessageSquare size={16} />;
      default:
        return <FileText size={16} />;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="animate-spin mr-2 h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span>加载中...</span>
      </div>
    );
  }
  
  if (error || !course || !currentLecture || !currentSection) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-4">{error || '发生错误'}</h2>
        <Link 
          href={`/courses/${courseId}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回课程页面
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-neutral-900 border-b border-neutral-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              href={`/courses/${courseId}`}
              className="text-neutral-400 hover:text-white transition-colors mr-4"
            >
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-lg font-bold truncate max-w-md">{course.title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="flex items-center">
                <div className="w-48 h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-neutral-400">{calculateProgress()}% 完成</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              aria-label="切换课程大纲"
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* 侧边栏课程大纲 */}
        {showSidebar && (
          <aside className="w-80 bg-neutral-900 border-r border-neutral-800 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-bold mb-4">课程大纲</h2>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between mt-1 text-sm text-neutral-400">
                  <span>{calculateProgress()}% 完成</span>
                  <span>{completedLectures.size}/{course.sections.reduce((acc, section) => acc + section.lectures.length, 0)} 讲座</span>
                </div>
              </div>
              
              {course.sections.map(section => (
                <div key={section.id} className="mb-4">
                  <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg mb-2">
                    <h3 className="font-medium">{section.title}</h3>
                    <span className="text-sm text-neutral-400">{section.lectures.length} 讲座</span>
                  </div>
                  
                  <div className="space-y-1 pl-2">
                    {section.lectures.map(lecture => {
                      const isActive = lecture.id === currentLecture.id;
                      const isCompleted = completedLectures.has(lecture.id);
                      
                      return (
                        <button
                          key={lecture.id}
                          onClick={() => navigateToLecture(section.id, lecture.id)}
                          className={`w-full flex items-center p-2 rounded-lg text-left ${isActive ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-neutral-800 text-neutral-300'}`}
                        >
                          <div className="flex-shrink-0 w-5 h-5 mr-3 flex items-center justify-center">
                            {isCompleted ? (
                              <CheckCircle size={16} className="text-green-500" />
                            ) : lecture.preview ? (
                              renderLectureTypeIcon(lecture.type)
                            ) : (
                              <Lock size={16} className="text-neutral-500" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="text-sm font-medium truncate">{lecture.title}</div>
                            <div className="flex items-center text-xs text-neutral-500">
                              <span className="capitalize">{lecture.type}</span>
                              <span className="mx-1">•</span>
                              <span>{lecture.duration}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
        
        {/* 主内容区 */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="container mx-auto max-w-4xl">
            {/* 讲座标题和导航 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">{currentLecture.title}</h2>
                <div className="flex items-center space-x-2">
                  {adjacentLectures.prev && (
                    <button
                      onClick={() => navigateToLecture(adjacentLectures.prev!.sectionId, adjacentLectures.prev!.lectureId)}
                      className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                      aria-label="上一讲"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  
                  {adjacentLectures.next && (
                    <button
                      onClick={() => navigateToLecture(adjacentLectures.next!.sectionId, adjacentLectures.next!.lectureId)}
                      className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                      aria-label="下一讲"
                    >
                      <ChevronRight size={20} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center text-sm text-neutral-400">
                <span>{currentSection.title}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{currentLecture.type}</span>
                <span className="mx-2">•</span>
                <span>{currentLecture.duration}</span>
              </div>
            </div>
            
            {/* 讲座内容 */}
            <div className="mb-6">
              {renderLectureContent()}
            </div>
            
            {/* 讲座资源 */}
            {currentLecture.resources && currentLecture.resources.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">讲座资源</h3>
                <div className="bg-neutral-900 rounded-lg overflow-hidden">
                  {currentLecture.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 hover:bg-neutral-800 transition-colors border-b border-neutral-800 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <FileText size={18} className="text-blue-400 mr-3" />
                        <div>
                          <div className="font-medium">{resource.name}</div>
                          <div className="text-sm text-neutral-400">{resource.size}</div>
                        </div>
                      </div>
                      <button className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                        <Download size={16} />
                      </button>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* 导航按钮 */}
            <div className="flex justify-between mb-12">
              {adjacentLectures.prev ? (
                <button
                  onClick={() => navigateToLecture(adjacentLectures.prev!.sectionId, adjacentLectures.prev!.lectureId)}
                  className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  <span className="flex items-center">
                    <ChevronLeft size={16} className="mr-1" />
                    上一讲
                  </span>
                </button>
              ) : (
                <div></div>
              )}
              
              {adjacentLectures.next && (
                <button
                  onClick={() => navigateToLecture(adjacentLectures.next!.sectionId, adjacentLectures.next!.lectureId)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span className="flex items-center">
                    下一讲
                    <ChevronRight size={16} className="ml-1" />
                  </span>
                </button>
              )}
            </div>
            
            {/* 讲座讨论区 */}
            <div className="mt-8 pt-8 border-t border-neutral-800">
              <h3 className="text-xl font-bold mb-6">讲座讨论区</h3>
              <CourseDiscussion 
                courseId={courseId}
                currentLectureId={currentLecture.id}
                currentUser={{
                  id: 'current-user',
                  name: '当前用户',
                  avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
                  role: 'student'
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}