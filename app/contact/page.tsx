'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入您的姓名';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入您的邮箱';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = '请输入主题';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = '请输入留言内容';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除该字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // 这里模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 成功处理
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      // 错误处理
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-2">联系我们</h1>
      <p className="text-xl text-neutral-400 mb-12">有任何问题或建议？请随时与我们联系</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* 联系信息 */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 sticky top-8">
            <h2 className="text-2xl font-bold text-white mb-6">联系方式</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600/20 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">电子邮件</h3>
                  <p className="text-neutral-400 mt-1">support@ainavigatorpro.com</p>
                  <p className="text-neutral-400">info@ainavigatorpro.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-600/20 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">电话</h3>
                  <p className="text-neutral-400 mt-1">+86 (10) 8888-7777</p>
                  <p className="text-neutral-400">周一至周五 9:00-18:00</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-purple-600/20 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">地址</h3>
                  <p className="text-neutral-400 mt-1">北京市海淀区中关村大街1号</p>
                  <p className="text-neutral-400">科技大厦 15层</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">关注我们</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-neutral-800 hover:bg-neutral-700 p-3 rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-blue-400" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>
                <a href="#" className="bg-neutral-800 hover:bg-neutral-700 p-3 rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-blue-400" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </a>
                <a href="#" className="bg-neutral-800 hover:bg-neutral-700 p-3 rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-blue-400" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* 联系表单 */}
        <div className="lg:col-span-2">
          {submitStatus === 'success' ? (
            <div className="bg-green-900/30 border border-green-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">消息已发送！</h2>
              <p className="text-neutral-300 mb-6">感谢您的留言，我们会尽快回复您。</p>
              <button 
                onClick={() => setSubmitStatus('idle')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                发送新消息
              </button>
            </div>
          ) : submitStatus === 'error' ? (
            <div className="bg-red-900/30 border border-red-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">发送失败</h2>
              <p className="text-neutral-300 mb-6">抱歉，消息发送失败，请稍后再试。</p>
              <button 
                onClick={() => setSubmitStatus('idle')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                重试
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">发送消息</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">姓名</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-neutral-800 border ${errors.name ? 'border-red-500' : 'border-neutral-700'} rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="您的姓名"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">邮箱</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-neutral-800 border ${errors.email ? 'border-red-500' : 'border-neutral-700'} rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="您的邮箱地址"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-300 mb-2">主题</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full bg-neutral-800 border ${errors.subject ? 'border-red-500' : 'border-neutral-700'} rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="消息主题"
                />
                {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">留言内容</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full bg-neutral-800 border ${errors.message ? 'border-red-500' : 'border-neutral-700'} rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="请详细描述您的问题或建议..."
                ></textarea>
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-neutral-600 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在发送...
                  </>
                ) : (
                  <>发送消息</>
                )}
              </button>
            </form>
          )}
          
          {/* FAQ 部分 */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">常见问题</h2>
            
            <div className="space-y-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">如何提交我的AI工具？</h3>
                <p className="text-neutral-400">您可以通过填写上方的联系表单，或直接发送邮件至 submit@ainavigatorpro.com，我们的团队会在3个工作日内审核并回复您。</p>
              </div>
              
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">如何成为我们的合作伙伴？</h3>
                <p className="text-neutral-400">我们欢迎各类合作机会，包括内容合作、技术合作和商业合作等。请发送详细合作提案至 partnership@ainavigatorpro.com。</p>
              </div>
              
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">如何申请广告投放？</h3>
                <p className="text-neutral-400">我们提供多种广告位和推广方式，如需了解详情和价格，请联系我们的广告团队：ads@ainavigatorpro.com。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}