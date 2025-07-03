import { NextRequest, NextResponse } from 'next/server';
import { generateWithOpenRouter } from '@/lib/openRouterService';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantRequest {
  message: string;
  history: Message[];
}

interface AIAssistantResponse {
  response: string;
  suggestions?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { message, history }: AIAssistantRequest = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '消息内容不能为空' },
        { status: 400 }
      );
    }

    // 创建Supabase客户端
    const supabase = createRouteHandlerClient({ cookies });

    // 获取用户信息（可选）
    const { data: { user } } = await supabase.auth.getUser();

    // 构建对话上下文
    const conversationContext = history
      .slice(-5) // 只保留最近5条消息
      .map(msg => `${msg.type === 'user' ? '用户' : 'AI助手'}: ${msg.content}`)
      .join('\n');

    // 构建系统提示词
    const systemPrompt = `你是AI Navigator Pro的智能助手，专门帮助用户寻找和了解AI工具。你的职责包括：

1. 推荐适合用户需求的AI工具
2. 比较不同AI工具的优缺点
3. 解答关于AI工具的问题
4. 提供AI工具的使用建议

请遵循以下原则：
- 回答要准确、有用、简洁
- 优先推荐免费或性价比高的工具
- 根据用户的具体需求提供个性化建议
- 如果不确定，可以建议用户浏览我们的工具目录
- 保持友好和专业的语调

当前对话历史：
${conversationContext}`;

    // 构建用户提示词
    const userPrompt = `用户问题：${message}

请根据用户的问题提供有用的回答，并在适当时推荐相关的AI工具。`;

    // 调用OpenRouter API生成回复
    const aiResponse = await generateWithOpenRouter(
      userPrompt,
      systemPrompt,
      'openai/gpt-4',
      0.7,
      1000
    );

    // 生成建议问题
    const suggestions = generateSuggestions(message, aiResponse);

    // 记录对话（可选）
    if (user) {
      try {
        await supabase
          .from('ai_conversations')
          .insert({
            user_id: user.id,
            user_message: message,
            ai_response: aiResponse,
            created_at: new Date().toISOString()
          });
      } catch (error) {
        console.error('记录对话失败:', error);
        // 不影响主要功能，继续执行
      }
    }

    const response: AIAssistantResponse = {
      response: aiResponse,
      suggestions
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI助手API错误:', error);
    
    // 返回友好的错误消息
    return NextResponse.json(
      {
        response: '抱歉，我现在无法回答您的问题。请稍后再试，或者您可以浏览我们的工具目录寻找需要的AI工具。',
        suggestions: [
          '浏览所有AI工具',
          '查看热门工具推荐',
          '搜索特定类型的工具',
          '了解工具使用教程'
        ]
      },
      { status: 200 } // 返回200状态码，避免前端显示错误
    );
  }
}

/**
 * 根据用户消息和AI回复生成建议问题
 */
function generateSuggestions(userMessage: string, aiResponse: string): string[] {
  const suggestions: string[] = [];
  
  // 根据关键词生成相关建议
  const keywords = userMessage.toLowerCase();
  
  if (keywords.includes('图像') || keywords.includes('图片') || keywords.includes('设计')) {
    suggestions.push('推荐更多图像生成工具', '比较不同的AI设计工具');
  }
  
  if (keywords.includes('写作') || keywords.includes('文本') || keywords.includes('内容')) {
    suggestions.push('推荐AI写作助手', '了解内容创作工具');
  }
  
  if (keywords.includes('代码') || keywords.includes('编程') || keywords.includes('开发')) {
    suggestions.push('查看编程辅助工具', '比较代码生成工具');
  }
  
  if (keywords.includes('免费') || keywords.includes('价格') || keywords.includes('费用')) {
    suggestions.push('寻找更多免费工具', '了解工具定价策略');
  }
  
  // 通用建议
  const generalSuggestions = [
    '查看最新AI工具',
    '浏览热门工具排行',
    '了解工具使用技巧',
    '比较类似工具'
  ];
  
  // 如果没有特定建议，添加通用建议
  if (suggestions.length === 0) {
    suggestions.push(...generalSuggestions.slice(0, 2));
  } else if (suggestions.length < 4) {
    // 补充通用建议到4个
    const remaining = 4 - suggestions.length;
    suggestions.push(...generalSuggestions.slice(0, remaining));
  }
  
  return suggestions.slice(0, 4); // 最多返回4个建议
}