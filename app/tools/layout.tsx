import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 工具库 - AI Navigator Pro',
  description: '探索我们精选的 AI 工具集合，提升您的工作效率和创造力。从内容创作到数据分析，我们的工具库涵盖各种 AI 应用场景。',
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}