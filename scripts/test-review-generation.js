/**
 * 测试工具评测生成功能的脚本
 * 
 * 使用方法：
 * 1. 确保已配置环境变量（API_KEY, OPENROUTER_API_KEY等）
 * 2. 运行: node scripts/test-review-generation.js
 */

const fetch = require('node-fetch');

// 配置
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_KEY = process.env.API_KEY || '';

// 测试单个工具评测生成
async function testSingleReviewGeneration() {
  console.log('测试单个工具评测生成...');
  
  try {
    const response = await fetch(`${API_URL}/api/tools/reviews/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        toolId: 1, // 替换为实际存在的工具ID
        toolName: '测试工具',
        toolDescription: '这是一个用于测试评测生成功能的AI工具',
        toolWebsite: 'https://example.com',
        toolCategories: ['内容创作', '生产力工具']
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ 单个评测生成成功:', result.message);
      console.log('评测ID:', result.review?.id);
    } else {
      console.error('❌ 单个评测生成失败:', result.error);
    }
  } catch (error) {
    console.error('❌ 单个评测生成异常:', error.message);
  }
}

// 测试批量工具评测生成
async function testBatchReviewGeneration() {
  console.log('\n测试批量工具评测生成...');
  
  try {
    const response = await fetch(`${API_URL}/api/tools/reviews/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        limit: 3,
        skipExisting: true
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ 批量评测生成成功:', result.message);
      console.log(`处理工具数: ${result.processed}`);
      console.log(`成功: ${result.results?.length || 0}`);
      console.log(`失败: ${result.errors?.length || 0}`);
    } else {
      console.error('❌ 批量评测生成失败:', result.error);
    }
  } catch (error) {
    console.error('❌ 批量评测生成异常:', error.message);
  }
}

// 测试获取评测历史
async function testGetReviewHistory() {
  console.log('\n测试获取评测历史...');
  
  try {
    const response = await fetch(`${API_URL}/api/tools/reviews/history?page=1&pageSize=5`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ 获取评测历史成功');
      console.log(`记录数: ${result.data?.length || 0}`);
      console.log(`总记录数: ${result.pagination?.total || 0}`);
    } else {
      console.error('❌ 获取评测历史失败:', result.error);
    }
  } catch (error) {
    console.error('❌ 获取评测历史异常:', error.message);
  }
}

// 测试获取评测状态
async function testGetReviewStatus() {
  console.log('\n测试获取评测状态...');
  
  try {
    const response = await fetch(`${API_URL}/api/tools/reviews/status`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ 获取评测状态成功');
      console.log(`自动化状态: ${result.isAutomated ? '已启用' : '已禁用'}`);
      console.log(`待评测工具数: ${result.pendingTools || 0}`);
      console.log(`下次计划运行: ${result.settings?.nextRun || '未设置'}`);
    } else {
      console.error('❌ 获取评测状态失败:', result.error);
    }
  } catch (error) {
    console.error('❌ 获取评测状态异常:', error.message);
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('开始测试工具评测功能...');
  console.log('API URL:', API_URL);
  console.log('-----------------------------------');
  
  await testGetReviewStatus();
  await testGetReviewHistory();
  await testSingleReviewGeneration();
  await testBatchReviewGeneration();
  
  console.log('\n-----------------------------------');
  console.log('测试完成!');
}

runAllTests();