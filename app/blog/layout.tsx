import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '博客 - AI Navigator Pro',
  description: '探索 AI 领域的最新动态、教程和见解。我们的博客提供关于人工智能技术、应用和趋势的深入分析和实用指南。',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}