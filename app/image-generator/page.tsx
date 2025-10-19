'use client';

import { useState } from 'react';
import { ArrowPathIcon, ArrowDownTrayIcon, ArrowsPointingOutIcon, XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

type ImageSize = '512x512' | '768x768' | '1024x1024' | '1024x1792' | '1792x1024';
type ImageStyle = 'photographic' | 'digital-art' | 'anime' | 'cinematic' | 'abstract' | '3d-render';

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [imageSize, setImageSize] = useState<ImageSize>('1024x1024');
  const [imageStyle, setImageStyle] = useState<ImageStyle>('photographic');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const imageSizes: {value: ImageSize; label: string}[] = [
    { value: '512x512', label: '512 × 512' },
    { value: '768x768', label: '768 × 768' },
    { value: '1024x1024', label: '1024 × 1024' },
    { value: '1024x1792', label: '1024 × 1792 (竖向)' },
    { value: '1792x1024', label: '1792 × 1024 (横向)' },
  ];
  
  const imageStyles: {value: ImageStyle; label: string}[] = [
    { value: 'photographic', label: '摄影风格' },
    { value: 'digital-art', label: '数字艺术' },
    { value: 'anime', label: '动漫风格' },
    { value: 'cinematic', label: '电影风格' },
    { value: 'abstract', label: '抽象艺术' },
    { value: '3d-render', label: '3D 渲染' },
  ];
  
  // 生成图像
  const generateImages = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedImages([]);
    setErrorMessage(null); // 清除之前的错误信息
    
    try {
      // 调用API生成图像
      const response = await fetch('/api/image-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          negativePrompt,
          imageSize,
          imageStyle,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '图像生成失败');
      }
      
      if (data.success && data.images && data.images.length > 0) {
        // 使用API返回的真实图像URL
        setGeneratedImages(data.images);
      } else {
        // 如果API调用成功但没有返回图像，使用模拟图像
        const mockImages = generateMockImages(4);
        setGeneratedImages(mockImages);
      }
    } catch (error) {
      console.error('图像生成错误:', error);
      setErrorMessage(error instanceof Error ? error.message : '未知错误');
      
      // 在API调用失败时使用模拟图像
      const mockImages = generateMockImages(4);
      setGeneratedImages(mockImages);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // 生成模拟图像
  const generateMockImages = (count: number) => {
    return Array(count).fill(0).map((_, index) => {
      const colors = [
        'bg-gradient-to-br from-blue-500 to-purple-600',
        'bg-gradient-to-br from-green-500 to-teal-600',
        'bg-gradient-to-br from-red-500 to-orange-600',
        'bg-gradient-to-br from-yellow-500 to-amber-600',
        'bg-gradient-to-br from-indigo-500 to-blue-600',
        'bg-gradient-to-br from-pink-500 to-rose-600',
      ];
      
      return `placeholder-${index}-${colors[Math.floor(Math.random() * colors.length)]}`;
    });
  };
  
  // 打开图像灯箱
  const openLightbox = (image: string) => {
    setSelectedImage(image);
    setIsLightboxOpen(true);
  };
  
  // 关闭图像灯箱
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
  };
  
  // 下载图像（模拟）
  const downloadImage = (image: string) => {
    alert('在实际应用中，这将下载生成的图像。');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">AI 图像生成器</h1>
        <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
          使用 AI 技术将您的创意转化为令人惊叹的图像。只需描述您想要的内容，我们的 AI 将为您生成独特的视觉作品。
        </p>
      </div>
      
      {/* 错误提示 */}
      {errorMessage && (
        <div className="mb-8 bg-red-900/50 border border-red-800 rounded-lg p-4 flex items-start">
          <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-400 font-medium">图像生成失败</h3>
            <p className="text-red-300">{errorMessage}</p>
          </div>
          <button 
            onClick={() => setErrorMessage(null)}
            className="ml-auto p-1 text-red-400 hover:text-red-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：生成控制面板 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">创建您的图像</h2>
            
            {/* 提示输入 */}
            <div className="mb-6">
              <label htmlFor="prompt" className="block text-sm font-medium text-neutral-300 mb-2">
                描述您想要的图像
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：一只橙色的猫坐在窗台上，看着窗外的雨天，背景是模糊的城市景观"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none h-32"
              />
              <p className="text-neutral-500 text-xs mt-1">详细的描述会产生更好的结果</p>
            </div>
            
            {/* 图像尺寸选择 */}
            <div className="mb-6">
              <label htmlFor="image-size" className="block text-sm font-medium text-neutral-300 mb-2">
                图像尺寸
              </label>
              <select
                id="image-size"
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value as ImageSize)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                {imageSizes.map((size) => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>
            
            {/* 图像风格选择 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                图像风格
              </label>
              <div className="grid grid-cols-2 gap-2">
                {imageStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setImageStyle(style.value)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${imageStyle === style.value ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 高级选项 */}
            <div className="mb-6">
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                <span>高级选项</span>
                <svg
                  className={`ml-1 w-4 h-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {isAdvancedOpen && (
                <div className="mt-4">
                  <label htmlFor="negative-prompt" className="block text-sm font-medium text-neutral-300 mb-2">
                    负面提示（不希望出现的元素）
                  </label>
                  <textarea
                    id="negative-prompt"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="例如：模糊，变形，低质量，像素化"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none h-20"
                  />
                </div>
              )}
            </div>
            
            {/* 生成按钮 */}
            <button
              onClick={generateImages}
              disabled={!prompt.trim() || isGenerating}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${!prompt.trim() || isGenerating ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'} transition-colors`}
            >
              {isGenerating ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                '生成图像'
              )}
            </button>
          </div>
          
          {/* 使用提示 */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">提示技巧</h3>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>使用详细的描述，包括主题、背景、光线、风格和氛围</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>指定艺术风格，如「油画」、「水彩」或「摄影」</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>添加参考艺术家或作品可以影响风格</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>使用负面提示排除不需要的元素</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 右侧：生成结果 */}
        <div className="lg:col-span-2">
          {generatedImages.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">生成结果</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generatedImages.map((image, index) => {
                  // 检查是否是真实图像URL或占位符
                  const isRealImage = image.startsWith('http');
                  // 如果是占位符，提取颜色类
                  const colorClass = !isRealImage ? image.split('-')[2] : '';
                  
                  return (
                    <div key={index} className="relative group">
                      {isRealImage ? (
                        <div className="aspect-square rounded-xl overflow-hidden bg-neutral-900">
                          <img 
                            src={image} 
                            alt={`生成的图像 ${index + 1}`} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className={`aspect-square rounded-xl overflow-hidden ${colorClass} flex items-center justify-center`}>
                          <span className="text-white/70 text-sm">示例图像 {index + 1}</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                        <button
                          onClick={() => openLightbox(image)}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                          title="查看大图"
                        >
                          <ArrowsPointingOutIcon className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => downloadImage(image)}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                          title="下载图像"
                        >
                          <ArrowDownTrayIcon className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <p className="text-neutral-500 text-sm">
                注意：要使用真实的AI图像生成功能，请在 .env.local 文件中配置有效的 OPENROUTER_API_KEY。
                如果未配置API密钥或API调用失败，将显示示例图像。
              </p>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8 bg-neutral-900 border border-neutral-800 rounded-xl max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 bg-neutral-800 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">开始创建您的 AI 图像</h3>
                <p className="text-neutral-400 mb-6">
                  在左侧输入您的描述，选择所需的设置，然后点击「生成图像」按钮。
                </p>
                <p className="text-neutral-500 text-sm">
                  注意：要使用真实的AI图像生成功能，请在 .env.local 文件中配置有效的 OPENROUTER_API_KEY。
                  配置后，系统将使用OpenRouter.ai的Stable Diffusion模型生成图像。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 图像灯箱 */}
      {isLightboxOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
          
          <div className="max-w-4xl max-h-[80vh] w-full">
            <div className="aspect-square max-h-full mx-auto rounded-xl overflow-hidden">
              {selectedImage.startsWith('http') ? (
                <img 
                  src={selectedImage} 
                  alt="生成的图像" 
                  className="w-full h-full object-contain"
                />
              ) : (
                // 从占位符中提取颜色类
                <div className={`w-full h-full ${selectedImage.split('-')[2]} flex items-center justify-center`}>
                  <span className="text-white/70">示例大图</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 客户端组件不能导出metadata，已在layout.tsx中定义