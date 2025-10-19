'use client';

import { useState } from 'react';
import { CreditCard, Lock, Check } from 'lucide-react';

type CourseEnrollFormProps = {
  courseId: string;
  courseTitle: string;
  price: {
    current: number;
    original?: number;
    currency?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
};

const CourseEnrollForm: React.FC<CourseEnrollFormProps> = ({
  courseId,
  courseTitle,
  price,
  onSuccess,
  onCancel
}) => {
  const [step, setStep] = useState<'payment' | 'confirmation'>('payment');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    couponCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
    discountAmount: number;
  } | null>(null);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 信用卡号格式化
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/\D/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim();
      setFormData({ ...formData, [name]: formattedValue });
      return;
    }
    
    // 到期日格式化 (MM/YY)
    if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      }
      setFormData({ ...formData, [name]: formatted });
      return;
    }
    
    // CVV只允许数字且最多4位
    if (name === 'cvv') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 4);
      setFormData({ ...formData, [name]: formattedValue });
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  // 应用优惠券
  const applyCoupon = () => {
    if (!formData.couponCode) {
      setErrors({ ...errors, couponCode: '请输入优惠券代码' });
      return;
    }
    
    // 模拟优惠券验证
    if (formData.couponCode.toUpperCase() === 'WELCOME20') {
      const discountPercent = 20;
      const discountAmount = (price.current * discountPercent) / 100;
      
      setAppliedCoupon({
        code: formData.couponCode.toUpperCase(),
        discountPercent,
        discountAmount
      });
      
      setErrors({ ...errors, couponCode: '' });
    } else {
      setErrors({ ...errors, couponCode: '无效的优惠券代码' });
      setAppliedCoupon(null);
    }
  };

  // 移除优惠券
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setFormData({ ...formData, couponCode: '' });
    setErrors({ ...errors, couponCode: '' });
  };

  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = '请输入有效的信用卡号';
    }
    
    if (!formData.cardHolder) {
      newErrors.cardHolder = '请输入持卡人姓名';
    }
    
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = '请输入有效的到期日 (MM/YY)';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      
      if (
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth) ||
        parseInt(month) > 12 ||
        parseInt(month) < 1
      ) {
        newErrors.expiryDate = '卡片已过期或日期无效';
      }
    }
    
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = '请输入有效的安全码';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交支付
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // 模拟支付处理
    setTimeout(() => {
      setStep('confirmation');
      setLoading(false);
    }, 2000);
  };

  // 完成报名
  const handleComplete = () => {
    if (onSuccess) onSuccess();
  };

  // 计算最终价格
  const calculateFinalPrice = () => {
    if (!appliedCoupon) return price.current;
    return Math.max(0, price.current - appliedCoupon.discountAmount);
  };

  // 格式化价格显示
  const formatPrice = (amount: number) => {
    return `${price.currency || '¥'}${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      {/* 表单标题 */}
      <div className="p-6 border-b border-neutral-800">
        <h2 className="text-xl font-bold text-white">课程报名</h2>
        <p className="text-neutral-400 mt-1">{courseTitle}</p>
      </div>
      
      {step === 'payment' ? (
        <form onSubmit={handleSubmit} className="p-6">
          {/* 价格信息 */}
          <div className="mb-6 pb-6 border-b border-neutral-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-neutral-300">课程价格</span>
              <span className="text-white">
                {price.original && price.original > price.current ? (
                  <>
                    <span className="text-neutral-500 line-through mr-2">
                      {formatPrice(price.original)}
                    </span>
                    {formatPrice(price.current)}
                  </>
                ) : (
                  formatPrice(price.current)
                )}
              </span>
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between items-center mb-2 text-green-400">
                <span className="flex items-center">
                  <Check size={16} className="mr-1" />
                  优惠券 {appliedCoupon.code} ({appliedCoupon.discountPercent}%折扣)
                </span>
                <span>-{formatPrice(appliedCoupon.discountAmount)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center font-medium">
              <span className="text-white">总计</span>
              <span className="text-xl text-white">{formatPrice(calculateFinalPrice())}</span>
            </div>
          </div>
          
          {/* 优惠券 */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleInputChange}
                placeholder="输入优惠券代码"
                disabled={!!appliedCoupon}
                className="flex-grow px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-60"
              />
              {appliedCoupon ? (
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                >
                  移除
                </button>
              ) : (
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                >
                  应用
                </button>
              )}
            </div>
            {errors.couponCode && (
              <p className="text-red-500 text-sm mt-1">{errors.couponCode}</p>
            )}
          </div>
          
          {/* 支付信息 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-4">支付信息</h3>
            
            <div className="space-y-4">
              {/* 卡号 */}
              <div>
                <label htmlFor="cardNumber" className="block text-sm text-neutral-400 mb-1">
                  卡号
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full px-4 py-2 bg-neutral-800 border ${errors.cardNumber ? 'border-red-500' : 'border-neutral-700'} rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  />
                  <CreditCard size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                </div>
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                )}
              </div>
              
              {/* 持卡人 */}
              <div>
                <label htmlFor="cardHolder" className="block text-sm text-neutral-400 mb-1">
                  持卡人姓名
                </label>
                <input
                  type="text"
                  id="cardHolder"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleInputChange}
                  placeholder="张三"
                  className={`w-full px-4 py-2 bg-neutral-800 border ${errors.cardHolder ? 'border-red-500' : 'border-neutral-700'} rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
                {errors.cardHolder && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>
                )}
              </div>
              
              {/* 到期日和CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm text-neutral-400 mb-1">
                    到期日 (MM/YY)
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="12/25"
                    maxLength={5}
                    className={`w-full px-4 py-2 bg-neutral-800 border ${errors.expiryDate ? 'border-red-500' : 'border-neutral-700'} rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-sm text-neutral-400 mb-1">
                    安全码 (CVV)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full px-4 py-2 bg-neutral-800 border ${errors.cvv ? 'border-red-500' : 'border-neutral-700'} rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                    />
                    <Lock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                  </div>
                  {errors.cvv && (
                    <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* 安全提示 */}
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
            <Lock size={14} />
            <span>您的支付信息安全加密</span>
          </div>
          
          {/* 提交按钮 */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </span>
              ) : `支付 ${formatPrice(calculateFinalPrice())}`}
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-3 bg-transparent border border-neutral-700 hover:border-neutral-600 text-white font-medium rounded-lg transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">报名成功！</h3>
          <p className="text-neutral-400 mb-6">您已成功报名参加《{courseTitle}》课程</p>
          
          <div className="space-y-3">
            <button
              onClick={handleComplete}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              开始学习
            </button>
            
            <button
              onClick={onCancel}
              className="w-full py-3 bg-transparent border border-neutral-700 hover:border-neutral-600 text-white font-medium rounded-lg transition-colors"
            >
              返回课程详情
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseEnrollForm;