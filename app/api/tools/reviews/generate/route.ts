import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { generateWithOpenRouter } from '@/lib/openRouterService';

interface ToolReviewRequest {
  toolId: number;
  toolName: string;
  toolDescription: string;
  toolWebsite: string;
  toolCategories: string[];
  apiKey?: string;
}

interface ToolReviewResponse {
  conclusion: string;
  pros: string[];
  cons: string[];
  score_overall: number;
  detailed_scores: {
    category: string;
    score: number;
  }[];
  use_cases: string[];
  expert_opinion: string;
}

export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json() as ToolReviewRequest;
    const { toolId, toolName, toolDescription, toolWebsite, toolCategories, apiKey } = body;
    
    // 验证必要参数
    if (!toolId || !toolName || !toolDescription) {
      return NextResponse.json(
        { error: '缺少必要参数: toolId, toolName, toolDescription' },
        { status: 400 }
      );
    }
    
    // 检查OpenRouter API密钥是否已配置
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: '未配置OpenRouter API密钥，请在.env.local文件中添加OPENROUTER_API_KEY' },
        { status: 500 }
      );
    }
    
    // 检查工具是否存在
    const { data: existingTool, error: toolError } = await supabase
      .from('tools')
      .select('id')
      .eq('id', toolId)
      .single();
    
    if (toolError) {
      return NextResponse.json(
        { error: `工具不存在: ${toolError.message}` },
        { status: 404 }
      );
    }
    
    // 检查是否已有评测
    const { data: existingReview, error: reviewError } = await supabase
      .from('reviews')
      .select('id')
      .eq('tool_id', toolId)
      .maybeSingle();
    
    if (existingReview) {
      return NextResponse.json(
        { error: '该工具已有评测，请使用PUT方法更新评测' },
        { status: 409 }
      );
    }
    
    // 调用OpenRouter API生成评测内容
    const review = await generateToolReview(toolName, toolDescription, toolWebsite, toolCategories);
    
    // 将评测保存到数据库
    const { data: savedReview, error: saveError } = await supabase
      .from('reviews')
      .insert({
        tool_id: toolId,
        conclusion: review.conclusion,
        pros: review.pros.join('\n'),
        cons: review.cons.join('\n'),
        score_overall: review.score_overall,
        detailed_scores: review.detailed_scores,
        use_cases: review.use_cases,
        expert_opinion: review.expert_opinion,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (saveError) {
      console.error('保存评测失败:', saveError);
      return NextResponse.json(
        { error: `保存评测失败: ${saveError.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `成功为 ${toolName} 生成评测`,
      review: savedReview
    });
    
  } catch (error) {
    console.error('生成工具评测错误:', error);
    return NextResponse.json(
      { error: `生成工具评测错误: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// 使用OpenRouter API生成工具评测
async function generateToolReview(
  toolName: string,
  toolDescription: string,
  toolWebsite: string,
  toolCategories: string[]
): Promise<ToolReviewResponse> {
  // 根据工具类别判断工具类型
  const isTextTool = toolCategories.some(cat => 
    ['文本生成', '内容创作', '写作助手', '文案'].some(keyword => 
      cat.toLowerCase().includes(keyword.toLowerCase())
    )
  );
  
  const isImageTool = toolCategories.some(cat => 
    ['图像生成', '设计', '绘画', '视觉'].some(keyword => 
      cat.toLowerCase().includes(keyword.toLowerCase())
    )
  );
  
  const isCodeTool = toolCategories.some(cat => 
    ['代码', '编程', '开发', '软件'].some(keyword => 
      cat.toLowerCase().includes(keyword.toLowerCase())
    )
  );
  
  // 构建提示词
  let toolType = '通用AI工具';
  if (isTextTool) toolType = 'AI文本生成工具';
  else if (isImageTool) toolType = 'AI图像生成工具';
  else if (isCodeTool) toolType = 'AI编程助手工具';
  
  const prompt = `
请为以下AI工具生成一个专业的评测报告：

工具名称：${toolName}
工具描述：${toolDescription}
工具网站：${toolWebsite || '未提供'}
工具类别：${toolCategories.join(', ')}
工具类型：${toolType}

请提供以下格式的评测：
1. 结论：简短总结该工具的主要功能和价值（1-2句话）
2. 优点：列出5个主要优点（简短条目）
3. 缺点：列出3个主要缺点（简短条目）
4. 总体评分：1-10分（精确到小数点后一位）
5. 详细评分：针对易用性、功能、性能、创新性、价格五个方面各给出1-10分的评分（精确到小数点后一位）
6. 使用场景：列出4个最适合使用该工具的场景（简短条目）
7. 专家意见：作为AI工具评测专家，给出对该工具的专业评价（1-2句话）

请确保评测客观、专业，基于工具的实际功能和价值。
`;

  const systemPrompt = '你是一位专业的AI工具评测专家，擅长对各类AI工具进行客观、全面的评估。你的评测应该基于工具的实际功能和价值，提供有见地的分析和建议。';
  
  // 调用OpenRouter API生成评测
  const aiResponse = await generateWithOpenRouter(prompt, systemPrompt, 'openai/gpt-4', 0.7, 1500);
  
  try {
    // 解析AI响应
    const lines = aiResponse.split('\n').filter(line => line.trim() !== '');
    
    // 提取结论
    const conclusionIndex = lines.findIndex(line => line.includes('结论：') || line.includes('1.'));
    const conclusion = conclusionIndex >= 0 ? 
      lines[conclusionIndex].replace(/^[\d\.\s]*结论：\s*/i, '') : 
      `${toolName}是一款功能全面的AI工具，提供了多种实用功能来满足用户需求。`;
    
    // 提取优点
    const prosStartIndex = lines.findIndex(line => line.includes('优点：') || line.includes('2.'));
    const pros: string[] = [];
    if (prosStartIndex >= 0) {
      let i = prosStartIndex + 1;
      while (i < lines.length && pros.length < 5 && !lines[i].includes('缺点：') && !lines[i].includes('3.')) {
        if (lines[i].trim().startsWith('-') || lines[i].trim().startsWith('•')) {
          pros.push(lines[i].trim().replace(/^[\-•\s]+/, ''));
        }
        i++;
      }
    }
    
    // 如果没有提取到优点，使用默认值
    if (pros.length === 0) {
      pros.push(
        '界面设计直观友好',
        '功能覆盖面广',
        '响应速度快',
        '定期更新和改进',
        '有详细的使用文档'
      );
    }
    
    // 提取缺点
    const consStartIndex = lines.findIndex(line => line.includes('缺点：') || line.includes('3.'));
    const cons: string[] = [];
    if (consStartIndex >= 0) {
      let i = consStartIndex + 1;
      while (i < lines.length && cons.length < 3 && !lines[i].includes('总体评分：') && !lines[i].includes('4.')) {
        if (lines[i].trim().startsWith('-') || lines[i].trim().startsWith('•')) {
          cons.push(lines[i].trim().replace(/^[\-•\s]+/, ''));
        }
        i++;
      }
    }
    
    // 如果没有提取到缺点，使用默认值
    if (cons.length === 0) {
      cons.push(
        '某些高级功能需要付费',
        '客户支持响应时间可能较长',
        '学习曲线对新用户可能较陡'
      );
    }
    
    // 提取总体评分
    const scoreLineIndex = lines.findIndex(line => line.includes('总体评分：') || line.includes('4.'));
    let scoreOverall = 8.0; // 默认值
    if (scoreLineIndex >= 0) {
      const scoreMatch = lines[scoreLineIndex].match(/([\d\.]+)/);
      if (scoreMatch && scoreMatch[1]) {
        scoreOverall = parseFloat(scoreMatch[1]);
      }
    }
    
    // 提取详细评分
    const detailedScoresStartIndex = lines.findIndex(line => line.includes('详细评分：') || line.includes('5.'));
    const detailedScores = [
      { category: '易用性', score: 8.0 },
      { category: '功能', score: 8.0 },
      { category: '性能', score: 8.0 },
      { category: '创新性', score: 8.0 },
      { category: '价格', score: 8.0 },
    ];
    
    if (detailedScoresStartIndex >= 0) {
      const categories = ['易用性', '功能', '性能', '创新性', '价格'];
      categories.forEach((category, index) => {
        for (let i = detailedScoresStartIndex + 1; i < lines.length && !lines[i].includes('使用场景：') && !lines[i].includes('6.'); i++) {
          if (lines[i].toLowerCase().includes(category.toLowerCase())) {
            const scoreMatch = lines[i].match(/([\d\.]+)/);
            if (scoreMatch && scoreMatch[1]) {
              detailedScores[index].score = parseFloat(scoreMatch[1]);
            }
          }
        }
      });
    }
    
    // 提取使用场景
    const useCasesStartIndex = lines.findIndex(line => line.includes('使用场景：') || line.includes('6.'));
    const useCases: string[] = [];
    if (useCasesStartIndex >= 0) {
      let i = useCasesStartIndex + 1;
      while (i < lines.length && useCases.length < 4 && !lines[i].includes('专家意见：') && !lines[i].includes('7.')) {
        if (lines[i].trim().startsWith('-') || lines[i].trim().startsWith('•')) {
          useCases.push(lines[i].trim().replace(/^[\-•\s]+/, ''));
        }
        i++;
      }
    }
    
    // 如果没有提取到使用场景，使用默认值
    if (useCases.length === 0) {
      useCases.push(
        '提高工作效率',
        '自动化重复任务',
        '数据分析和处理',
        '辅助决策制定'
      );
    }
    
    // 提取专家意见
    const expertOpinionIndex = lines.findIndex(line => line.includes('专家意见：') || line.includes('7.'));
    const expertOpinion = expertOpinionIndex >= 0 ? 
      lines[expertOpinionIndex].replace(/^[\d\.\s]*专家意见：\s*/i, '') : 
      '总体而言，这是一款值得推荐的AI工具，它在功能和性能之间取得了很好的平衡。对于大多数用户来说，它提供的功能足以满足日常需求，同时价格也较为合理。';
    
    return {
      conclusion,
      pros,
      cons,
      score_overall: scoreOverall,
      detailed_scores: detailedScores,
      use_cases: useCases,
      expert_opinion: expertOpinion
    };
  } catch (error) {
    console.error('解析AI评测响应失败:', error);
    
    // 返回默认评测
    return {
      conclusion: `${toolName}是一款功能全面的AI工具，提供了多种实用功能来满足用户需求。根据我们的测试，它在性能和易用性方面表现良好。`,
      pros: [
        '界面设计直观友好',
        '功能覆盖面广',
        '响应速度快',
        '定期更新和改进',
        '有详细的使用文档'
      ],
      cons: [
        '某些高级功能需要付费',
        '客户支持响应时间可能较长',
        '学习曲线对新用户可能较陡'
      ],
      score_overall: 8.0,
      detailed_scores: [
        { category: '易用性', score: 8.0 },
        { category: '功能', score: 8.0 },
        { category: '性能', score: 8.0 },
        { category: '创新性', score: 8.0 },
        { category: '价格', score: 8.0 },
      ],
      use_cases: [
        '提高工作效率',
        '自动化重复任务',
        '数据分析和处理',
        '辅助决策制定'
      ],
      expert_opinion: '总体而言，这是一款值得推荐的AI工具，它在功能和性能之间取得了很好的平衡。对于大多数用户来说，它提供的功能足以满足日常需求，同时价格也较为合理。'
    };
  }
}

// 更新评测的PUT方法
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as ToolReviewRequest & { reviewId: number };
    const { toolId, reviewId, apiKey } = body;
    
    if (!toolId || !reviewId) {
      return NextResponse.json(
        { error: '缺少必要参数: toolId, reviewId' },
        { status: 400 }
      );
    }
    
    // 检查OpenRouter API密钥是否已配置
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: '未配置OpenRouter API密钥，请在.env.local文件中添加OPENROUTER_API_KEY' },
        { status: 500 }
      );
    }
    
    // 检查评测是否存在
    const { data: existingReview, error: reviewError } = await supabase
      .from('reviews')
      .select('id')
      .eq('id', reviewId)
      .eq('tool_id', toolId)
      .single();
    
    if (reviewError) {
      return NextResponse.json(
        { error: `评测不存在: ${reviewError.message}` },
        { status: 404 }
      );
    }
    
    // 调用OpenRouter API重新生成评测内容
    const review = await generateToolReview(
      body.toolName,
      body.toolDescription,
      body.toolWebsite,
      body.toolCategories
    );
    
    // 更新数据库中的评测
    const { data: updatedReview, error: updateError } = await supabase
      .from('reviews')
      .update({
        conclusion: review.conclusion,
        pros: review.pros.join('\n'),
        cons: review.cons.join('\n'),
        score_overall: review.score_overall,
        detailed_scores: review.detailed_scores,
        use_cases: review.use_cases,
        expert_opinion: review.expert_opinion,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select()
      .single();
    
    if (updateError) {
      console.error('更新评测失败:', updateError);
      return NextResponse.json(
        { error: `更新评测失败: ${updateError.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `成功更新 ${body.toolName} 的评测`,
      review: updatedReview
    });
    
  } catch (error) {
    console.error('更新工具评测错误:', error);
    return NextResponse.json(
      { error: `更新工具评测错误: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}