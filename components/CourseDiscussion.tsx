'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MessageSquare, ThumbsUp, Flag, Send, Search, Filter, ChevronDown, MoreVertical, Edit, Trash2, AlertTriangle, CheckCircle, Clock, Tag, SortAsc, SortDesc } from 'lucide-react';

type DiscussionUser = {
  id: string;
  name: string;
  avatar?: string;
  role: 'student' | 'instructor' | 'admin';
};

type DiscussionComment = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  isLiked?: boolean;
  isInstructorResponse?: boolean;
  parentId?: string;
  replies?: DiscussionComment[];
};

type DiscussionQuestion = {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  isResolved: boolean;
  lectureId?: string;
  tags?: string[];
  comments?: DiscussionComment[];
};

type CourseDiscussionProps = {
  courseId: string;
  currentLectureId?: string;
  currentUser: DiscussionUser;
};

// 模拟获取讨论数据
const getDiscussionData = async (courseId: string, lectureId?: string): Promise<DiscussionQuestion[]> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟用户数据
  const users: Record<string, DiscussionUser> = {
    'user1': { id: 'user1', name: '张三', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', role: 'student' },
    'user2': { id: 'user2', name: '李四', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', role: 'student' },
    'instructor': { id: 'instructor', name: '张教授', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', role: 'instructor' },
    'user3': { id: 'user3', name: '王五', role: 'student' },
  };
  
  // 模拟讨论数据
  const discussions: DiscussionQuestion[] = [
    {
      id: 'q1',
      userId: 'user1',
      title: '如何选择合适的AI工具进行自然语言处理？',
      content: '我正在尝试构建一个能够理解用户意图的聊天机器人，但是市面上有太多NLP工具，比如BERT、GPT等，不知道该如何选择最适合我的项目的工具。有没有一些选择的标准或者建议？',
      createdAt: '2023-10-15T08:30:00Z',
      likes: 12,
      isLiked: true,
      commentsCount: 3,
      isResolved: true,
      lectureId: 'lecture-3-1',
      tags: ['NLP', '工具选择', '聊天机器人'],
      comments: [
        {
          id: 'c1',
          userId: 'user2',
          content: '我认为选择工具主要取决于你的具体需求。如果你需要理解上下文，GPT系列可能更合适；如果是分类任务，BERT可能更好。另外还要考虑你的计算资源和预算。',
          createdAt: '2023-10-15T09:15:00Z',
          likes: 5,
          isLiked: false,
        },
        {
          id: 'c2',
          userId: 'instructor',
          content: '非常好的问题！选择AI工具时，你需要考虑以下几点：\n\n1. 任务类型：是分类、生成还是理解？\n2. 数据量：你有多少训练数据？\n3. 计算资源：你的硬件条件如何？\n4. 实时性要求：是否需要快速响应？\n5. 隐私考虑：数据是否敏感？\n\n对于聊天机器人，如果你有足够的计算资源，最新的GPT模型是不错的选择。如果资源有限，可以考虑更轻量级的模型或使用API服务。',
          createdAt: '2023-10-15T10:30:00Z',
          likes: 15,
          isLiked: true,
          isInstructorResponse: true,
        },
        {
          id: 'c3',
          userId: 'user1',
          content: '谢谢教授的详细解答！我会根据您的建议重新评估我的需求和资源。',
          createdAt: '2023-10-15T11:05:00Z',
          likes: 2,
          isLiked: false,
        }
      ]
    },
    {
      id: 'q2',
      userId: 'user3',
      title: '计算机视觉工具在移动设备上的性能问题',
      content: '我正在开发一个需要实时物体识别的移动应用，但发现在手机上运行时性能不佳。有没有针对移动设备优化的轻量级计算机视觉模型推荐？',
      createdAt: '2023-10-16T14:20:00Z',
      likes: 8,
      isLiked: false,
      commentsCount: 2,
      isResolved: false,
      lectureId: 'lecture-3-2',
      tags: ['计算机视觉', '移动优化', '性能'],
      comments: [
        {
          id: 'c4',
          userId: 'user2',
          content: '你可以尝试MobileNet或EfficientNet这类专为移动设备设计的模型，它们在保持较高准确率的同时大大减少了计算需求。',
          createdAt: '2023-10-16T15:10:00Z',
          likes: 4,
          isLiked: true,
        },
        {
          id: 'c5',
          userId: 'user1',
          content: '除了模型选择外，你还可以考虑使用TensorFlow Lite或CoreML这样的框架来优化模型在移动设备上的表现。',
          createdAt: '2023-10-16T16:45:00Z',
          likes: 3,
          isLiked: false,
        }
      ]
    },
    {
      id: 'q3',
      userId: 'user2',
      title: '如何评估AI工具的准确性？',
      content: '在选择和使用AI工具时，我们如何客观地评估它们的准确性和可靠性？有没有一些标准的评估指标或方法？',
      createdAt: '2023-10-17T09:45:00Z',
      likes: 5,
      isLiked: false,
      commentsCount: 0,
      isResolved: false,
      tags: ['评估方法', '准确性', '可靠性'],
      comments: []
    }
  ];
  
  // 如果指定了讲座ID，则过滤相关讨论
  if (lectureId) {
    return discussions.filter(q => q.lectureId === lectureId);
  }
  
  return discussions;
};

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} 分钟前`;
    }
    return `${diffHours} 小时前`;
  } else if (diffDays < 7) {
    return `${diffDays} 天前`;
  } else {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  }
};

// 用户头像组件
const UserAvatar = ({ user }: { user: DiscussionUser }) => {
  if (user.avatar) {
    return (
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image
          src={user.avatar}
          alt={user.name}
          fill
          className="object-cover"
        />
      </div>
    );
  }
  
  return (
    <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-white font-medium">
      {user.name.charAt(0).toUpperCase()}
    </div>
  );
};

// 用户角色标签
const UserRoleBadge = ({ role }: { role: DiscussionUser['role'] }) => {
  if (role === 'instructor') {
    return (
      <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs font-medium rounded-full">
        讲师
      </span>
    );
  }
  
  if (role === 'admin') {
    return (
      <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 text-xs font-medium rounded-full">
        管理员
      </span>
    );
  }
  
  return null;
};

// 讨论区组件
const CourseDiscussion: React.FC<CourseDiscussionProps> = ({ 
  courseId, 
  currentLectureId,
  currentUser 
}) => {
  const [discussions, setDiscussions] = useState<DiscussionQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'resolved' | 'unresolved' | 'my-questions' | 'instructor-replies'>('all');
  const [sort, setSort] = useState<'recent' | 'popular'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLectureFilter, setShowLectureFilter] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'this-week' | 'this-month'>('all');
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [instructors, setInstructors] = useState<DiscussionUser[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', tags: [] as string[] });
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [users, setUsers] = useState<Record<string, DiscussionUser>>({});
  
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  
  // 加载讨论数据
  useEffect(() => {
    const loadDiscussions = async () => {
      setLoading(true);
      try {
        const data = await getDiscussionData(courseId, currentLectureId);
        setDiscussions(data);
        
        // 提取所有用户ID
        const userIds = new Set<string>();
        data.forEach(question => {
          userIds.add(question.userId);
          question.comments?.forEach(comment => {
            userIds.add(comment.userId);
          });
        });
        
        // 收集所有可用的标签
        const tags = new Set<string>();
        data.forEach(question => {
          if (question.tags && question.tags.length > 0) {
            question.tags.forEach(tag => tags.add(tag));
          }
        });
        setAvailableTags(Array.from(tags));
        
        // 模拟获取用户数据
        const usersData: Record<string, DiscussionUser> = {
          'user1': { id: 'user1', name: '张三', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', role: 'student' },
          'user2': { id: 'user2', name: '李四', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', role: 'student' },
          'instructor': { id: 'instructor', name: '张教授', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', role: 'instructor' },
          'instructor2': { id: 'instructor2', name: '李教授', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', role: 'instructor' },
          'user3': { id: 'user3', name: '王五', role: 'student' },
          [currentUser.id]: currentUser
        };
        
        setUsers(usersData);
        
        // 收集所有讲师信息
        const instructorsList = Object.values(usersData).filter(user => user.role === 'instructor');
        setInstructors(instructorsList);
      } catch (error) {
        console.error('Failed to load discussions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDiscussions();
  }, [courseId, currentLectureId, currentUser.id]);
  
  // 过滤和排序讨论
  const filteredDiscussions = discussions
    .filter(question => {
      // 应用搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          question.title.toLowerCase().includes(query) ||
          question.content.toLowerCase().includes(query) ||
          question.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // 应用状态过滤
      let statusFilterPassed = true;
      switch (filter) {
        case 'resolved':
          statusFilterPassed = question.isResolved;
          break;
        case 'unresolved':
          statusFilterPassed = !question.isResolved;
          break;
        case 'my-questions':
          statusFilterPassed = question.userId === currentUser.id;
          break;
        case 'instructor-replies':
          // 筛选有讲师回复的问题
          if (selectedInstructor) {
            // 筛选特定讲师的回复
            statusFilterPassed = question.comments?.some(comment => {
              // 检查评论是否来自选中的讲师
              return comment.userId === selectedInstructor;
            }) || false;
          } else {
            // 筛选所有讲师的回复
            statusFilterPassed = question.comments?.some(comment => {
              // 检查评论是否有讲师回复标记或者评论用户是讲师
              if (comment.isInstructorResponse) return true;
              const user = users[comment.userId];
              return user && user.role === 'instructor';
            }) || false;
          }
          break;
        default:
          statusFilterPassed = true;
      }
      
      if (!statusFilterPassed) return false;
      
      // 应用时间过滤
      const now = new Date();
      const questionDate = new Date(question.createdAt);
      
      let timeFilterPassed = true;
      switch (timeFilter) {
        case 'today':
          // 今天的讨论
          timeFilterPassed = questionDate.toDateString() === now.toDateString();
          break;
        case 'this-week': {
          // 本周的讨论
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(now.getDate() - 7);
          timeFilterPassed = questionDate >= oneWeekAgo;
          break;
        }
        case 'this-month': {
          // 本月的讨论
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(now.getMonth() - 1);
          timeFilterPassed = questionDate >= oneMonthAgo;
          break;
        }
        default:
          timeFilterPassed = true;
      }
      
      if (!timeFilterPassed) return false;
      
      // 应用标签筛选
      if (selectedTag && (!question.tags || !question.tags.includes(selectedTag))) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // 应用排序
      if (sort === 'popular') {
        return b.likes - a.likes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  
  // 处理点赞
  const handleLike = (questionId: string) => {
    setDiscussions(prev => 
      prev.map(q => {
        if (q.id === questionId) {
          const isLiked = !q.isLiked;
          return {
            ...q,
            likes: isLiked ? q.likes + 1 : q.likes - 1,
            isLiked
          };
        }
        return q;
      })
    );
  };
  
  // 处理评论点赞
  const handleCommentLike = (questionId: string, commentId: string) => {
    setDiscussions(prev => 
      prev.map(q => {
        if (q.id === questionId && q.comments) {
          return {
            ...q,
            comments: q.comments.map(c => {
              if (c.id === commentId) {
                const isLiked = !c.isLiked;
                return {
                  ...c,
                  likes: isLiked ? c.likes + 1 : c.likes - 1,
                  isLiked
                };
              }
              return c;
            })
          };
        }
        return q;
      })
    );
  };
  
  // 处理问题解决状态
  const handleToggleResolved = (questionId: string) => {
    setDiscussions(prev => 
      prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            isResolved: !q.isResolved
          };
        }
        return q;
      })
    );
  };
  
  // 处理添加评论
  const handleAddComment = (questionId: string) => {
    if (!newComment.trim()) return;
    
    const newCommentObj: DiscussionComment = {
      id: `c${Date.now()}`,
      userId: currentUser.id,
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      isInstructorResponse: currentUser.role === 'instructor'
    };
    
    setDiscussions(prev => 
      prev.map(q => {
        if (q.id === questionId) {
          const updatedComments = [...(q.comments || []), newCommentObj];
          return {
            ...q,
            comments: updatedComments,
            commentsCount: updatedComments.length
          };
        }
        return q;
      })
    );
    
    setNewComment('');
  };
  
  // 处理编辑评论
  const handleEditComment = (questionId: string, commentId: string) => {
    if (!editContent.trim()) return;
    
    setDiscussions(prev => 
      prev.map(q => {
        if (q.id === questionId && q.comments) {
          return {
            ...q,
            comments: q.comments.map(c => {
              if (c.id === commentId) {
                return {
                  ...c,
                  content: editContent,
                  updatedAt: new Date().toISOString()
                };
              }
              return c;
            })
          };
        }
        return q;
      })
    );
    
    setEditingComment(null);
    setEditContent('');
  };
  
  // 处理删除评论
  const handleDeleteComment = (questionId: string, commentId: string) => {
    setDiscussions(prev => 
      prev.map(q => {
        if (q.id === questionId && q.comments) {
          const updatedComments = q.comments.filter(c => c.id !== commentId);
          return {
            ...q,
            comments: updatedComments,
            commentsCount: updatedComments.length
          };
        }
        return q;
      })
    );
  };
  
  // 处理添加问题
  const handleAddQuestion = () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) return;
    
    const tags = (Array.isArray(newQuestion.tags) ? newQuestion.tags : 
      (newQuestion.tags ? [] : []))
        .map((tag: string) => tag.trim())
        .filter(tag => tag.length > 0);
    
    const newQuestionObj: DiscussionQuestion = {
      id: `q${Date.now()}`,
      userId: currentUser.id,
      title: newQuestion.title,
      content: newQuestion.content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      commentsCount: 0,
      isResolved: false,
      lectureId: currentLectureId,
      tags: tags.length > 0 ? tags : undefined,
      comments: []
    };
    
    // 更新可用标签列表
    if (tags.length > 0) {
      const updatedTags = new Set([...availableTags]);
      tags.forEach(tag => updatedTags.add(tag));
      setAvailableTags(Array.from(updatedTags));
    }
    
    setDiscussions(prev => [newQuestionObj, ...prev]);
    setNewQuestion({ title: '', content: '', tags: [] });
    setShowNewQuestion(false);
  };
  
  // 处理选择问题
  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestion(selectedQuestion === questionId ? null : questionId);
    
    // 如果选择了问题，滚动到评论输入框
    if (selectedQuestion !== questionId) {
      setTimeout(() => {
        commentInputRef.current?.focus();
      }, 100);
    }
  };
  
  return (
    <div className="bg-neutral-950 text-white">
      {/* 讨论区标题和操作 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">课程讨论区</h2>
          <p className="text-neutral-400 mt-1">
            {currentLectureId ? '当前讲座的问题和讨论' : '所有课程相关的问题和讨论'}
          </p>
        </div>
        
        <button
          onClick={() => setShowNewQuestion(true)}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          提问
        </button>
      </div>
      
      {/* 搜索和过滤 */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="搜索讨论..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowLectureFilter(!showLectureFilter)}
              className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              <Filter size={16} />
              {filter === 'all' && '所有问题'}
              {filter === 'resolved' && '已解决'}
              {filter === 'unresolved' && '未解决'}
              {filter === 'instructor-replies' && '讲师回复'}
              {filter === 'my-questions' && '我的问题'}
              <ChevronDown size={16} />
            </button>
            
            {showLectureFilter && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-10">
                <button
                    onClick={() => {
                      setFilter('all');
                      setShowLectureFilter(false);
                      setSelectedInstructor(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors text-white rounded-t-lg"
                  >
                    所有问题
                  </button>
                  <button
                    onClick={() => {
                      setFilter('resolved');
                      setShowLectureFilter(false);
                      setSelectedInstructor(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors text-white"
                  >
                    已解决
                  </button>
                  <button
                    onClick={() => {
                      setFilter('unresolved');
                      setShowLectureFilter(false);
                      setSelectedInstructor(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors text-white"
                  >
                    未解决
                  </button>
                  <button
                    onClick={() => {
                      setFilter('instructor-replies');
                      setShowLectureFilter(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors text-white"
                  >
                    讲师回复
                  </button>
                  <button
                    onClick={() => {
                      setFilter('my-questions');
                      setShowLectureFilter(false);
                      setSelectedInstructor(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors text-white rounded-b-lg"
                  >
                    我的问题
                  </button>
              </div>
            )}
          </div>
          
          <div className="relative">
             <button
               onClick={() => setShowTimeFilter(!showTimeFilter)}
               className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
             >
               <Clock size={16} />
               {timeFilter === 'all' && '所有时间'}
               {timeFilter === 'today' && '今天'}
               {timeFilter === 'this-week' && '本周'}
               {timeFilter === 'this-month' && '本月'}
               <ChevronDown size={16} />
             </button>
             
             {showTimeFilter && (
               <div className="absolute top-full left-0 mt-1 w-40 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-10">
                 <button
                   onClick={() => {
                     setTimeFilter('all');
                     setShowTimeFilter(false);
                   }}
                   className="w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors text-white rounded-t-lg"
                 >
                   所有时间
                 </button>
                 <button
                   onClick={() => {
                     setTimeFilter('today');
                     setShowTimeFilter(false);
                   }}
                   className="w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors text-white"
                 >
                   今天
                 </button>
                 <button
                   onClick={() => {
                     setTimeFilter('this-week');
                     setShowTimeFilter(false);
                   }}
                   className="w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors text-white"
                 >
                   本周
                 </button>
                 <button
                   onClick={() => {
                     setTimeFilter('this-month');
                     setShowTimeFilter(false);
                   }}
                   className="w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors text-white rounded-b-lg"
                 >
                   本月
                 </button>
               </div>
             )}
           </div>
           
           {/* 标签筛选 */}
           {availableTags.length > 0 && (
             <div className="relative">
               <button
                 onClick={() => setShowTagFilter(!showTagFilter)}
                 className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
               >
                 <Tag size={16} />
                 {selectedTag || '标签'}
                 <ChevronDown size={16} />
               </button>
               
               {showTagFilter && (
                 <div className="absolute top-full left-0 mt-1 w-48 max-h-60 overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-10">
                   <button
                     onClick={() => {
                       setSelectedTag(null);
                       setShowTagFilter(false);
                     }}
                     className="w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors text-white rounded-t-lg"
                   >
                     所有标签
                   </button>
                   {availableTags.map((tag, index) => (
                     <button
                       key={tag}
                       onClick={() => {
                         setSelectedTag(tag);
                         setShowTagFilter(false);
                       }}
                       className={`w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors text-white ${index === availableTags.length - 1 ? 'rounded-b-lg' : ''}`}
                     >
                       {tag}
                     </button>
                   ))}
                 </div>
               )}
             </div>
           )}
          
          <div className="relative">
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              {sort === 'recent' ? <SortDesc size={16} /> : <ThumbsUp size={16} />}
              {sort === 'recent' ? '最新' : '最热'}
              <ChevronDown size={16} />
            </button>
            
            {showSortOptions && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setSort('recent');
                    setShowSortOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors text-white rounded-t-lg flex items-center"
                >
                  <SortDesc size={16} className="mr-2" />
                  最新
                </button>
                <button
                  onClick={() => {
                    setSort('popular');
                    setShowSortOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors text-white rounded-b-lg flex items-center"
                >
                  <ThumbsUp size={16} className="mr-2" />
                  最热
                </button>
              </div>
            )}
          </div>
          
          {/* 清除所有筛选 */}
          {(filter !== 'all' || timeFilter !== 'all' || selectedTag !== null || searchQuery !== '') && (
            <button 
              onClick={() => {
                setFilter('all');
                setTimeFilter('all');
                setSelectedTag(null);
                setSelectedInstructor(null);
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-red-600/20 text-red-400 font-medium rounded-lg hover:bg-red-600/30 transition-colors flex items-center gap-2"
            >
              清除筛选
            </button>
          )}
        </div>
      </div>
      
      {/* 新问题表单 */}
      {showNewQuestion && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">提出新问题</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="question-title" className="block text-sm text-neutral-400 mb-1">
                问题标题
              </label>
              <input
                id="question-title"
                type="text"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                placeholder="简明扼要地描述你的问题"
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            
            <div>
              <label htmlFor="question-content" className="block text-sm text-neutral-400 mb-1">
                问题详情
              </label>
              <textarea
                id="question-content"
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                placeholder="详细描述你的问题，包括你已经尝试过的解决方法"
                rows={5}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>
            
            <div>
              <label htmlFor="question-tags" className="block text-sm text-neutral-400 mb-1">
                标签（可选）
              </label>
              <div className="relative">
                <div className="flex flex-wrap gap-2 p-2 bg-neutral-800 border border-neutral-700 rounded-lg mb-2">
                  {Array.isArray(newQuestion.tags) ? newQuestion.tags.map((tag, index) => (
                    <div key={index} className="flex items-center bg-blue-600/30 text-blue-400 px-2 py-1 rounded-full text-sm">
                      <span>{tag}</span>
                      <button 
                        type="button"
                        onClick={() => {
                          const updatedTags = [...newQuestion.tags];
                          updatedTags.splice(index, 1);
                          setNewQuestion({...newQuestion, tags: updatedTags});
                        }}
                        className="ml-1 text-blue-400 hover:text-blue-300"
                      >
                        &times;
                      </button>
                    </div>
                  )) : null}
                  <input
                    type="text"
                    id="tagInput"
                    placeholder={Array.isArray(newQuestion.tags) && newQuestion.tags.length === 0 ? "输入标签并按回车添加" : ""}
                    className="flex-grow bg-transparent border-none text-white placeholder-neutral-500 focus:outline-none min-w-[150px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        e.preventDefault();
                        const newTag = e.currentTarget.value.trim();
                        const currentTags = Array.isArray(newQuestion.tags) ? newQuestion.tags : [];
                        if (!currentTags.includes(newTag)) {
                          setNewQuestion({
                            ...newQuestion, 
                            tags: [...currentTags, newTag]
                          });
                        }
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
                
                {/* 标签建议 */}
                {availableTags.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-neutral-400 mb-1">推荐标签:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableTags
                        .filter(tag => !Array.isArray(newQuestion.tags) || !newQuestion.tags.includes(tag))
                        .slice(0, 8)
                        .map((tag, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              const currentTags = Array.isArray(newQuestion.tags) ? newQuestion.tags : [];
                              setNewQuestion({
                                ...newQuestion,
                                tags: [...currentTags, tag]
                              });
                            }}
                            className="text-xs px-2 py-1 bg-neutral-700 text-neutral-300 rounded-full hover:bg-neutral-600 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNewQuestion(false)}
                className="px-4 py-2 bg-transparent border border-neutral-700 text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddQuestion}
                disabled={!newQuestion.title.trim() || !newQuestion.content.trim()}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                发布问题
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 讲师列表 */}
      {instructors.length > 0 && filter === 'instructor-replies' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-neutral-400">课程讲师</h3>
            {selectedInstructor && (
              <button 
                onClick={() => setSelectedInstructor(null)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                查看所有讲师回复
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {instructors.map(instructor => (
              <button 
                key={instructor.id} 
                onClick={() => setSelectedInstructor(instructor.id === selectedInstructor ? null : instructor.id)}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${instructor.id === selectedInstructor ? 'bg-blue-600/30 border border-blue-500/50' : 'bg-neutral-800 hover:bg-neutral-700 border border-transparent'}`}
              >
                {instructor.avatar ? (
                  <img 
                    src={instructor.avatar} 
                    alt={instructor.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {instructor.name.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <div className="text-sm font-medium text-white">{instructor.name}</div>
                  <UserRoleBadge role={instructor.role} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* 当前筛选条件提示 */}
      {(filter !== 'all' || timeFilter !== 'all' || selectedTag !== null || searchQuery !== '') && (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-3 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-neutral-400">当前筛选:</span>
            {filter !== 'all' && (
              <span className="text-xs px-2 py-1 bg-neutral-800 rounded-full text-neutral-300">
                {filter === 'resolved' && '已解决'}
                {filter === 'unresolved' && '未解决'}
                {filter === 'instructor-replies' && !selectedInstructor && '讲师回复'}
                {filter === 'instructor-replies' && selectedInstructor && `${users[selectedInstructor]?.name || '讲师'}的回复`}
                {filter === 'my-questions' && '我的问题'}
              </span>
            )}
            {timeFilter !== 'all' && (
              <span className="text-xs px-2 py-1 bg-neutral-800 rounded-full text-neutral-300">
                {timeFilter === 'today' && '今天'}
                {timeFilter === 'this-week' && '本周'}
                {timeFilter === 'this-month' && '本月'}
              </span>
            )}
            {selectedTag && (
              <span className="text-xs px-2 py-1 bg-neutral-800 rounded-full text-neutral-300">
                标签: {selectedTag}
              </span>
            )}
            {searchQuery && (
              <span className="text-xs px-2 py-1 bg-neutral-800 rounded-full text-neutral-300">
                搜索: {searchQuery}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* 讨论列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin mr-2 h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span>加载中...</span>
        </div>
      ) : filteredDiscussions.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center">
          <MessageSquare size={48} className="mx-auto mb-4 text-neutral-700" />
          <h3 className="text-xl font-bold mb-2">暂无讨论</h3>
          <p className="text-neutral-400 mb-6">
            {searchQuery || filter !== 'all' || timeFilter !== 'all' || selectedTag ? 
              '没有符合当前筛选条件的讨论，请尝试调整筛选条件。' : 
              '成为第一个提问的人吧！'
            }
          </p>
          {searchQuery || filter !== 'all' || timeFilter !== 'all' || selectedTag ? (
            <button
              onClick={() => {
                setFilter('all');
                setTimeFilter('all');
                setSelectedTag(null);
                setSearchQuery('');
              }}
              className="px-6 py-2 bg-red-600/20 text-red-400 font-medium rounded-lg hover:bg-red-600/30 transition-colors"
            >
              清除筛选
            </button>
          ) : (
            <button
              onClick={() => setShowNewQuestion(true)}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              提出问题
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDiscussions.map(question => {
            const isSelected = selectedQuestion === question.id;
            const questionUser = users[question.userId];
            
            return (
              <div key={question.id} className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                {/* 问题标题和基本信息 */}
                <div 
                  className="p-4 cursor-pointer hover:bg-neutral-800/50 transition-colors"
                  onClick={() => handleSelectQuestion(question.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* 用户头像 */}
                    {questionUser && <UserAvatar user={questionUser} />}
                    
                    {/* 问题内容 */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        {questionUser && (
                          <span className="font-medium">{questionUser.name}</span>
                        )}
                        {questionUser && <UserRoleBadge role={questionUser.role} />}
                        <span className="text-sm text-neutral-500">{formatDate(question.createdAt)}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2">{question.title}</h3>
                      
                      <p className="text-neutral-300 mb-3 line-clamp-2">{question.content}</p>
                      
                      {/* 标签 */}
                      {question.tags && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {question.tags.map((tag, index) => (
                            <button 
                              key={index} 
                              className={`px-2 py-0.5 text-xs rounded-full transition-colors ${selectedTag === tag ? 'bg-blue-600/30 text-blue-400' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-200'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTag(selectedTag === tag ? null : tag);
                              }}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* 问题状态和操作 */}
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(question.id);
                          }}
                          className={`flex items-center gap-1 text-sm ${question.isLiked ? 'text-blue-400' : 'text-neutral-400 hover:text-white'} transition-colors`}
                        >
                          <ThumbsUp size={16} />
                          <span>{question.likes}</span>
                        </button>
                        
                        <button className="flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors">
                          <MessageSquare size={16} />
                          <span>{question.commentsCount}</span>
                        </button>
                        
                        {question.isResolved && (
                          <span className="flex items-center gap-1 text-sm text-green-500">
                            <CheckCircle size={16} />
                            <span>已解决</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 评论区 */}
                {isSelected && (
                  <div className="border-t border-neutral-800 p-4">
                    {/* 问题操作按钮 */}
                    {(question.userId === currentUser.id || currentUser.role === 'instructor' || currentUser.role === 'admin') && (
                      <div className="flex justify-end gap-2 mb-4">
                        <button
                          onClick={() => handleToggleResolved(question.id)}
                          className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                            question.isResolved 
                              ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                          }`}
                        >
                          {question.isResolved ? '标记为未解决' : '标记为已解决'}
                        </button>
                      </div>
                    )}
                    
                    {/* 评论列表 */}
                    {question.comments && question.comments.length > 0 ? (
                      <div className="space-y-4 mb-4">
                        {question.comments.map(comment => {
                          const commentUser = users[comment.userId];
                          const isEditing = editingComment === comment.id;
                          const canEdit = comment.userId === currentUser.id;
                          const canDelete = comment.userId === currentUser.id || currentUser.role === 'instructor' || currentUser.role === 'admin';
                          
                          // 检查评论是否来自讲师
                          const isInstructorComment = (commentUser && commentUser.role === 'instructor') || comment.isInstructorResponse;
                          
                          return (
                            <div key={comment.id} className={`p-3 rounded-lg relative ${isInstructorComment ? 'bg-blue-600/10 border border-blue-600/30' : 'bg-neutral-800'}`}>
                              {isInstructorComment && (
                                <div className="absolute -right-1 top-0 transform translate-x-0 -translate-y-1/2">
                                  <div className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">讲师回复</div>
                                </div>
                              )}
                              <div className="flex items-start gap-3">
                                {/* 用户头像 */}
                                {commentUser && <UserAvatar user={commentUser} />}
                                
                                {/* 评论内容 */}
                                <div className="flex-grow">
                                  <div className="flex items-center gap-2 mb-1">
                                    {commentUser && (
                                      <span className="font-medium">{commentUser.name}</span>
                                    )}
                                    {commentUser && <UserRoleBadge role={commentUser.role} />}
                                    <span className="text-sm text-neutral-500">{formatDate(comment.createdAt)}</span>
                                    {comment.updatedAt && (
                                      <span className="text-xs text-neutral-500">(已编辑)</span>
                                    )}
                                  </div>
                                  
                                  {isEditing ? (
                                    <div className="mb-2">
                                      <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                                      />
                                      <div className="flex justify-end gap-2 mt-2">
                                        <button
                                          onClick={() => setEditingComment(null)}
                                          className="px-3 py-1 text-sm bg-transparent text-neutral-300 hover:text-white transition-colors"
                                        >
                                          取消
                                        </button>
                                        <button
                                          onClick={() => handleEditComment(question.id, comment.id)}
                                          disabled={!editContent.trim()}
                                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          保存
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-neutral-300 whitespace-pre-wrap mb-2">
                                      {comment.content}
                                    </div>
                                  )}
                                  
                                  {/* 评论操作 */}
                                  <div className="flex items-center gap-3">
                                    <button 
                                      onClick={() => handleCommentLike(question.id, comment.id)}
                                      className={`flex items-center gap-1 text-sm ${comment.isLiked ? 'text-blue-400' : 'text-neutral-400 hover:text-white'} transition-colors`}
                                    >
                                      <ThumbsUp size={14} />
                                      <span>{comment.likes}</span>
                                    </button>
                                    
                                    {canEdit && !isEditing && (
                                      <button 
                                        onClick={() => {
                                          setEditingComment(comment.id);
                                          setEditContent(comment.content);
                                        }}
                                        className="flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors"
                                      >
                                        <Edit size={14} />
                                        <span>编辑</span>
                                      </button>
                                    )}
                                    
                                    {canDelete && !isEditing && (
                                      <button 
                                        onClick={() => handleDeleteComment(question.id, comment.id)}
                                        className="flex items-center gap-1 text-sm text-neutral-400 hover:text-red-400 transition-colors"
                                      >
                                        <Trash2 size={14} />
                                        <span>删除</span>
                                      </button>
                                    )}
                                    
                                    <button className="flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors ml-auto">
                                      <Flag size={14} />
                                      <span>举报</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-neutral-500">
                        暂无评论，成为第一个回复的人吧！
                      </div>
                    )}
                    
                    {/* 添加评论 */}
                    <div className="flex items-start gap-3">
                      <UserAvatar user={currentUser} />
                      <div className="flex-grow">
                        <textarea
                          ref={commentInputRef}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="添加评论..."
                          rows={3}
                          className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleAddComment(question.id)}
                            disabled={!newComment.trim()}
                            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <Send size={16} />
                            发送
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseDiscussion;