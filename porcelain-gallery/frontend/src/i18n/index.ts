import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      about: 'About',
      contact: 'Contact'
    },
    home: {
      title: 'Chinese Porcelain Gallery',
      subtitle: 'Exquisite Collection of Traditional Chinese Ceramics',
      featured: 'Featured Products',
      viewAll: 'View All Products'
    },
    products: {
      title: 'Our Collection',
      filters: {
        dynasty: 'Dynasty',
        shape: 'Shape',
        all: 'All',
        featured: 'Featured'
      },
      details: {
        price: 'Price',
        dimensions: 'Dimensions',
        weight: 'Weight',
        age: 'Age',
        craftsmanship: 'Craftsmanship',
        history: 'Historical Context',
        addToCart: 'Add to Cart',
        viewDetails: 'View Details'
      }
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      total: 'Total',
      checkout: 'Checkout'
    },
    common: {
      loading: 'Loading...',
      error: 'Error occurred',
      retry: 'Retry',
      close: 'Close',
      previous: 'Previous',
      next: 'Next'
    }
  },
  zh: {
    nav: {
      home: '首页',
      products: '产品',
      about: '关于',
      contact: '联系'
    },
    home: {
      title: '中国瓷器艺术馆',
      subtitle: '精美传统中国陶瓷收藏',
      featured: '特色产品',
      viewAll: '查看所有产品'
    },
    products: {
      title: '我们的收藏',
      filters: {
        dynasty: '朝代',
        shape: '器型',
        all: '全部',
        featured: '特色'
      },
      details: {
        price: '价格',
        dimensions: '尺寸',
        weight: '重量',
        age: '年代',
        craftsmanship: '工艺',
        history: '历史背景',
        addToCart: '加入购物车',
        viewDetails: '查看详情'
      }
    },
    cart: {
      title: '购物车',
      empty: '购物车为空',
      total: '总计',
      checkout: '结算'
    },
    common: {
      loading: '加载中...',
      error: '出现错误',
      retry: '重试',
      close: '关闭',
      previous: '上一个',
      next: '下一个'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n