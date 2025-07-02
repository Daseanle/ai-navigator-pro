import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 图像生成器 | AI Navigator Pro',
  description: '使用我们的 AI 图像生成器将您的创意转化为令人惊叹的图像。只需描述您想要的内容，我们的 AI 将为您生成独特的视觉作品。',
};

export default function ImageGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}