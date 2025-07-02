'use client';

import { useState } from 'react';
import { Share2, Check, Copy, Twitter, Facebook, Linkedin, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  compact?: boolean;
  className?: string;
}

export default function ShareButton({
  url,
  title,
  description = '',
  compact = false,
  className = ''
}: ShareButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  
  // 处理复制链接
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };
  
  // 处理社交媒体分享
  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}${description ? ` - ${encodeURIComponent(description)}` : ''}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowDropdown(false);
    }
  };
  
  // 处理Web Share API分享
  const handleNativeShare = async () => {
    if (!navigator.share) return;
    
    try {
      await navigator.share({
        title,
        text: description,
        url,
      });
    } catch (error) {
      console.error('分享失败:', error);
    }
  };
  
  // 处理QR码显示
  const handleQRCodeToggle = () => {
    setShowQRCode(!showQRCode);
    setShowDropdown(false);
  };
  
  // 检查是否支持原生分享
  const supportsNativeShare = typeof navigator !== 'undefined' && !!navigator.share;
  
  return (
    <div className={`relative ${className}`}>
      {/* 主按钮 */}
      {supportsNativeShare ? (
        <button
          onClick={handleNativeShare}
          className={`flex items-center gap-1.5 ${compact ? 'text-sm px-2 py-1' : 'px-3 py-1.5'} bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors`}
        >
          <Share2 size={compact ? 14 : 16} />
          {!compact && <span>分享</span>}
        </button>
      ) : (
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center gap-1.5 ${compact ? 'text-sm px-2 py-1' : 'px-3 py-1.5'} bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors`}
        >
          <Share2 size={compact ? 14 : 16} />
          {!compact && <span>分享</span>}
        </button>
      )}
      
      {/* 分享下拉菜单 */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10 overflow-hidden">
          <div className="p-2">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-neutral-700 rounded transition-colors text-left"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              {copied ? '已复制链接' : '复制链接'}
            </button>
            
            <button
              onClick={handleQRCodeToggle}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-neutral-700 rounded transition-colors text-left"
            >
              <QrCode size={16} />
              显示二维码
            </button>
            
            <button
              onClick={() => handleSocialShare('twitter')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-neutral-700 rounded transition-colors text-left"
            >
              <Twitter size={16} className="text-blue-400" />
              分享到 Twitter
            </button>
            
            <button
              onClick={() => handleSocialShare('facebook')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-neutral-700 rounded transition-colors text-left"
            >
              <Facebook size={16} className="text-blue-600" />
              分享到 Facebook
            </button>
            
            <button
              onClick={() => handleSocialShare('linkedin')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-neutral-700 rounded transition-colors text-left"
            >
              <Linkedin size={16} className="text-blue-500" />
              分享到 LinkedIn
            </button>
          </div>
        </div>
      )}
      
      {/* QR码弹窗 */}
      {showQRCode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={handleQRCodeToggle}>
          <div className="bg-white p-6 rounded-xl max-w-xs w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-center mb-4 text-neutral-800">扫描二维码分享</h3>
            <div className="flex justify-center mb-4">
              <QRCodeSVG value={url} size={200} includeMargin={true} />
            </div>
            <p className="text-sm text-center text-neutral-600 mb-4">{title}</p>
            <button 
              onClick={handleQRCodeToggle}
              className="w-full py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}