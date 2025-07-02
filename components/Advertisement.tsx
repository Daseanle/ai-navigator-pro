'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type AdvertisementProps = {
  type: 'banner' | 'sidebar' | 'inline' | 'popup';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  adId?: string;
  sponsorName?: string;
  sponsorLogo?: string;
  sponsorUrl?: string;
  content?: React.ReactNode;
  imageUrl?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  onClose?: () => void;
  onImpression?: () => void;
  onCTAClick?: () => void;
};

export default function Advertisement({
  type = 'banner',
  position = 'top',
  size = 'medium',
  className = '',
  adId,
  sponsorName,
  sponsorLogo,
  sponsorUrl,
  content,
  imageUrl,
  title,
  description,
  ctaText = '了解更多',
  ctaUrl,
  onClose,
  onImpression,
  onCTAClick
}: AdvertisementProps) {
  const [dismissed, setDismissed] = useState(false);
  const [impressionLogged, setImpressionLogged] = useState(false);

  // 记录广告展示
  useEffect(() => {
    if (!impressionLogged && !dismissed && onImpression) {
      onImpression();
      setImpressionLogged(true);
      
      // 可以在这里添加向后端API发送广告展示记录的逻辑
      console.log(`Ad impression logged: ${adId}`);
    }
  }, [impressionLogged, dismissed, adId, onImpression]);

  // 处理关闭广告
  const handleClose = () => {
    setDismissed(true);
    if (onClose) onClose();
  };

  // 处理CTA点击
  const handleCTAClick = () => {
    if (onCTAClick) onCTAClick();
    
    // 可以在这里添加向后端API发送广告点击记录的逻辑
    console.log(`Ad CTA clicked: ${adId}`);
  };

  if (dismissed) return null;

  // 根据广告类型和尺寸确定样式
  const getContainerStyles = () => {
    let baseStyles = 'relative overflow-hidden ';
    
    // 类型样式
    switch (type) {
      case 'banner':
        baseStyles += 'w-full flex items-center justify-between ';
        break;
      case 'sidebar':
        baseStyles += 'flex flex-col ';
        break;
      case 'inline':
        baseStyles += 'flex items-center ';
        break;
      case 'popup':
        baseStyles += 'fixed z-50 flex flex-col shadow-xl ';
        break;
    }
    
    // 尺寸样式
    switch (size) {
      case 'small':
        baseStyles += type === 'banner' ? 'py-2 px-3 ' : 'p-3 ';
        break;
      case 'medium':
        baseStyles += type === 'banner' ? 'py-3 px-4 ' : 'p-4 ';
        break;
      case 'large':
        baseStyles += type === 'banner' ? 'py-4 px-6 ' : 'p-6 ';
        break;
    }
    
    // 位置样式 (仅适用于popup类型)
    if (type === 'popup') {
      switch (position) {
        case 'top':
          baseStyles += 'top-4 left-1/2 transform -translate-x-1/2 ';
          break;
        case 'bottom':
          baseStyles += 'bottom-4 left-1/2 transform -translate-x-1/2 ';
          break;
        case 'left':
          baseStyles += 'left-4 top-1/2 transform -translate-y-1/2 ';
          break;
        case 'right':
          baseStyles += 'right-4 top-1/2 transform -translate-y-1/2 ';
          break;
        case 'center':
          baseStyles += 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ';
          break;
      }
    }
    
    // 基础样式
    baseStyles += 'bg-neutral-900 border border-neutral-800 rounded-xl ';
    
    return baseStyles;
  };

  // 自定义内容渲染
  if (content) {
    return (
      <div className={`${getContainerStyles()} ${className}`}>
        {content}
        {(type === 'banner' || type === 'popup') && (
          <button 
            onClick={handleClose}
            className="absolute top-2 right-2 text-neutral-400 hover:text-white transition-colors"
            aria-label="关闭广告"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }

  // 默认广告内容渲染
  return (
    <div className={`${getContainerStyles()} ${className}`}>
      {/* 赞助商标识 */}
      {sponsorName && (
        <div className="text-xs text-neutral-500 mb-2 flex items-center">
          <span>赞助内容</span>
          {sponsorLogo && (
            <img 
              src={sponsorLogo} 
              alt={`${sponsorName} logo`} 
              className="h-4 ml-2"
            />
          )}
        </div>
      )}
      
      {/* 广告内容 */}
      <div className={`flex ${type === 'sidebar' || type === 'popup' ? 'flex-col' : 'items-center'}`}>
        {imageUrl && (
          <div className={`
            ${type === 'sidebar' || type === 'popup' ? 'w-full mb-3' : 'mr-4'}
            ${size === 'small' ? 'w-16 h-16' : size === 'medium' ? 'w-24 h-24' : 'w-32 h-32'}
            ${type !== 'sidebar' && type !== 'popup' ? 'flex-shrink-0' : ''}
          `}>
            <img 
              src={imageUrl} 
              alt={title || '广告图片'} 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="flex-1">
          {title && <h3 className="font-medium text-white">{title}</h3>}
          {description && <p className="text-neutral-400 text-sm mt-1">{description}</p>}
          
          {ctaUrl && (
            <a 
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCTAClick}
              className="inline-block mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {ctaText}
            </a>
          )}
        </div>
      </div>
      
      {/* 关闭按钮 */}
      {(type === 'banner' || type === 'popup') && (
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 text-neutral-400 hover:text-white transition-colors"
          aria-label="关闭广告"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}