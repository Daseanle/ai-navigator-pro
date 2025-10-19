import { createClient } from '@supabase/supabase-js';

// 广告类型定义
export type Advertisement = {
  id: string;
  type: 'banner' | 'sidebar' | 'inline' | 'popup';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  size?: 'small' | 'medium' | 'large';
  title: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  sponsorName: string;
  sponsorLogo?: string;
  sponsorUrl?: string;
  targetPages: string[];
  targetDevices?: ('desktop' | 'tablet' | 'mobile')[];
  startDate: Date;
  endDate?: Date;
  impressions: number;
  clicks: number;
  status: 'active' | 'paused' | 'completed' | 'scheduled';
  priority: number;
  pricing: {
    model: 'cpm' | 'cpc' | 'flat';
    rate: number;
    currency: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

// 广告展示记录
export type AdImpression = {
  id: string;
  adId: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  page: string;
  device: 'desktop' | 'tablet' | 'mobile';
  browser: string;
  country?: string;
  city?: string;
};

// 广告点击记录
export type AdClick = {
  id: string;
  adId: string;
  impressionId: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  page: string;
};

// 广告过滤选项
export type AdFilterOptions = {
  page?: string;
  device?: 'desktop' | 'tablet' | 'mobile';
  adType?: Advertisement['type'];
  position?: Advertisement['position'];
  limit?: number;
};

// 初始化Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 获取符合条件的广告
 */
export async function getAds(options: AdFilterOptions = {}): Promise<Advertisement[]> {
  try {
    // 构建查询
    let query = supabase
      .from('advertisements')
      .select('*')
      .eq('status', 'active')
      .lte('startDate', new Date().toISOString())
      .order('priority', { ascending: false });

    // 应用过滤条件
    if (options.page) {
      query = query.filter('targetPages', 'cs', `{${options.page}}`);
    }

    if (options.device) {
      query = query.filter('targetDevices', 'cs', `{${options.device}}`);
    }

    if (options.adType) {
      query = query.eq('type', options.adType);
    }

    if (options.position) {
      query = query.eq('position', options.position);
    }

    // 应用结束日期过滤和限制
    query = query.or(`endDate.is.null,endDate.gt.${new Date().toISOString()}`);

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching ads:', error);
      return [];
    }

    return data as unknown as Advertisement[];
  } catch (error) {
    console.error('Error in getAds:', error);
    return [];
  }
}

/**
 * 记录广告展示
 */
export async function logAdImpression(adId: string, data: Omit<AdImpression, 'id' | 'timestamp'>): Promise<string | null> {
  try {
    // 更新广告展示计数
    await supabase
      .from('advertisements')
      .update({ impressions: supabase.rpc('increment', { inc_amount: 1 }) })
      .eq('id', adId);

    // 记录展示详情
    const { data: impressionData, error } = await supabase
      .from('ad_impressions')
      .insert({
        ...data,
        adId,
        timestamp: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error logging ad impression:', error);
      return null;
    }

    return impressionData.id;
  } catch (error) {
    console.error('Error in logAdImpression:', error);
    return null;
  }
}

/**
 * 记录广告点击
 */
export async function logAdClick(adId: string, impressionId: string, data: Omit<AdClick, 'id' | 'adId' | 'impressionId' | 'timestamp'>): Promise<boolean> {
  try {
    // 更新广告点击计数
    await supabase
      .from('advertisements')
      .update({ clicks: supabase.rpc('increment', { inc_amount: 1 }) })
      .eq('id', adId);

    // 记录点击详情
    const { error } = await supabase
      .from('ad_clicks')
      .insert({
        ...data,
        adId,
        impressionId,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Error logging ad click:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in logAdClick:', error);
    return false;
  }
}

/**
 * 获取广告统计数据
 */
export async function getAdStats(adId: string, startDate?: Date, endDate?: Date): Promise<{ impressions: number; clicks: number; ctr: number }> {
  try {
    // 构建查询时间范围
    const start = startDate ? startDate.toISOString() : undefined;
    const end = endDate ? endDate.toISOString() : undefined;

    // 获取广告数据
    const { data, error } = await supabase
      .from('advertisements')
      .select('impressions, clicks')
      .eq('id', adId)
      .single();

    if (error) {
      console.error('Error fetching ad stats:', error);
      return { impressions: 0, clicks: 0, ctr: 0 };
    }

    const impressions = data.impressions || 0;
    const clicks = data.clicks || 0;
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

    return { impressions, clicks, ctr };
  } catch (error) {
    console.error('Error in getAdStats:', error);
    return { impressions: 0, clicks: 0, ctr: 0 };
  }
}

/**
 * 创建新广告
 */
export async function createAd(adData: Omit<Advertisement, 'id' | 'impressions' | 'clicks' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('advertisements')
      .insert({
        ...adData,
        impressions: 0,
        clicks: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating ad:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Error in createAd:', error);
    return null;
  }
}

/**
 * 更新广告
 */
export async function updateAd(id: string, adData: Partial<Omit<Advertisement, 'id' | 'impressions' | 'clicks' | 'createdAt' | 'updatedAt'>>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('advertisements')
      .update({
        ...adData,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating ad:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateAd:', error);
    return false;
  }
}

/**
 * 删除广告
 */
export async function deleteAd(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('advertisements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting ad:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteAd:', error);
    return false;
  }
}