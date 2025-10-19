/**
 * OpenRouter API服务
 * 提供与OpenRouter API交互的通用函数
 */

// OpenRouter API基础URL
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

// 响应接口
interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    index: number;
    finish_reason: string;
  }[];
  model: string;
}

/**
 * 使用OpenRouter API生成文本内容
 * @param prompt 提示词
 * @param systemPrompt 系统提示词
 * @param model 模型名称，默认为gpt-4
 * @param temperature 温度参数，控制随机性
 * @param maxTokens 最大生成令牌数
 * @returns 生成的文本内容
 */
export async function generateWithOpenRouter(
  prompt: string,
  systemPrompt: string = '你是一个专业的AI助手，提供准确、有用的回答。',
  model: string = 'openai/gpt-4',
  temperature: number = 0.7,
  maxTokens: number = 2000
): Promise<string> {
  try {
    // 获取环境变量中的API密钥
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('未配置OpenRouter API密钥，请在.env.local文件中添加OPENROUTER_API_KEY');
    }

    // 调用OpenRouter API
    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'AI Navigator Pro'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: temperature,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API错误:', errorData);
      throw new Error(`调用OpenRouter API失败: ${errorData.error?.message || '未知错误'}`);
    }

    const responseData: OpenRouterResponse = await response.json();
    return responseData.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API调用失败:', error);
    throw error;
  }
}

/**
 * 使用OpenRouter API生成图像
 * @param prompt 提示词
 * @param negativePrompt 负面提示词
 * @param model 模型名称，默认为stability.stable-diffusion-xl
 * @param size 图像尺寸，默认为1024x1024
 * @returns 生成的图像URL数组
 */
export async function generateImageWithOpenRouter(
  prompt: string,
  negativePrompt: string = '',
  model: string = 'stability.stable-diffusion-xl-1024-v1-0',
  size: string = '1024x1024'
): Promise<string[]> {
  try {
    // 获取环境变量中的API密钥
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('未配置OpenRouter API密钥，请在.env.local文件中添加OPENROUTER_API_KEY');
    }

    // 调用OpenRouter API生成图像
    const response = await fetch(`${OPENROUTER_API_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'AI Navigator Pro'
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        n: 1,
        size: size,
        negative_prompt: negativePrompt,
        response_format: "url",
      })
    });

    if (!response.ok) {
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
      
      throw new Error(`OpenRouter API错误: ${errorMessage}`);
    }

    const data = await response.json();
    return data.data.map((item: any) => item.url);
  } catch (error) {
    console.error('生成图像失败:', error);
    throw error;
  }
}