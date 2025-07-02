'use client';

import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, ArrowPathIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 初始化一个默认对话
  useEffect(() => {
    if (conversations.length === 0) {
      const newConversation = createNewConversation();
      setConversations([newConversation]);
      setActiveConversation(newConversation.id);
    }
  }, []);
  
  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation, conversations]);
  
  // 创建新对话
  const createNewConversation = (): Conversation => {
    return {
      id: Date.now().toString(),
      title: '新对话',
      messages: [
        {
          role: 'system',
          content: '我是 AI Navigator Pro 的智能助手，很高兴为您提供帮助。您可以向我询问有关 AI 工具、技术和应用的问题，或者寻求任何其他方面的帮助。',
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };
  
  // 获取当前活跃对话
  const getCurrentConversation = (): Conversation | undefined => {
    return conversations.find(conv => conv.id === activeConversation);
  };
  
  // 发送消息
  const sendMessage = async () => {
    if (!inputMessage.trim() || !activeConversation) return;
    
    const currentConv = getCurrentConversation();
    if (!currentConv) return;
    
    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    // 更新对话
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          messages: [...conv.messages, userMessage],
          updatedAt: new Date(),
          // 如果是第一条用户消息，更新对话标题
          title: conv.messages.filter(m => m.role === 'user').length === 0 
            ? inputMessage.slice(0, 30) + (inputMessage.length > 30 ? '...' : '')
            : conv.title
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // 模拟 AI 响应
      setTimeout(() => {
        const aiResponse = generateAIResponse(inputMessage);
        const assistantMessage: Message = {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        };
        
        // 更新对话
        const finalConversations = updatedConversations.map(conv => {
          if (conv.id === activeConversation) {
            return {
              ...conv,
              messages: [...conv.messages, assistantMessage],
              updatedAt: new Date()
            };
          }
          return conv;
        });
        
        setConversations(finalConversations);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };
  
  // 模拟 AI 响应生成
  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      `感谢您的问题！关于"${userMessage.slice(0, 30)}${userMessage.length > 30 ? '...' : ''}"，我可以提供以下信息：\n\n根据最新的研究和数据，AI 技术在这一领域已经取得了显著进展。许多企业和研究机构正在开发创新解决方案，以解决您提到的挑战。\n\n您可能会对我们平台上的相关 AI 工具感兴趣，它们专门设计用于解决类似问题。我建议您查看我们的工具目录，了解更多详情。`,
      
      `这是一个很好的问题！"${userMessage.slice(0, 30)}${userMessage.length > 30 ? '...' : ''}"是许多人关注的话题。\n\n从技术角度来看，现代 AI 模型如 GPT-4、Claude 和 Gemini 已经能够处理这类任务，并提供相当准确的结果。然而，重要的是要记住，这些工具仍有其局限性，应该作为辅助工具而非完全替代人类判断。\n\n如果您想深入了解，我们的教程部分有一些相关资源可能对您有所帮助。`,
      
      `关于"${userMessage.slice(0, 30)}${userMessage.length > 30 ? '...' : ''}"，这是一个复杂的话题，涉及多个方面。\n\n首先，值得注意的是，AI 技术在这一领域的应用正在迅速发展。从基础模型到专业化工具，市场上有各种解决方案可以满足不同需求。\n\n其次，在选择合适的工具时，考虑因素包括：易用性、功能集、价格、集成能力和支持质量。我们的平台提供了详细的工具比较，可以帮助您做出明智的决定。\n\n最后，不要忘记考虑伦理和隐私问题，特别是在处理敏感数据时。`,
      
      `您提到的"${userMessage.slice(0, 30)}${userMessage.length > 30 ? '...' : ''}"是一个热门话题。\n\n根据我的了解，目前市场上有几种领先的 AI 工具可以帮助解决这类问题。每种工具都有其独特的优势和适用场景。\n\n例如，一些工具专注于易用性和快速部署，而其他工具则提供更高级的功能和定制选项。您的具体需求和技术背景将决定哪种工具最适合您。\n\n我建议您查看我们的工具目录和比较指南，以获取更详细的信息。如果您有更具体的问题，请随时提问！`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  // 开始新对话
  const startNewConversation = () => {
    const newConversation = createNewConversation();
    setConversations([...conversations, newConversation]);
    setActiveConversation(newConversation.id);
    setInputMessage('');
  };
  
  // 切换对话
  const switchConversation = (id: string) => {
    setActiveConversation(id);
  };
  
  // 删除对话
  const deleteConversation = (id: string) => {
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    setConversations(updatedConversations);
    
    // 如果删除的是当前活跃对话，切换到另一个对话或创建新对话
    if (id === activeConversation) {
      if (updatedConversations.length > 0) {
        setActiveConversation(updatedConversations[0].id);
      } else {
        const newConversation = createNewConversation();
        setConversations([newConversation]);
        setActiveConversation(newConversation.id);
      }
    }
  };
  
  // 格式化消息内容（简单处理换行符）
  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };
  
  // 格式化时间
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const currentConversation = getCurrentConversation();
  const userMessages = currentConversation?.messages.filter(m => m.role === 'user') || [];
  
  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* 侧边栏 */}
      <div className={`bg-neutral-900 border-r border-neutral-800 flex flex-col w-80 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0'}`}>
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">对话历史</h2>
          <button 
            onClick={startNewConversation}
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="新对话"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto py-2 px-2 space-y-1">
          {conversations.map(conv => (
            <div 
              key={conv.id} 
              className={`flex items-center justify-between rounded-md px-3 py-2 cursor-pointer group ${activeConversation === conv.id ? 'bg-neutral-800' : 'hover:bg-neutral-800/50'}`}
              onClick={() => switchConversation(conv.id)}
            >
              <div className="truncate flex-grow">
                <p className="text-white truncate">{conv.title}</p>
                <p className="text-neutral-500 text-xs">
                  {userMessages.length} 条消息 · {new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(conv.updatedAt)}
                </p>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                className="p-1 rounded-md hover:bg-neutral-700 text-neutral-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="删除对话"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* 聊天区域 */}
      <div className="flex-grow flex flex-col bg-neutral-950 relative">
        {/* 移动端侧边栏切换按钮 */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden absolute top-4 left-4 z-10 p-1.5 rounded-md bg-neutral-800 text-white"
        >
          {isSidebarOpen ? <XMarkIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
        </button>
        
        {/* 消息区域 */}
        <div className="flex-grow overflow-y-auto p-4 space-y-6">
          {currentConversation?.messages.map((message, index) => {
            // 跳过系统消息
            if (message.role === 'system') return null;
            
            return (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-200'}`}>
                  <div className="text-sm">{formatMessageContent(message.content)}</div>
                  <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-300' : 'text-neutral-500'} text-right`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl p-4 bg-neutral-800 text-neutral-200">
                <div className="flex items-center space-x-2">
                  <ArrowPathIcon className="w-4 h-4 animate-spin text-neutral-400" />
                  <span className="text-neutral-400">AI 正在思考...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* 输入区域 */}
        <div className="border-t border-neutral-800 p-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="输入消息..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-3 px-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none h-12 max-h-32 overflow-y-auto"
                rows={1}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={`p-3 rounded-full ${!inputMessage.trim() || isLoading ? 'bg-neutral-800 text-neutral-600' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-neutral-600 text-xs mt-2 text-center">
            AI 助手仅用于演示目的，回复为预设内容。在实际产品中，这将连接到真实的 AI 模型。
          </p>
        </div>
      </div>
    </div>
  );
}

// SEO 元数据已移至 metadata.ts 文件