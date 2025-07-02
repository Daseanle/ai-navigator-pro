'use client';

import { useState } from 'react';
import { MessageSquare, ThumbsUp, Flag, Reply, MoreHorizontal, Send } from 'lucide-react';

type User = {
  id: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'admin' | 'moderator';
};

type Comment = {
  id: string;
  user: User;
  content: string;
  createdAt: string;
  likes: number;
  liked?: boolean;
  replies?: Comment[];
};

type CommunityDiscussionProps = {
  toolId?: string;
  toolName?: string;
  initialComments?: Comment[];
  currentUser?: User | null;
  className?: string;
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' });
};

// 单条评论组件
const CommentItem = ({ 
  comment, 
  currentUser, 
  onReply,
  onLike,
  depth = 0 
}: { 
  comment: Comment; 
  currentUser: User | null;
  onReply: (commentId: string) => void;
  onLike: (commentId: string) => void;
  depth?: number;
}) => {
  const [showReplies, setShowReplies] = useState(depth === 0);
  
  // 获取用户角色标签
  const getRoleBadge = (role?: 'user' | 'admin' | 'moderator') => {
    if (!role || role === 'user') return null;
    
    const badges = {
      admin: { text: '管理员', class: 'bg-red-500' },
      moderator: { text: '版主', class: 'bg-blue-500' }
    };
    
    const badge = badges[role];
    
    return (
      <span className={`${badge.class} text-white text-xs px-1.5 py-0.5 rounded ml-2`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className={`${depth > 0 ? 'ml-12 mt-4' : 'mb-6'}`}>
      <div className="flex gap-4">
        {/* 用户头像 */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white overflow-hidden">
          {comment.user.avatar ? (
            <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full object-cover" />
          ) : (
            comment.user.name.charAt(0).toUpperCase()
          )}
        </div>
        
        {/* 评论内容 */}
        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-medium text-white">{comment.user.name}</span>
            {getRoleBadge(comment.user.role)}
            <span className="text-neutral-500 text-sm ml-2">{formatDate(comment.createdAt)}</span>
          </div>
          
          <div className="mt-2 text-neutral-300">
            {comment.content}
          </div>
          
          {/* 评论操作 */}
          <div className="mt-3 flex items-center gap-4 text-sm">
            <button 
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 ${comment.liked ? 'text-blue-400' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              <ThumbsUp size={14} />
              <span>{comment.likes}</span>
            </button>
            
            <button 
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 text-neutral-500 hover:text-neutral-300"
            >
              <Reply size={14} />
              <span>回复</span>
            </button>
            
            <button className="flex items-center gap-1 text-neutral-500 hover:text-neutral-300">
              <Flag size={14} />
              <span>举报</span>
            </button>
            
            <div className="relative group">
              <button className="flex items-center text-neutral-500 hover:text-neutral-300">
                <MoreHorizontal size={14} />
              </button>
              <div className="absolute right-0 mt-1 w-32 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700">
                  复制链接
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700">
                  屏蔽用户
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 回复区域 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {!showReplies ? (
            <button 
              onClick={() => setShowReplies(true)}
              className="ml-14 text-sm text-blue-400 hover:text-blue-300"
            >
              查看 {comment.replies.length} 条回复
            </button>
          ) : (
            <div className="space-y-4">
              {comment.replies.map(reply => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  currentUser={currentUser}
                  onReply={onReply}
                  onLike={onLike}
                  depth={depth + 1} 
                />
              ))}
              
              {comment.replies.length > 3 && (
                <button 
                  onClick={() => setShowReplies(false)}
                  className="ml-14 text-sm text-neutral-500 hover:text-neutral-300"
                >
                  收起回复
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function CommunityDiscussion({
  toolId,
  toolName,
  initialComments = [],
  currentUser = null,
  className = ''
}: CommunityDiscussionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // 处理评论提交
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    if (!currentUser) {
      // 提示用户登录
      alert('请先登录后再发表评论');
      return;
    }
    
    // 创建新评论
    const comment: Comment = {
      id: `temp-${Date.now()}`,
      user: currentUser,
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      liked: false
    };
    
    // 如果是回复，则添加到对应评论的回复列表中
    if (replyingTo) {
      setComments(prevComments => {
        return prevComments.map(c => {
          if (c.id === replyingTo) {
            return {
              ...c,
              replies: [...(c.replies || []), comment]
            };
          }
          return c;
        });
      });
      setReplyingTo(null);
    } else {
      // 否则添加为新评论
      setComments(prevComments => [comment, ...prevComments]);
    }
    
    // 清空输入框
    setNewComment('');
  };
  
  // 处理点赞
  const handleLike = (commentId: string) => {
    if (!currentUser) {
      alert('请先登录后再点赞');
      return;
    }
    
    setComments(prevComments => {
      return prevComments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: c.liked ? c.likes - 1 : c.likes + 1,
            liked: !c.liked
          };
        }
        
        // 检查回复中是否有匹配的评论
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => {
              if (r.id === commentId) {
                return {
                  ...r,
                  likes: r.liked ? r.likes - 1 : r.likes + 1,
                  liked: !r.liked
                };
              }
              return r;
            })
          };
        }
        
        return c;
      });
    });
  };
  
  // 处理回复
  const handleReply = (commentId: string) => {
    if (!currentUser) {
      alert('请先登录后再回复');
      return;
    }
    
    setReplyingTo(commentId);
    // 找到评论作者名称
    const comment = comments.find(c => c.id === commentId) || 
                   comments.flatMap(c => c.replies || []).find(r => r.id === commentId);
    
    if (comment) {
      setNewComment(`@${comment.user.name} `);
      // 聚焦输入框
      document.getElementById('comment-input')?.focus();
    }
  };

  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={20} className="text-blue-400" />
        <h3 className="text-xl font-bold text-white">
          {toolName ? `关于 ${toolName} 的讨论` : '社区讨论'}
        </h3>
        <span className="text-neutral-500 text-sm ml-2">{comments.length} 条评论</span>
      </div>
      
      {/* 评论输入框 */}
      <div className="mb-8">
        {replyingTo && (
          <div className="flex justify-between items-center mb-2 bg-blue-900/20 text-blue-400 text-sm px-3 py-1.5 rounded">
            <span>正在回复评论</span>
            <button 
              onClick={() => {
                setReplyingTo(null);
                setNewComment('');
              }}
              className="text-neutral-400 hover:text-white"
            >
              取消
            </button>
          </div>
        )}
        
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white overflow-hidden">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : currentUser ? (
              currentUser.name.charAt(0).toUpperCase()
            ) : (
              '?'
            )}
          </div>
          
          <div className="flex-1 relative">
            <textarea
              id="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={currentUser ? '分享你的想法...' : '请先登录后再评论'}
              disabled={!currentUser}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white resize-none min-h-[80px]"
            />
            
            <button
              onClick={handleSubmitComment}
              disabled={!currentUser || !newComment.trim()}
              className="absolute bottom-3 right-3 p-2 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        
        {!currentUser && (
          <div className="mt-2 text-center">
            <a href="/login" className="text-blue-400 hover:text-blue-300 text-sm">
              登录后参与讨论
            </a>
          </div>
        )}
      </div>
      
      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            暂无评论，成为第一个发表评论的人吧！
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              currentUser={currentUser}
              onReply={handleReply}
              onLike={handleLike}
            />
          ))
        )}
      </div>
    </div>
  );
}