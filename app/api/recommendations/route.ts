import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { RecommendationService } from '@/lib/recommendationService';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'hybrid';
    const limit = parseInt(searchParams.get('limit') || '10');

    const recommendationService = new RecommendationService();
    let recommendations;

    switch (type) {
      case 'collaborative':
        recommendations = await recommendationService.getCollaborativeRecommendations(user.id, limit);
        break;
      case 'content':
        recommendations = await recommendationService.getContentBasedRecommendations(user.id, limit);
        break;
      case 'popular':
        recommendations = await recommendationService.getPopularRecommendations(limit);
        break;
      default:
        recommendations = await recommendationService.getHybridRecommendations(user.id, limit);
    }

    // 获取推荐工具的详细信息
    const toolIds = recommendations.map(r => r.toolId);
    const { data: tools } = await supabase
      .from('tools')
      .select(`
        *,
        tool_tags(
          tags(name)
        )
      `)
      .in('id', toolIds);

    // 合并推荐分数和工具信息
    const enrichedRecommendations = recommendations.map(rec => {
      const tool = tools?.find(t => t.id === rec.toolId);
      return {
        ...tool,
        recommendationScore: rec.score,
        recommendationReasons: rec.reasons
      };
    }).filter(Boolean);

    return NextResponse.json({
      recommendations: enrichedRecommendations,
      type,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}