import { NextRequest, NextResponse } from 'next/server';

interface OpenRouterImageResponse {
  created: number;
  data: {
    url: string;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json();
    const { prompt, negativePrompt, imageSize, imageStyle } = body;
    
    // 验证必要参数
    if (!prompt) {
      return NextResponse.json(
        { error: '缺少必要参数: prompt' },
        { status: 400 }
      );
    }
    
    // 获取环境变量中的API密钥
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('未配置OpenRouter API密钥，请在.env.local文件中添加OPENROUTER_API_KEY');
      return NextResponse.json(
        { error: '未配置OpenRouter API密钥，请在.env.local文件中添加OPENROUTER_API_KEY' },
        { status: 500 }
      );
    }
    
    console.log('使用OpenRouter API密钥:', apiKey.substring(0, 10) + '...');
    
    // 构建完整提示词
    let fullPrompt = prompt;
    
    // 根据选择的风格添加风格描述
    if (imageStyle) {
      const stylePrompts = {
        'photographic': 'photorealistic, high-quality photograph, detailed',
        'digital-art': 'digital art, vibrant colors, detailed illustration',
        'anime': 'anime style, manga, vibrant, detailed anime illustration',
        'cinematic': 'cinematic, movie scene, dramatic lighting, high detail',
        'abstract': 'abstract art, non-representational, shapes and colors',
        '3d-render': '3D render, octane render, highly detailed, physically based rendering'
      };
      
      fullPrompt = `${fullPrompt}, ${stylePrompts[imageStyle as keyof typeof stylePrompts]}`;
    }
    
    // 添加负面提示词
    const negativePromptText = negativePrompt ? 
      `低质量, 模糊, 变形, ${negativePrompt}` : 
      '低质量, 模糊, 变形';
    
    // 调用OpenRouter API生成图像
    const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'AI Navigator Pro'
      },
      body: JSON.stringify({
        model: "stability.stable-diffusion-xl-1024-v1-0", // 使用Stability的模型
        prompt: fullPrompt,
        n: 1,
        size: imageSize || '1024x1024',
        negative_prompt: negativePromptText,
        response_format: "url",
      })
    });
    
    if (!response.ok) {
      try {
        const errorText = await response.text();
        let errorMessage = '未知错误';
        
        try {
          // 尝试解析为JSON
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error?.message || '未知错误';
          console.error('OpenRouter API错误:', errorData);
        } catch (parseError) {
          // 如果不是有效的JSON，使用原始文本
          errorMessage = errorText || '未知错误';
          console.error('OpenRouter API错误 (非JSON响应):', errorText);
        }
        
        return NextResponse.json(
          { error: `OpenRouter API错误: ${errorMessage}` },
          { status: response.status }
        );
      } catch (error) {
        console.error('处理API错误响应时出错:', error);
        return NextResponse.json(
          { error: '处理API错误响应时出错' },
          { status: 500 }
        );
      }
    }
    
    try {
      const data: OpenRouterImageResponse = await response.json();
      
      return NextResponse.json({
        success: true,
        images: data.data.map(item => item.url)
      });
    } catch (parseError) {
      console.error('解析API成功响应时出错:', parseError);
      return NextResponse.json(
        { error: `解析API响应时出错: ${(parseError as Error).message}` },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('图像生成错误:', error);
    return NextResponse.json(
      { error: `图像生成错误: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}