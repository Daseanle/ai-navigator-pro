'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PlusCircle, Edit, Trash2, Eye, EyeOff, ArrowUpDown, Search, Calendar, DollarSign } from 'lucide-react';
import { Advertisement } from '@/lib/adService';

export default function AdsManagementPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Advertisement>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedAdType, setSelectedAdType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAd, setCurrentAd] = useState<Advertisement | null>(null);
  const [stats, setStats] = useState<{
    totalAds: number;
    activeAds: number;
    totalImpressions: number;
    totalClicks: number;
    averageCTR: number;
    totalRevenue: number;
  }>({ 
    totalAds: 0, 
    activeAds: 0, 
    totalImpressions: 0, 
    totalClicks: 0, 
    averageCTR: 0,
    totalRevenue: 0
  });

  const supabase = createClientComponentClient();

  // 加载广告数据
  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      // 实际应用中应该从Supabase获取数据
      // 这里使用模拟数据
      const mockAds: Advertisement[] = [
        {
          id: '1',
          type: 'banner',
          position: 'top',
          size: 'large',
          title: '高级AI课程',
          description: '立即报名参加我们的高级AI课程，提升您的技能',
          imageUrl: 'https://via.placeholder.com/600x200',
          ctaText: '立即报名',
          ctaUrl: '/courses/advanced-ai',
          sponsorName: 'AI学院',
          sponsorLogo: 'https://via.placeholder.com/100x50',
          sponsorUrl: 'https://ai-academy.example.com',
          targetPages: ['/', '/tools', '/courses'],
          targetDevices: ['desktop', 'tablet', 'mobile'],
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-12-31'),
          impressions: 12500,
          clicks: 350,
          status: 'active',
          priority: 10,
          pricing: {
            model: 'cpm',
            rate: 5.00,
            currency: '¥'
          },
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-15')
        },
        {
          id: '2',
          type: 'sidebar',
          position: 'right',
          size: 'medium',
          title: 'AI工具专业版',
          description: '升级到专业版，解锁所有高级功能',
          imageUrl: 'https://via.placeholder.com/300x300',
          ctaText: '立即升级',
          ctaUrl: '/pricing',
          sponsorName: 'AI工具公司',
          sponsorLogo: 'https://via.placeholder.com/100x50',
          sponsorUrl: 'https://ai-tools.example.com',
          targetPages: ['/tool/*'],
          targetDevices: ['desktop', 'tablet'],
          startDate: new Date('2023-02-01'),
          endDate: new Date('2023-12-31'),
          impressions: 8700,
          clicks: 420,
          status: 'active',
          priority: 8,
          pricing: {
            model: 'cpc',
            rate: 2.50,
            currency: '¥'
          },
          createdAt: new Date('2023-02-01'),
          updatedAt: new Date('2023-02-15')
        },
        {
          id: '3',
          type: 'popup',
          position: 'center',
          size: 'large',
          title: '限时优惠',
          description: '所有AI课程限时8折优惠，仅限本周',
          imageUrl: 'https://via.placeholder.com/400x300',
          ctaText: '查看优惠',
          ctaUrl: '/courses?discount=true',
          sponsorName: '学习平台',
          sponsorLogo: 'https://via.placeholder.com/100x50',
          sponsorUrl: 'https://learning.example.com',
          targetPages: ['/', '/courses'],
          targetDevices: ['desktop', 'tablet', 'mobile'],
          startDate: new Date('2023-03-01'),
          endDate: new Date('2023-03-07'),
          impressions: 5200,
          clicks: 180,
          status: 'completed',
          priority: 9,
          pricing: {
            model: 'flat',
            rate: 1000.00,
            currency: '¥'
          },
          createdAt: new Date('2023-02-15'),
          updatedAt: new Date('2023-03-08')
        },
        {
          id: '4',
          type: 'inline',
          size: 'small',
          title: 'AI开发者工具',
          description: '专为AI开发者设计的高效工具集',
          imageUrl: 'https://via.placeholder.com/200x200',
          ctaText: '免费试用',
          ctaUrl: '/tools/developer',
          sponsorName: '开发工具公司',
          sponsorLogo: 'https://via.placeholder.com/100x50',
          sponsorUrl: 'https://dev-tools.example.com',
          targetPages: ['/tools', '/categories/development'],
          targetDevices: ['desktop'],
          startDate: new Date('2023-04-01'),
          impressions: 3100,
          clicks: 95,
          status: 'active',
          priority: 5,
          pricing: {
            model: 'cpm',
            rate: 3.50,
            currency: '¥'
          },
          createdAt: new Date('2023-03-15'),
          updatedAt: new Date('2023-04-01')
        },
        {
          id: '5',
          type: 'banner',
          position: 'bottom',
          size: 'medium',
          title: 'AI导航专刊',
          description: '订阅我们的AI导航专刊，获取最新AI资讯',
          imageUrl: 'https://via.placeholder.com/600x150',
          ctaText: '立即订阅',
          ctaUrl: '/newsletter',
          sponsorName: 'AI资讯',
          sponsorLogo: 'https://via.placeholder.com/100x50',
          sponsorUrl: 'https://ai-news.example.com',
          targetPages: ['/', '/tools', '/categories/*'],
          targetDevices: ['desktop', 'tablet', 'mobile'],
          startDate: new Date('2023-05-01'),
          endDate: new Date('2023-12-31'),
          impressions: 9800,
          clicks: 310,
          status: 'paused',
          priority: 7,
          pricing: {
            model: 'cpc',
            rate: 1.80,
            currency: '¥'
          },
          createdAt: new Date('2023-04-15'),
          updatedAt: new Date('2023-05-10')
        }
      ];

      setAds(mockAds);

      // 计算统计数据
      const totalAds = mockAds.length;
      const activeAds = mockAds.filter(ad => ad.status === 'active').length;
      const totalImpressions = mockAds.reduce((sum, ad) => sum + ad.impressions, 0);
      const totalClicks = mockAds.reduce((sum, ad) => sum + ad.clicks, 0);
      const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      
      // 计算总收入
      let totalRevenue = 0;
      mockAds.forEach(ad => {
        if (ad.pricing.model === 'cpm') {
          totalRevenue += (ad.impressions / 1000) * ad.pricing.rate;
        } else if (ad.pricing.model === 'cpc') {
          totalRevenue += ad.clicks * ad.pricing.rate;
        } else if (ad.pricing.model === 'flat') {
          totalRevenue += ad.pricing.rate;
        }
      });

      setStats({
        totalAds,
        activeAds,
        totalImpressions,
        totalClicks,
        averageCTR,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理排序
  const handleSort = (field: keyof Advertisement) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // 过滤和排序广告
  const filteredAndSortedAds = ads
    .filter(ad => {
      // 搜索过滤
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        ad.title.toLowerCase().includes(searchLower) ||
        ad.description?.toLowerCase().includes(searchLower) ||
        ad.sponsorName.toLowerCase().includes(searchLower);
      
      // 类型过滤
      const matchesType = selectedAdType === 'all' || ad.type === selectedAdType;
      
      // 状态过滤
      const matchesStatus = selectedStatus === 'all' || ad.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      // 处理不同类型的字段
      if (sortField === 'startDate' || sortField === 'endDate' || sortField === 'createdAt' || sortField === 'updatedAt') {
        const dateA = a[sortField] ? new Date(a[sortField] as Date).getTime() : 0;
        const dateB = b[sortField] ? new Date(b[sortField] as Date).getTime() : 0;
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortField === 'impressions' || sortField === 'clicks' || sortField === 'priority') {
        const numA = a[sortField] as number;
        const numB = b[sortField] as number;
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      } else {
        const strA = String(a[sortField] || '').toLowerCase();
        const strB = String(b[sortField] || '').toLowerCase();
        return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
      }
    });

  // 处理广告状态切换
  const toggleAdStatus = (ad: Advertisement) => {
    // 确保 newStatus 是 Advertisement['status'] 类型
    const newStatus: Advertisement['status'] = ad.status === 'active' ? 'paused' : 'active';
    // 实际应用中应该调用API更新状态
    const updatedAds = ads.map(item => 
      item.id === ad.id ? { ...item, status: newStatus, updatedAt: new Date() } : item
    );
    setAds(updatedAds);
  };

  // 处理广告删除
  const handleDeleteAd = (adId: string) => {
    if (confirm('确定要删除这个广告吗？此操作不可撤销。')) {
      // 实际应用中应该调用API删除广告
      const updatedAds = ads.filter(ad => ad.id !== adId);
      setAds(updatedAds);
    }
  };

  // 处理编辑广告
  const handleEditAd = (ad: Advertisement) => {
    setCurrentAd(ad);
    setShowEditModal(true);
  };

  // 格式化日期
  const formatDate = (date: Date | undefined) => {
    if (!date) return '无截止日期';
    return new Date(date).toLocaleDateString('zh-CN');
  };

  // 计算CTR
  const calculateCTR = (impressions: number, clicks: number) => {
    if (impressions === 0) return '0.00%';
    return ((clicks / impressions) * 100).toFixed(2) + '%';
  };

  // 格式化货币
  const formatCurrency = (amount: number, currency: string = '¥') => {
    return `${currency}${amount.toFixed(2)}`;
  };

  // 计算广告收入
  const calculateAdRevenue = (ad: Advertisement) => {
    if (ad.pricing.model === 'cpm') {
      return formatCurrency((ad.impressions / 1000) * ad.pricing.rate, ad.pricing.currency);
    } else if (ad.pricing.model === 'cpc') {
      return formatCurrency(ad.clicks * ad.pricing.rate, ad.pricing.currency);
    } else if (ad.pricing.model === 'flat') {
      return formatCurrency(ad.pricing.rate, ad.pricing.currency);
    }
    return formatCurrency(0);
  };

  // 获取定价模型显示文本
  const getPricingModelText = (model: 'cpm' | 'cpc' | 'flat') => {
    switch (model) {
      case 'cpm': return '千次展示 (CPM)';
      case 'cpc': return '点击 (CPC)';
      case 'flat': return '固定价格';
      default: return '';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">广告管理</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <PlusCircle size={18} />
          添加广告
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-400 text-sm">广告总数</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats.totalAds}</h3>
              <p className="text-neutral-500 text-sm mt-1">
                <span className="text-green-500">{stats.activeAds}</span> 个活跃中
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <PlusCircle size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-400 text-sm">总展示/点击</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.totalImpressions.toLocaleString()} / {stats.totalClicks.toLocaleString()}
              </h3>
              <p className="text-neutral-500 text-sm mt-1">
                平均CTR: <span className="text-green-500">{stats.averageCTR.toFixed(2)}%</span>
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Eye size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-400 text-sm">总收入</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {formatCurrency(stats.totalRevenue)}
              </h3>
              <p className="text-neutral-500 text-sm mt-1">
                平均每次点击: <span className="text-green-500">
                  {stats.totalClicks > 0 ? formatCurrency(stats.totalRevenue / stats.totalClicks) : '¥0.00'}
                </span>
              </p>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <DollarSign size={24} className="text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* 过滤和搜索 */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="搜索广告..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <select
          value={selectedAdType}
          onChange={(e) => setSelectedAdType(e.target.value)}
          className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="all">所有类型</option>
          <option value="banner">横幅广告</option>
          <option value="sidebar">侧边栏广告</option>
          <option value="inline">内嵌广告</option>
          <option value="popup">弹窗广告</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="all">所有状态</option>
          <option value="active">活跃</option>
          <option value="paused">暂停</option>
          <option value="completed">已完成</option>
          <option value="scheduled">计划中</option>
        </select>
      </div>

      {/* 广告列表 */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                  <button 
                    onClick={() => handleSort('title')} 
                    className="flex items-center gap-1"
                  >
                    广告标题
                    {sortField === 'title' && (
                      <ArrowUpDown size={14} className="text-blue-500" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                  <button 
                    onClick={() => handleSort('type')} 
                    className="flex items-center gap-1"
                  >
                    类型
                    {sortField === 'type' && (
                      <ArrowUpDown size={14} className="text-blue-500" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                  <button 
                    onClick={() => handleSort('sponsorName')} 
                    className="flex items-center gap-1"
                  >
                    赞助商
                    {sortField === 'sponsorName' && (
                      <ArrowUpDown size={14} className="text-blue-500" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                  <button 
                    onClick={() => handleSort('startDate')} 
                    className="flex items-center gap-1"
                  >
                    日期
                    {sortField === 'startDate' && (
                      <ArrowUpDown size={14} className="text-blue-500" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                  <button 
                    onClick={() => handleSort('impressions')} 
                    className="flex items-center gap-1"
                  >
                    展示/点击
                    {sortField === 'impressions' && (
                      <ArrowUpDown size={14} className="text-blue-500" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                  <button 
                    onClick={() => handleSort('status')} 
                    className="flex items-center gap-1"
                  >
                    状态
                    {sortField === 'status' && (
                      <ArrowUpDown size={14} className="text-blue-500" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                  <button 
                    onClick={() => handleSort('priority')} 
                    className="flex items-center gap-1"
                  >
                    优先级
                    {sortField === 'priority' && (
                      <ArrowUpDown size={14} className="text-blue-500" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-neutral-400">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      加载中...
                    </div>
                  </td>
                </tr>
              ) : filteredAndSortedAds.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-neutral-400">
                    没有找到匹配的广告
                  </td>
                </tr>
              ) : (
                filteredAndSortedAds.map(ad => (
                  <tr key={ad.id} className="hover:bg-neutral-800/50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {ad.imageUrl && (
                          <img 
                            src={ad.imageUrl} 
                            alt={ad.title} 
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium text-white">{ad.title}</div>
                          <div className="text-sm text-neutral-400 truncate max-w-xs">{ad.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
                        {ad.type === 'banner' && '横幅广告'}
                        {ad.type === 'sidebar' && '侧边栏广告'}
                        {ad.type === 'inline' && '内嵌广告'}
                        {ad.type === 'popup' && '弹窗广告'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {ad.sponsorLogo && (
                          <img 
                            src={ad.sponsorLogo} 
                            alt={ad.sponsorName} 
                            className="w-6 h-6 rounded object-contain"
                          />
                        )}
                        <span className="text-white">{ad.sponsorName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-white flex items-center gap-1">
                          <Calendar size={14} className="text-neutral-500" />
                          {formatDate(ad.startDate)}
                        </span>
                        {ad.endDate && (
                          <span className="text-neutral-500 text-sm">
                            至 {formatDate(ad.endDate)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <div className="text-white">
                          {ad.impressions.toLocaleString()} / {ad.clicks.toLocaleString()}
                        </div>
                        <div className="text-sm">
                          <span className="text-green-500">{calculateCTR(ad.impressions, ad.clicks)}</span>
                          <span className="text-neutral-500 ml-1">
                            {getPricingModelText(ad.pricing.model)}
                          </span>
                        </div>
                        <div className="text-sm text-yellow-500">
                          {calculateAdRevenue(ad)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={
                        `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ad.status === 'active' ? 'bg-green-900/30 text-green-400' :
                          ad.status === 'paused' ? 'bg-yellow-900/30 text-yellow-400' :
                          ad.status === 'completed' ? 'bg-neutral-700/30 text-neutral-400' :
                          'bg-blue-900/30 text-blue-400'
                        }`
                      }>
                        {ad.status === 'active' && '活跃'}
                        {ad.status === 'paused' && '暂停'}
                        {ad.status === 'completed' && '已完成'}
                        {ad.status === 'scheduled' && '计划中'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-white">{ad.priority}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleAdStatus(ad)}
                          className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                          title={ad.status === 'active' ? '暂停广告' : '激活广告'}
                        >
                          {ad.status === 'active' ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button
                          onClick={() => handleEditAd(ad)}
                          className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                          title="编辑广告"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                          title="删除广告"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 这里可以添加创建和编辑广告的模态框 */}
      {/* 实际应用中应该实现完整的表单 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">创建新广告</h2>
            <p className="text-neutral-400 mb-6">此处应该有完整的广告创建表单</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                创建广告
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && currentAd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">编辑广告: {currentAd.title}</h2>
            <p className="text-neutral-400 mb-6">此处应该有完整的广告编辑表单</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                保存更改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}