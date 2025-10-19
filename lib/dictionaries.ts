export const dictionaries = {
  zh: {
    common: {
      search: '搜索',
      login: '登录',
      register: '注册',
      logout: '退出',
      profile: '个人资料',
      settings: '设置',
      home: '首页',
      tools: '工具',
      categories: '分类',
      favorites: '收藏',
      loading: '加载中...',
      error: '错误',
      success: '成功',
      cancel: '取消',
      confirm: '确认',
      save: '保存',
      edit: '编辑',
      delete: '删除',
      share: '分享',
      like: '点赞',
      comment: '评论',
      rating: '评分',
      price: '价格',
      free: '免费',
      paid: '付费'
    },
    navigation: {
      aiChat: 'AI聊天',
      imageGenerator: '图像生成',
      blog: '博客',
      about: '关于',
      contact: '联系我们',
      help: '帮助'
    },
    tools: {
      title: 'AI工具导航',
      description: '发现最好的AI工具',
      searchPlaceholder: '搜索AI工具...',
      noResults: '没有找到相关工具',
      loadMore: '加载更多',
      viewDetails: '查看详情',
      addToFavorites: '添加到收藏',
      removeFromFavorites: '从收藏中移除'
    }
  },
  en: {
    common: {
      search: 'Search',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      profile: 'Profile',
      settings: 'Settings',
      home: 'Home',
      tools: 'Tools',
      categories: 'Categories',
      favorites: 'Favorites',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      share: 'Share',
      like: 'Like',
      comment: 'Comment',
      rating: 'Rating',
      price: 'Price',
      free: 'Free',
      paid: 'Paid'
    },
    navigation: {
      aiChat: 'AI Chat',
      imageGenerator: 'Image Generator',
      blog: 'Blog',
      about: 'About',
      contact: 'Contact',
      help: 'Help'
    },
    tools: {
      title: 'AI Tools Navigator',
      description: 'Discover the best AI tools',
      searchPlaceholder: 'Search AI tools...',
      noResults: 'No tools found',
      loadMore: 'Load More',
      viewDetails: 'View Details',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites'
    }
  }
};

export type Dictionary = typeof dictionaries.zh;