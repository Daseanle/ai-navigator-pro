import { createClient } from '@supabase/supabase-js';

interface UserBehavior {
  userId: string;
  toolId: string;
  action: 'view' | 'like' | 'bookmark' | 'comment' | 'share';
  timestamp: Date;
  duration?: number;
}

interface RecommendationScore {
  toolId: string;
  score: number;
  reasons: string[];
}

export class RecommendationService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  // 基于协同过滤的推荐
  async getCollaborativeRecommendations(userId: string, limit: number = 10): Promise<RecommendationScore[]> {
    try {
      // 1. 获取用户行为数据
      const { data: userBehaviors } = await this.supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', userId)
        .in('action', ['view', 'like', 'bookmark'])
        .order('created_at', { ascending: false })
        .limit(100);

      if (!userBehaviors || userBehaviors.length === 0) {
        return this.getPopularRecommendations(limit);
      }

      // 2. 找到相似用户
      const userToolIds = userBehaviors.map(b => b.data?.toolId).filter(Boolean);
      const { data: similarUsers } = await this.supabase
        .from('user_analytics')
        .select('user_id, data')
        .in('data->toolId', userToolIds)
        .neq('user_id', userId)
        .in('action', ['like', 'bookmark']);

      // 3. 计算用户相似度并推荐
      const recommendations = new Map<string, RecommendationScore>();
      
      similarUsers?.forEach(behavior => {
        const toolId = behavior.data?.toolId;
        if (toolId && !userToolIds.includes(toolId)) {
          const existing = recommendations.get(toolId);
          if (existing) {
            existing.score += 1;
          } else {
            recommendations.set(toolId, {
              toolId,
              score: 1,
              reasons: ['相似用户喜欢']
            });
          }
        }
      });

      return Array.from(recommendations.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Collaborative filtering error:', error);
      return this.getPopularRecommendations(limit);
    }
  }

  // 基于内容的推荐
  async getContentBasedRecommendations(userId: string, limit: number = 10): Promise<RecommendationScore[]> {
    try {
      // 1. 获取用户喜欢的工具类别和标签
      const { data: userPreferences } = await this.supabase
        .from('user_analytics')
        .select(`
          data,
          tools!inner(
            category,
            tool_tags(
              tags(name)
            )
          )
        `)
        .eq('user_id', userId)
        .in('action', ['like', 'bookmark'])
        .limit(50);

      if (!userPreferences || userPreferences.length === 0) {
        return this.getPopularRecommendations(limit);
      }

      // 2. 分析用户偏好
      const categoryScores = new Map<string, number>();
      const tagScores = new Map<string, number>();

      userPreferences.forEach(pref => {
        const tool = pref.tools;
        if (tool) {
          // 类别偏好
          const category = tool.category;
          categoryScores.set(category, (categoryScores.get(category) || 0) + 1);

          // 标签偏好
          tool.tool_tags?.forEach((tt: any) => {
            const tagName = tt.tags?.name;
            if (tagName) {
              tagScores.set(tagName, (tagScores.get(tagName) || 0) + 1);
            }
          });
        }
      });

      // 3. 基于偏好推荐工具
      const topCategories = Array.from(categoryScores.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([category]) => category);

      const { data: recommendedTools } = await this.supabase
        .from('tools')
        .select(`
          id,
          category,
          upvotes,
          tool_tags(
            tags(name)
          )
        `)
        .in('category', topCategories)
        .order('upvotes', { ascending: false })
        .limit(limit * 2);

      // 4. 计算推荐分数
      const recommendations: RecommendationScore[] = [];
      
      recommendedTools?.forEach(tool => {
        let score = 0;
        const reasons: string[] = [];

        // 类别匹配分数
        const categoryScore = categoryScores.get(tool.category) || 0;
        score += categoryScore * 2;
        if (categoryScore > 0) {
          reasons.push(`${tool.category}类别匹配`);
        }

        // 标签匹配分数
        tool.tool_tags?.forEach((tt: any) => {
          const tagName = tt.tags?.name;
          const tagScore = tagScores.get(tagName) || 0;
          score += tagScore;
          if (tagScore > 0) {
            reasons.push(`${tagName}标签匹配`);
          }
        });

        // 热度分数
        score += (tool.upvotes || 0) * 0.1;

        if (score > 0) {
          recommendations.push({
            toolId: tool.id,
            score,
            reasons
          });
        }
      });

      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Content-based filtering error:', error);
      return this.getPopularRecommendations(limit);
    }
  }

  // 热门推荐（兜底方案）
  async getPopularRecommendations(limit: number = 10): Promise<RecommendationScore[]> {
    try {
      const { data: popularTools } = await this.supabase
        .from('tools')
        .select('id, upvotes')
        .order('upvotes', { ascending: false })
        .limit(limit);

      return popularTools?.map(tool => ({
        toolId: tool.id,
        score: tool.upvotes || 0,
        reasons: ['热门推荐']
      })) || [];
    } catch (error) {
      console.error('Popular recommendations error:', error);
      return [];
    }
  }

  // 混合推荐算法
  async getHybridRecommendations(userId: string, limit: number = 10): Promise<RecommendationScore[]> {
    try {
      const [collaborative, contentBased, popular] = await Promise.all([
        this.getCollaborativeRecommendations(userId, Math.ceil(limit * 0.4)),
        this.getContentBasedRecommendations(userId, Math.ceil(limit * 0.4)),
        this.getPopularRecommendations(Math.ceil(limit * 0.2))
      ]);

      // 合并和去重
      const combinedMap = new Map<string, RecommendationScore>();
      
      [...collaborative, ...contentBased, ...popular].forEach(rec => {
        const existing = combinedMap.get(rec.toolId);
        if (existing) {
          existing.score += rec.score * 0.5; // 降权重避免重复
          existing.reasons = [...new Set([...existing.reasons, ...rec.reasons])];
        } else {
          combinedMap.set(rec.toolId, { ...rec });
        }
      });

      return Array.from(combinedMap.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Hybrid recommendations error:', error);
      return this.getPopularRecommendations(limit);
    }
  }
}