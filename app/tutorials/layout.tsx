import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 工具教程 | AI Navigator Pro',
  description: '探索我们的 AI 工具教程库，学习如何有效使用 ChatGPT、Midjourney、Stable Diffusion 等顶级 AI 工具，掌握最佳实践，并发现创新应用场景。',
};

export default function TutorialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}