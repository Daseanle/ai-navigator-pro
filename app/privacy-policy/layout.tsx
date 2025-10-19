import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '隐私政策 | AI Navigator Pro',
  description: '了解 AI Navigator Pro 如何收集、使用和保护您的个人数据。我们的隐私政策详细说明了我们的数据处理实践和您的隐私权。',
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}