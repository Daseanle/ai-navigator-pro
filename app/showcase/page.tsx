'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import CommunityDiscussion from '@/components/CommunityDiscussion';
import ToolComparison from '@/components/ToolComparison';
import ToolTutorial from '@/components/ToolTutorial';
import UseCaseShowcase from '@/components/UseCaseShowcase';
import TrendAnalysis from '@/components/TrendAnalysis';
import RatingSystem from '@/components/RatingSystem';
import AINewsletterSubscription from '@/components/AINewsletterSubscription';
import SmartRecommendation from '@/components/SmartRecommendation';

export default function ShowcasePage() {
  // 模拟当前用户
  const [currentUser] = useState({
    id: 'user-1',
    name: '测试用户',
    role: 'user' as const
  });

  // 模拟评论数据
  const mockComments = [
    {
      id: 'comment-1',
      user: {
        id: 'user-2',
        name: 'AI爱好者',
        role: 'user' as const
      },
      content: 'ChatGPT的功能非常强大，但是在处理复杂数学问题时还是有些局限性。希望未来的版本能够改进这一点。',
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      likes: 5,
      liked: false,
      replies: [
        {
          id: 'reply-1',
          user: {
            id: 'user-3',
            name: '数据科学家',
            role: 'user' as const
          },
          content: '同意你的观点，我在使用过程中也发现了这个问题。不过可以尝试将复杂问题拆分成小步骤，这样效果会好很多。',
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          likes: 3,
          liked: true
        },
        {
          id: 'reply-2',
          user: {
            id: 'admin-1',
            name: '站长',
            role: 'admin' as const
          },
          content: '感谢分享！我们正在整理一份关于如何优化AI工具使用的指南，很快会发布在网站上。',
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          likes: 2,
          liked: false
        }
      ]
    },
    {
      id: 'comment-2',
      user: {
        id: 'user-4',
        name: '设计师小王',
        role: 'user' as const
      },
      content: '我最近开始使用Midjourney生成设计灵感，效果出乎意料的好！强烈推荐给其他设计师。',
      createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
      likes: 8,
      liked: true,
      replies: []
    }
  ];

  // 模拟工具对比数据
  const mockTools = [
    {
      id: 'tool-1',
      name: 'ChatGPT',
      logo: '/images/tools/chatgpt.svg',
      pricing: {
        free: true,
        freeTrial: false,
        startingPrice: '$20',
        hasPremium: true
      },
      rating: 4.8,
      url: 'https://chat.openai.com'
    },
    {
      id: 'tool-2',
      name: 'Claude',
      logo: '/images/tools/claude.svg',
      pricing: {
        free: true,
        freeTrial: false,
        startingPrice: '$20',
        hasPremium: true
      },
      rating: 4.6,
      url: 'https://claude.ai'
    },
    {
      id: 'tool-3',
      name: 'Midjourney',
      logo: '/images/tools/midjourney.svg',
      pricing: {
        free: false,
        freeTrial: true,
        startingPrice: '$10',
        hasPremium: true
      },
      rating: 4.7,
      url: 'https://midjourney.com'
    },
    {
      id: 'tool-4',
      name: 'DALL-E',
      logo: '/images/tools/dalle.svg',
      pricing: {
        free: false,
        freeTrial: true,
        startingPrice: '$15',
        hasPremium: true
      },
      rating: 4.5,
      url: 'https://openai.com/dall-e-3'
    },
    {
      id: 'tool-5',
      name: 'Stable Diffusion',
      logo: '/images/tools/stable-diffusion.svg',
      pricing: {
        free: true,
        freeTrial: false,
        startingPrice: undefined,
        hasPremium: false
      },
      rating: 4.4,
      url: 'https://stability.ai'
    }
  ];

  const mockFeatures = [
    {
      id: 'feature-1',
      name: '免费版本',
      description: '提供基础功能的免费版本或层级',
      category: '定价与可访问性'
    },
    {
      id: 'feature-2',
      name: 'API访问',
      description: '提供开发者API以集成到其他应用程序中',
      category: '开发者功能'
    },
    {
      id: 'feature-3',
      name: '多语言支持',
      description: '支持多种语言的输入和输出',
      category: '语言能力'
    },
    {
      id: 'feature-4',
      name: '代码生成',
      description: '能够生成和理解编程代码',
      category: '开发者功能'
    },
    {
      id: 'feature-5',
      name: '图像生成',
      description: '从文本描述生成图像的能力',
      category: '创意与设计'
    },
    {
      id: 'feature-6',
      name: '图像编辑',
      description: '编辑和修改现有图像的能力',
      category: '创意与设计'
    },
    {
      id: 'feature-7',
      name: '移动应用',
      description: '提供iOS和Android移动应用',
      category: '平台支持'
    },
    {
      id: 'feature-8',
      name: '插件系统',
      description: '支持第三方插件或扩展',
      category: '开发者功能'
    }
  ];

  const mockToolFeatures = [
    // ChatGPT特性
    { toolId: 'tool-1', featureId: 'feature-1', supported: true },
    { toolId: 'tool-1', featureId: 'feature-2', supported: true },
    { toolId: 'tool-1', featureId: 'feature-3', supported: true },
    { toolId: 'tool-1', featureId: 'feature-4', supported: true, notes: '代码解释器' },
    { toolId: 'tool-1', featureId: 'feature-5', supported: true, notes: 'DALL-E集成' },
    { toolId: 'tool-1', featureId: 'feature-6', supported: false },
    { toolId: 'tool-1', featureId: 'feature-7', supported: true },
    { toolId: 'tool-1', featureId: 'feature-8', supported: true, notes: 'GPTs' },
    
    // Claude特性
    { toolId: 'tool-2', featureId: 'feature-1', supported: true },
    { toolId: 'tool-2', featureId: 'feature-2', supported: true },
    { toolId: 'tool-2', featureId: 'feature-3', supported: true },
    { toolId: 'tool-2', featureId: 'feature-4', supported: true },
    { toolId: 'tool-2', featureId: 'feature-5', supported: false },
    { toolId: 'tool-2', featureId: 'feature-6', supported: false },
    { toolId: 'tool-2', featureId: 'feature-7', supported: true },
    { toolId: 'tool-2', featureId: 'feature-8', supported: false },
    
    // Midjourney特性
    { toolId: 'tool-3', featureId: 'feature-1', supported: false },
    { toolId: 'tool-3', featureId: 'feature-2', supported: true },
    { toolId: 'tool-3', featureId: 'feature-3', supported: true, notes: '仅英文' },
    { toolId: 'tool-3', featureId: 'feature-4', supported: false },
    { toolId: 'tool-3', featureId: 'feature-5', supported: true },
    { toolId: 'tool-3', featureId: 'feature-6', supported: true },
    { toolId: 'tool-3', featureId: 'feature-7', supported: false },
    { toolId: 'tool-3', featureId: 'feature-8', supported: false },
    
    // DALL-E特性
    { toolId: 'tool-4', featureId: 'feature-1', supported: false },
    { toolId: 'tool-4', featureId: 'feature-2', supported: true },
    { toolId: 'tool-4', featureId: 'feature-3', supported: true },
    { toolId: 'tool-4', featureId: 'feature-4', supported: false },
    { toolId: 'tool-4', featureId: 'feature-5', supported: true },
    { toolId: 'tool-4', featureId: 'feature-6', supported: true, notes: '编辑和扩展' },
    { toolId: 'tool-4', featureId: 'feature-7', supported: false },
    { toolId: 'tool-4', featureId: 'feature-8', supported: false },
    
    // Stable Diffusion特性
    { toolId: 'tool-5', featureId: 'feature-1', supported: true, notes: '开源' },
    { toolId: 'tool-5', featureId: 'feature-2', supported: true },
    { toolId: 'tool-5', featureId: 'feature-3', supported: true },
    { toolId: 'tool-5', featureId: 'feature-4', supported: false },
    { toolId: 'tool-5', featureId: 'feature-5', supported: true },
    { toolId: 'tool-5', featureId: 'feature-6', supported: true, notes: '通过ControlNet' },
    { toolId: 'tool-5', featureId: 'feature-7', supported: false },
    { toolId: 'tool-5', featureId: 'feature-8', supported: true, notes: '模型和插件' }
  ];

  // 模拟教程步骤
  const mockTutorialSteps = [
    {
      id: 'step-1',
      title: '注册账号',
      description: '访问ChatGPT官方网站(https://chat.openai.com)，点击"Sign Up"按钮创建一个新账号。你可以使用电子邮件、Google或Microsoft账号进行注册。完成注册后，你将收到一封验证邮件，点击邮件中的链接完成验证。',
      image: '/images/tutorials/chatgpt-signup.svg',
      tips: [
        '如果你已经有OpenAI账号，可以直接登录',
        '建议使用Gmail或Outlook邮箱注册，以避免可能的验证问题',
        '某些地区可能需要使用VPN才能访问服务'
      ]
    },
    {
      id: 'step-2',
      title: '了解界面',
      description: '登录后，你将看到ChatGPT的主界面。左侧是对话历史记录，中间是当前对话区域，顶部可以选择不同的GPT模型版本。在输入框中，你可以输入问题或指令，然后按回车键或点击发送按钮提交。',
      image: '/images/tutorials/chatgpt-interface.svg'
    },
    {
      id: 'step-3',
      title: '提问技巧',
      description: '提问的方式会极大影响ChatGPT的回答质量。尽量提供具体、清晰的问题，并包含必要的上下文信息。对于复杂问题，可以分步骤提问，或者明确指出你期望的回答格式和深度。',
      tips: [
        '使用"扮演角色"提示可以获得特定视角的回答',
        '明确指定回答的格式（如列表、表格、代码等）',
        '如果回答不满意，可以要求ChatGPT重新思考或提供更详细的解释'
      ]
    },
    {
      id: 'step-4',
      title: '使用高级提示词',
      description: '掌握提示词工程（Prompt Engineering）技巧可以显著提高ChatGPT的输出质量。例如，你可以使用"Chain of Thought"（思维链）技术，要求ChatGPT一步步思考问题；或者使用"Few-shot learning"（少样本学习），提供几个示例让ChatGPT理解你期望的输出格式。',
      code: {
        language: 'markdown',
        content: `# 思维链提示示例

请一步步思考以下问题：如果一个项目需要5名工程师工作10天完成，那么10名工程师需要多少天完成同样的项目？

# 少样本学习示例

请按照以下格式总结文章：

输入：苹果公司发布了新款iPhone，配备更快的处理器和更好的相机。
输出：主题：iPhone新品发布；要点：处理器升级，相机改进

输入：研究表明，每天锻炼30分钟可以显著改善心血管健康。
输出：主题：锻炼与健康；要点：每日30分钟，改善心血管

输入：[你的文章内容]`
      }
    },
    {
      id: 'step-5',
      title: '使用GPTs和插件',
      description: 'ChatGPT Plus用户可以访问GPT商店，使用专门为特定任务定制的GPT模型。此外，你还可以使用各种插件扩展ChatGPT的功能，如网页浏览、数据分析、图像生成等。这些工具可以大大增强ChatGPT的实用性。',
      image: '/images/tutorials/chatgpt-plugins.svg',
      tips: [
        'Browsing插件允许ChatGPT访问最新的网络信息',
        'DALL-E插件可以根据描述生成图像',
        '代码解释器插件可以执行Python代码，适合数据分析和可视化'
      ]
    }
  ];

  // 模拟用例数据
  const mockUseCases = [
    {
      id: 'usecase-1',
      title: '使用AI生成营销文案',
      description: '利用ChatGPT快速生成高质量的营销文案，包括产品描述、社交媒体帖子和电子邮件活动。',
      industry: '营销',
      difficulty: 'easy' as const,
      estimatedTime: '30分钟',
      steps: [
        {
          title: '定义目标受众和营销目标',
          description: '明确你的目标受众是谁，以及你希望通过这些文案达成什么目标（提高品牌认知度、增加销售等）。',
          tool: {
            id: 'tool-1',
            name: 'ChatGPT',
            logo: '/images/tools/chatgpt.svg',
            url: 'https://chat.openai.com'
          }
        },
        {
          title: '创建产品描述提示词',
          description: '为ChatGPT创建详细的提示词，包括产品特点、优势、目标受众和品牌语调。例如："为[产品名称]创建一个吸引人的产品描述，强调其[主要特点]，适合[目标受众]，使用[品牌语调]的语言风格。"',
          image: '/images/usecases/marketing-prompt.svg'
        },
        {
          title: '生成多个版本并优化',
          description: '要求ChatGPT生成多个不同版本的文案，然后根据你的喜好进行调整。你可以要求它使用不同的语调、长度或强调不同的产品特点。',
        },
        {
          title: '创建社交媒体内容计划',
          description: '使用ChatGPT创建一个完整的社交媒体内容计划，包括多个平台的帖子、最佳发布时间和主题标签建议。',
          tool: {
            id: 'tool-1',
            name: 'ChatGPT',
            logo: '/images/tools/chatgpt.svg',
            url: 'https://chat.openai.com'
          }
        }
      ],
      results: [
        '高质量、一致的品牌营销文案',
        '节省文案创作时间，提高营销效率',
        '可以快速生成多个创意版本进行A/B测试',
        '根据不同平台和受众定制内容'
      ]
    },
    {
      id: 'usecase-2',
      title: 'AI辅助产品设计可视化',
      description: '使用AI图像生成工具将产品概念快速转化为视觉设计，加速产品开发和原型设计过程。',
      industry: '产品设计',
      difficulty: 'medium' as const,
      estimatedTime: '2小时',
      steps: [
        {
          title: '创建产品概念文档',
          description: '详细描述你的产品概念，包括功能、目标用户、使用场景和设计风格偏好。',
          tool: {
            id: 'tool-1',
            name: 'ChatGPT',
            logo: '/images/tools/chatgpt.svg',
            url: 'https://chat.openai.com'
          }
        },
        {
          title: '生成产品设计提示词',
          description: '使用ChatGPT帮助创建详细的图像生成提示词，包括产品外观、材质、颜色、环境和视角等细节。',
          image: '/images/usecases/product-design-prompt.svg'
        },
        {
          title: '使用Midjourney生成产品概念图',
          description: '将优化后的提示词输入Midjourney，生成多个产品设计概念图。使用--v 5.2参数获得更高质量的结果，使用--ar 16:9等参数控制图像比例。',
          tool: {
            id: 'tool-3',
            name: 'Midjourney',
            logo: '/images/tools/midjourney.svg',
            url: 'https://midjourney.com'
          }
        },
        {
          title: '迭代和完善设计',
          description: '基于初始结果，调整提示词并生成更多变体。你可以使用Midjourney的变体功能(V按钮)或通过修改提示词来探索不同设计方向。',
          image: '/images/usecases/product-iterations.svg'
        }
      ],
      results: [
        '快速将文字概念转化为视觉设计',
        '在早期阶段探索多种设计可能性',
        '减少传统设计过程中的时间和成本',
        '提高团队沟通效率，确保设计方向一致'
      ]
    }
  ];

  // 模拟趋势数据
  const generateTrendData = (startValue: number, volatility: number, days: number) => {
    const data = [];
    let currentValue = startValue;
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // 添加一些随机波动
      const change = (Math.random() - 0.5) * 2 * volatility;
      currentValue = Math.max(0, currentValue + change);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(currentValue)
      });
    }
    
    return data;
  };
  
  // 模拟评分系统数据
  const mockRatingCriteria = [
    {
      id: 'criteria-1',
      name: '易用性',
      description: '工具的用户界面和交互设计是否直观、易于上手，无需复杂的学习过程',
      weight: 1.0
    },
    {
      id: 'criteria-2',
      name: '功能完整性',
      description: '工具提供的功能是否全面，能否满足用户在该领域的大部分需求',
      weight: 1.2
    },
    {
      id: 'criteria-3',
      name: '输出质量',
      description: '工具生成的内容或结果的质量、准确性和实用性',
      weight: 1.5
    },
    {
      id: 'criteria-4',
      name: '定价合理性',
      description: '工具的价格是否与其提供的价值相匹配，是否有合适的免费层级或试用选项',
      weight: 0.8
    },
    {
      id: 'criteria-5',
      name: '技术支持',
      description: '官方文档、教程、客服响应速度和质量',
      weight: 0.7
    }
  ];
  
  const mockExpertRatings = [
    { criteriaId: 'criteria-1', score: 4.5, comment: '界面简洁直观，新用户容易上手，但高级功能的发现性有待提高' },
    { criteriaId: 'criteria-2', score: 4.8, comment: '功能非常全面，几乎涵盖了所有常见的文本生成场景' },
    { criteriaId: 'criteria-3', score: 4.7, comment: '输出质量在大多数情况下都很高，但处理专业领域知识时偶有不准确' },
    { criteriaId: 'criteria-4', score: 4.0, comment: '免费版功能有限，付费版价格略高，但考虑到功能和质量，整体还算合理' },
    { criteriaId: 'criteria-5', score: 4.2, comment: '文档详尽，但客服响应时间有时较长' }
  ];
  
  const mockUserRatings = [
    {
      userId: 'user-101',
      userName: '内容创作者',
      userAvatar: '/images/avatars/user1.svg',
      overallScore: 5.0,
      comment: '作为一名内容创作者，ChatGPT极大地提高了我的工作效率。它帮助我克服写作瓶颈，生成创意点子，甚至协助我进行研究。强烈推荐给所有需要定期创作内容的人！',
      helpful: 24,
      date: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
    },
    {
      userId: 'user-102',
      userName: '程序员小李',
      userAvatar: '/images/avatars/user2.svg',
      overallScore: 4.5,
      comment: '作为开发者，我发现ChatGPT在解释代码、生成简单函数和调试方面非常有用。不过在处理复杂算法或特定框架的问题时，它的回答有时不够准确，需要谨慎验证。',
      helpful: 18,
      date: new Date(Date.now() - 3600000 * 24 * 12).toISOString()
    },
    {
      userId: 'user-103',
      userName: '学生党',
      overallScore: 4.0,
      comment: '帮助我理解复杂概念和准备作业，但有时会给出错误信息，需要交叉验证。免费版的限制也有点烦人。',
      helpful: 7,
      date: new Date(Date.now() - 3600000 * 24 * 20).toISOString()
    },
    {
      userId: 'user-104',
      userName: '营销经理',
      userAvatar: '/images/avatars/user3.svg',
      overallScore: 5.0,
      comment: '我们团队用它来生成营销文案和社交媒体内容，效果非常好！节省了大量时间，而且创意点子源源不断。',
      helpful: 15,
      date: new Date(Date.now() - 3600000 * 24 * 30).toISOString()
    }
  ];

  const mockTrends = [
    {
      id: 'trend-1',
      name: 'ChatGPT',
      category: '文本生成',
      currentRank: 1,
      previousRank: 1,
      growthRate: 0.15,
      searchVolume: generateTrendData(1000, 50, 30),
      userCount: generateTrendData(500, 30, 30)
    },
    {
      id: 'trend-2',
      name: 'Midjourney',
      category: '图像生成',
      currentRank: 2,
      previousRank: 3,
      growthRate: 0.28,
      searchVolume: generateTrendData(800, 60, 30),
      userCount: generateTrendData(400, 40, 30)
    },
    {
      id: 'trend-3',
      name: 'Claude',
      category: '文本生成',
      currentRank: 3,
      previousRank: 2,
      growthRate: 0.12,
      searchVolume: generateTrendData(700, 40, 30),
      userCount: generateTrendData(350, 25, 30)
    },
    {
      id: 'trend-4',
      name: 'DALL-E',
      category: '图像生成',
      currentRank: 4,
      previousRank: 5,
      growthRate: 0.18,
      searchVolume: generateTrendData(600, 45, 30),
      userCount: generateTrendData(300, 30, 30)
    },
    {
      id: 'trend-5',
      name: 'Stable Diffusion',
      category: '图像生成',
      currentRank: 5,
      previousRank: 4,
      growthRate: -0.05,
      searchVolume: generateTrendData(500, 30, 30),
      userCount: generateTrendData(250, 20, 30)
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">组件展示</h1>
      
      <div className="space-y-12">
        {/* 评分系统组件 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">评分系统</h2>
          <RatingSystem 
            toolName="ChatGPT"
            toolId="tool-1"
            expertRatings={mockExpertRatings}
            userRatings={mockUserRatings}
            ratingCriteria={mockRatingCriteria}
            currentUser={currentUser}
          />
        </section>
        
        {/* 智能推荐组件 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">智能推荐</h2>
          <SmartRecommendation 
            userId={currentUser?.id}
            title="为您推荐的AI工具"
            description="基于您的浏览历史和偏好，我们为您精选了以下AI工具"
            maxTools={4}
          />
        </section>
        
        {/* 新闻订阅组件 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">AI新闻订阅</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <AINewsletterSubscription 
                defaultEmail={currentUser ? `${currentUser.name}@example.com` : ''}
                defaultFrequency="weekly"
                defaultCategories={['ai-news', 'new-tools']}
                onSubscribe={async (email, frequency, categories) => {
                  console.log('订阅信息:', { email, frequency, categories });
                  return true;
                }}
              />
            </div>
            <div className="lg:col-span-1 flex items-center">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-full">
                <h3 className="text-xl font-bold text-white mb-4">订阅者专享权益</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 bg-blue-600/20 text-blue-400 p-1.5 rounded-full">
                      <Check size={16} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">抢先体验新工具</h4>
                      <p className="text-neutral-400 text-sm">获取最新AI工具的测试资格和邀请码</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 bg-blue-600/20 text-blue-400 p-1.5 rounded-full">
                      <Check size={16} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">独家教程和指南</h4>
                      <p className="text-neutral-400 text-sm">获取专业人士撰写的AI工具使用教程和最佳实践</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 bg-blue-600/20 text-blue-400 p-1.5 rounded-full">
                      <Check size={16} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">行业深度分析</h4>
                      <p className="text-neutral-400 text-sm">了解AI技术在各行业的应用趋势和最新发展</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 bg-blue-600/20 text-blue-400 p-1.5 rounded-full">
                      <Check size={16} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">专属折扣优惠</h4>
                      <p className="text-neutral-400 text-sm">获取AI工具和服务的专属折扣码和优惠信息</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* 工具对比组件 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">工具对比</h2>
          <ToolComparison 
            tools={mockTools} 
            features={mockFeatures} 
            toolFeatures={mockToolFeatures} 
          />
        </section>
        
        {/* 趋势分析组件 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">趋势分析</h2>
          <TrendAnalysis 
            trends={mockTrends} 
            timeRange="30d" 
            onTimeRangeChange={(range) => console.log(`时间范围改变为: ${range}`)} 
          />
        </section>
        
        {/* 教程组件 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">工具教程</h2>
          <ToolTutorial 
            toolName="ChatGPT" 
            toolLogo="/images/tools/chatgpt.svg" 
            steps={mockTutorialSteps} 
            difficulty="beginner" 
            estimatedTime="20分钟" 
          />
        </section>
        
        {/* 用例展示组件 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">应用场景</h2>
          <UseCaseShowcase useCases={mockUseCases} />
        </section>
        
        {/* 社区讨论组件 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">社区讨论</h2>
          <CommunityDiscussion 
            toolName="ChatGPT" 
            initialComments={mockComments} 
            currentUser={currentUser} 
          />
        </section>
      </div>
    </div>
  );
}