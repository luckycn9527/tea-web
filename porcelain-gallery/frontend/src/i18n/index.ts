import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      admin: 'Admin',
      logout: 'Logout'
    },
    home: {
      title: 'Chinese Porcelain Gallery',
      subtitle: 'Exquisite Collection of Traditional Chinese Ceramics',
      viewAll: 'View All Products',
      hero: {
        title: 'Express Your Unique Style',
        subtitle: 'MOST TRUSTED SOURCE FOR AUTHENTIC CHINESE PORCELAIN MASTERPIECES',
        cta: 'EXPLORE COLLECTION'
      },
      bestSellers: {
        title: 'Shop Best Sellers',
        subtitle: 'Discover our most popular porcelain masterpieces',
        topRated: 'Top Rated'
      },
      dynasties: {
        title: 'Explore by Dynasty',
        subtitle: 'Discover porcelain from different historical periods'
      },
      featured: {
        title: 'Featured Products',
        subtitle: 'Handpicked masterpieces from our collection'
      }
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
      next: 'Next',
      home: 'Home',
      products: 'Products',
      backToHome: 'Back to Home'
    },
    auth: {
      login: {
        title: 'Welcome Back',
        subtitle: 'Sign in to your account',
        username: 'Username or Email',
        usernamePlaceholder: 'Enter your username or email',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        loginButton: 'Sign In',
        loggingIn: 'Signing In...',
        noAccount: "Don't have an account?",
        registerLink: 'Sign up here'
      },
      register: {
        title: 'Create Account',
        subtitle: 'Join our porcelain gallery community',
        username: 'Username',
        usernamePlaceholder: 'Choose a username',
        email: 'Email',
        emailPlaceholder: 'Enter your email address',
        password: 'Password',
        passwordPlaceholder: 'Create a strong password',
        confirmPassword: 'Confirm Password',
        confirmPasswordPlaceholder: 'Confirm your password',
        passwordStrength: 'Password Strength',
        registerButton: 'Create Account',
        registering: 'Creating Account...',
        hasAccount: 'Already have an account?',
        loginLink: 'Sign in here'
      },
      languageToggle: '中文 / English'
    },
    product: {
      description: 'Description',
      craftsmanship: 'Craftsmanship',
      history: 'History',
      addToCart: 'Add to Cart',
      relatedProducts: 'Related Products'
    },
    admin: {
      title: 'Admin Panel',
      logout: 'Logout',
      navigation: {
        dashboard: 'Dashboard',
        products: 'Products',
        dynasties: 'Dynasties',
        shapes: 'Shapes',
        users: 'Users',
        homepageContent: 'Homepage Content',
        mediaLibrary: 'Media Library',
        bestSellers: 'Best Sellers',
        settings: 'Settings'
      },
      dashboard: {
        welcome: 'Welcome to Admin Panel',
        subtitle: 'Manage your porcelain gallery with ease',
        totalProducts: 'Total Products',
        bestSellers: 'Best Sellers',
        dynasties: 'Dynasties',
        shapes: 'Shapes',
        available: 'Available',
        featured: 'Featured',
        historical: 'Historical',
        varieties: 'Varieties',
        quickActions: 'Quick Actions'
      },
      products: {
        title: 'Product Management',
        subtitle: 'Manage products and inventory',
        addProduct: 'Add Product',
        editProduct: 'Edit Product',
        image: 'Image',
        name: 'Name',
        nameEn: 'Name (English)',
        price: 'Price',
        dynasty: 'Dynasty',
        status: 'Status',
        actions: 'Actions',
        available: 'Available',
        unavailable: 'Unavailable',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        save: 'Save',
        saveSuccess: 'Product saved successfully!',
        saveError: 'Failed to save product',
        confirmDelete: 'Are you sure you want to delete this product?',
        deleteSuccess: 'Product deleted successfully!',
        primaryImage: 'Primary Image',
        additionalImages: 'Additional Images',
        selectImage: 'Select Image',
        addImage: 'Add Image',
        dimensions: 'Dimensions',
        weight: 'Weight',
        age: 'Age',
        material: 'Material',
        origin: 'Origin',
        addToBestSellers: 'Add to Best Sellers',
        inBestSellers: 'In Best Sellers',
        addToBestSellersSuccess: 'Product added to Best Sellers successfully!',
        addToBestSellersError: 'Failed to add product to Best Sellers',
        removeFromBestSellersSuccess: 'Product removed from Best Sellers successfully!',
        removeFromBestSellersError: 'Failed to remove product from Best Sellers',
        maxBestSellersReached: 'Maximum 8 Best Sellers allowed'
      },
      dynasties: {
        title: 'Dynasty Management',
        subtitle: 'Manage dynasty categories',
        addDynasty: 'Add Dynasty',
        editDynasty: 'Edit Dynasty',
        name: 'Name',
        nameCn: 'Name (Chinese)',
        period: 'Period',
        description: 'Description',
        image: 'Image',
        selectImage: 'Select Image',
        enabled: 'Enabled',
        disabled: 'Disabled',
        enable: 'Enable',
        disable: 'Disable',
        edit: 'Edit',
        cancel: 'Cancel',
        save: 'Save',
        saveSuccess: 'Dynasty saved successfully!',
        saveError: 'Failed to save dynasty'
      },
      shapes: {
        title: 'Shape Management',
        subtitle: 'Manage shape categories',
        addShape: 'Add Shape',
        editShape: 'Edit Shape',
        name: 'Name',
        description: 'Description',
        sortOrder: 'Sort Order',
        enabled: 'Enabled',
        disabled: 'Disabled',
        enable: 'Enable',
        disable: 'Disable',
        edit: 'Edit',
        cancel: 'Cancel',
        save: 'Save',
        saveSuccess: 'Shape saved successfully!',
        saveError: 'Failed to save shape'
      },
      bestSellers: {
        title: 'Best Sellers Management',
        subtitle: 'Configure best selling products',
        featured: 'Featured',
        edit: 'Edit',
        remove: 'Remove',
        manageProducts: 'Manage Products'
      },
      settings: {
        title: 'Settings',
        subtitle: 'Configure site settings',
        language: 'Language'
      },
      siteSettings: {
        title: 'Site Settings',
        siteInformation: 'Site Information',
        siteTitle: 'Site Title',
        siteDescription: 'Site Description',
        phone: 'Phone',
        email: 'Email',
        address: 'Address',
        saveSettings: 'Save Settings'
      },
      management: {
        dynastyManagement: 'Dynasty Management',
        addDynasty: 'Add Dynasty',
        shapeManagement: 'Shape Management',
        addShape: 'Add Shape',
        mediaLibrary: 'Media Library',
        uploadImage: 'Upload Image',
        bestSellersManagement: 'Best Sellers Management',
        editProduct: 'Edit Product',
        addProduct: 'Add Product',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit'
      },
      productEdit: {
        editProduct: 'Edit Product',
        addProduct: 'Add Product',
        nameEnglish: 'Name (English)',
        nameChinese: 'Name (Chinese)',
        description: 'Description',
        price: 'Price',
        stockQuantity: 'Stock Quantity',
        dynasty: 'Dynasty',
        shape: 'Shape',
        dimensions: 'Dimensions',
        weight: 'Weight',
        age: 'Age',
        featured: 'Featured',
        available: 'Available',
        primaryImage: 'Primary Image',
        additionalImages: 'Additional Images',
        changePrimaryImage: 'Change Primary Image',
        noImage: 'No image',
        selectDynasty: 'Select Dynasty',
        selectShape: 'Select Shape',
        save: 'Save',
        cancel: 'Cancel',
        remove: 'Remove',
        addImage: 'Add Image',
        addAdditionalImage: 'Add Additional Image',
        saving: 'Saving...',
        saveSuccess: 'Product saved successfully!'
      },
      imageSelector: {
        selectImage: 'Select Image',
        cancel: 'Cancel'
      },
      dynastyEdit: {
        editDynasty: 'Edit Dynasty',
        addNewDynasty: 'Add New Dynasty',
        nameEnglish: 'Name (English)',
        nameChinese: 'Name (Chinese)',
        description: 'Description',
        sortOrder: 'Sort Order',
        enabled: 'Enabled',
        save: 'Save',
        cancel: 'Cancel'
      },
      shapeEdit: {
        editShape: 'Edit Shape',
        addNewShape: 'Add New Shape',
        nameEnglish: 'Name (English)',
        nameChinese: 'Name (Chinese)',
        description: 'Description',
        sortOrder: 'Sort Order',
        enabled: 'Enabled',
        save: 'Save',
        cancel: 'Cancel'
      },
      mediaUpload: {
        uploadImage: 'Upload Image',
        name: 'Name',
        description: 'Description',
        altText: 'Alt Text',
        upload: 'Upload',
        cancel: 'Cancel'
      },
      collections: {
        rareDynastyCollection: 'Rare Dynasty Collection',
        title: 'Title',
        description: 'Description',
        buttonText: 'Button Text',
        image: 'Image',
        saveCollection: 'Save Collection',
        heritageStory: 'Heritage Story',
        description1: 'Description 1',
        description2: 'Description 2'
      },
      content: {
        contentManagement: 'Content Management',
        bestSellersTitle: 'Best Sellers Title',
        rareDynastyTitle: 'Rare Dynasty Title',
        rareDynastyDescription: 'Rare Dynasty Description',
        saveContent: 'Save Content'
      }
    }
  },
  zh: {
    nav: {
      home: '首页',
      products: '产品',
      about: '关于',
      contact: '联系',
      login: '登录',
      register: '注册',
      admin: '管理',
      logout: '退出'
    },
    home: {
      title: '中国瓷器艺术馆',
      subtitle: '精美传统中国陶瓷收藏',
      viewAll: '查看所有产品',
      hero: {
        title: '展现您的独特风格',
        subtitle: '最值得信赖的中国瓷器杰作来源',
        cta: '探索收藏'
      },
      bestSellers: {
        title: '热销产品',
        subtitle: '发现我们最受欢迎的瓷器杰作',
        topRated: '顶级推荐'
      },
      dynasties: {
        title: '按朝代探索',
        subtitle: '发现不同历史时期的瓷器'
      },
      featured: {
        title: '特色产品',
        subtitle: '从我们的收藏中精心挑选的杰作'
      }
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
      next: '下一个',
      home: '首页',
      products: '产品',
      backToHome: '返回首页'
    },
    auth: {
      login: {
        title: '欢迎回来',
        subtitle: '登录您的账户',
        username: '用户名或邮箱',
        usernamePlaceholder: '请输入用户名或邮箱',
        password: '密码',
        passwordPlaceholder: '请输入密码',
        loginButton: '登录',
        loggingIn: '登录中...',
        noAccount: '还没有账户？',
        registerLink: '立即注册'
      },
      register: {
        title: '创建账户',
        subtitle: '加入我们的瓷器画廊社区',
        username: '用户名',
        usernamePlaceholder: '选择一个用户名',
        email: '邮箱',
        emailPlaceholder: '请输入邮箱地址',
        password: '密码',
        passwordPlaceholder: '创建一个强密码',
        confirmPassword: '确认密码',
        confirmPasswordPlaceholder: '确认您的密码',
        passwordStrength: '密码强度',
        registerButton: '创建账户',
        registering: '创建账户中...',
        hasAccount: '已有账户？',
        loginLink: '立即登录'
      },
      languageToggle: 'English / 中文'
    },
    product: {
      description: '描述',
      craftsmanship: '工艺',
      history: '历史',
      addToCart: '加入购物车',
      relatedProducts: '相关产品'
    },
    admin: {
      title: '管理面板',
      logout: '退出登录',
      navigation: {
        dashboard: '仪表板',
        products: '产品管理',
        dynasties: '朝代管理',
        shapes: '器型管理',
        users: '用户管理',
        homepageContent: '首页内容',
        mediaLibrary: '媒体库',
        bestSellers: '推荐产品',
        settings: '设置'
      },
      dashboard: {
        welcome: '欢迎使用管理面板',
        subtitle: '轻松管理您的瓷器艺术馆',
        totalProducts: '总产品数',
        bestSellers: '推荐产品',
        dynasties: '朝代',
        shapes: '器型',
        available: '可用',
        featured: '特色',
        historical: '历史',
        varieties: '种类',
        quickActions: '快速操作'
      },
      products: {
        title: '产品管理',
        subtitle: '管理产品和库存',
        addProduct: '添加产品',
        editProduct: '编辑产品',
        image: '图片',
        name: '名称',
        nameEn: '名称 (英文)',
        price: '价格',
        dynasty: '朝代',
        status: '状态',
        actions: '操作',
        available: '可用',
        unavailable: '不可用',
        edit: '编辑',
        delete: '删除',
        cancel: '取消',
        save: '保存',
        saveSuccess: '产品保存成功！',
        saveError: '保存产品失败',
        confirmDelete: '确定要删除这个产品吗？',
        deleteSuccess: '产品删除成功！',
        primaryImage: '主图',
        additionalImages: '附加图片',
        selectImage: '选择图片',
        addImage: '添加图片',
        dimensions: '尺寸',
        weight: '重量',
        age: '年代',
        material: '材质',
        origin: '产地',
        addToBestSellers: '添加到热销产品',
        inBestSellers: '已在热销产品中',
        addToBestSellersSuccess: '产品已成功添加到热销产品！',
        addToBestSellersError: '添加产品到热销产品失败',
        removeFromBestSellersSuccess: '产品已成功从热销产品中移除！',
        removeFromBestSellersError: '从热销产品中移除产品失败',
        maxBestSellersReached: '最多允许8个热销产品'
      },
      dynasties: {
        title: '朝代管理',
        subtitle: '管理朝代分类',
        addDynasty: '添加朝代',
        editDynasty: '编辑朝代',
        name: '名称',
        nameCn: '名称 (中文)',
        period: '时期',
        description: '描述',
        image: '图片',
        selectImage: '选择图片',
        enabled: '已启用',
        disabled: '已禁用',
        enable: '启用',
        disable: '禁用',
        edit: '编辑',
        cancel: '取消',
        save: '保存',
        saveSuccess: '朝代保存成功！',
        saveError: '保存朝代失败'
      },
      shapes: {
        title: '器型管理',
        subtitle: '管理器型分类',
        addShape: '添加器型',
        editShape: '编辑器型',
        name: '名称',
        description: '描述',
        sortOrder: '排序',
        enabled: '已启用',
        disabled: '已禁用',
        enable: '启用',
        disable: '禁用',
        edit: '编辑',
        cancel: '取消',
        save: '保存',
        saveSuccess: '器型保存成功！',
        saveError: '保存器型失败'
      },
      bestSellers: {
        title: '推荐产品管理',
        subtitle: '配置热销产品',
        featured: '推荐',
        edit: '编辑',
        remove: '移除',
        manageProducts: '管理产品'
      },
      settings: {
        title: '设置',
        subtitle: '配置网站设置',
        language: '语言'
      },
      siteSettings: {
        title: '网站设置',
        siteInformation: '网站信息',
        siteTitle: '网站标题',
        siteDescription: '网站描述',
        phone: '电话',
        email: '邮箱',
        address: '地址',
        saveSettings: '保存设置'
      },
      management: {
        dynastyManagement: '朝代管理',
        addDynasty: '添加朝代',
        shapeManagement: '器型管理',
        addShape: '添加器型',
        mediaLibrary: '媒体库',
        uploadImage: '上传图片',
        bestSellersManagement: '推荐产品管理',
        editProduct: '编辑产品',
        addProduct: '添加产品',
        save: '保存',
        cancel: '取消',
        delete: '删除',
        edit: '编辑'
      },
      productEdit: {
        editProduct: '编辑产品',
        addProduct: '添加产品',
        nameEnglish: '产品名称 (英文)',
        nameChinese: '产品名称 (中文)',
        description: '描述',
        price: '价格',
        stockQuantity: '库存数量',
        dynasty: '朝代',
        shape: '器型',
        dimensions: '尺寸',
        weight: '重量',
        age: '年代',
        featured: '特色产品',
        available: '可用',
        primaryImage: '主图',
        additionalImages: '附加图片',
        changePrimaryImage: '更换主图',
        noImage: '无图片',
        selectDynasty: '选择朝代',
        selectShape: '选择器型',
        save: '保存',
        cancel: '取消',
        remove: '移除',
        addImage: '添加图片',
        addAdditionalImage: '添加附加图片',
        saving: '保存中...',
        saveSuccess: '产品保存成功！'
      },
      imageSelector: {
        selectImage: '选择图片',
        cancel: '取消'
      },
      dynastyEdit: {
        editDynasty: '编辑朝代',
        addNewDynasty: '添加新朝代',
        nameEnglish: '名称 (英文)',
        nameChinese: '名称 (中文)',
        description: '描述',
        sortOrder: '排序',
        enabled: '启用',
        save: '保存',
        cancel: '取消'
      },
      shapeEdit: {
        editShape: '编辑器型',
        addNewShape: '添加新器型',
        nameEnglish: '名称 (英文)',
        nameChinese: '名称 (中文)',
        description: '描述',
        sortOrder: '排序',
        enabled: '启用',
        save: '保存',
        cancel: '取消'
      },
      mediaUpload: {
        uploadImage: '上传图片',
        name: '名称',
        description: '描述',
        altText: '替代文本',
        upload: '上传',
        cancel: '取消'
      },
      collections: {
        rareDynastyCollection: '稀有朝代收藏',
        title: '标题',
        description: '描述',
        buttonText: '按钮文本',
        image: '图片',
        saveCollection: '保存收藏',
        heritageStory: '传承故事',
        description1: '描述 1',
        description2: '描述 2'
      },
      content: {
        contentManagement: '内容管理',
        bestSellersTitle: '推荐产品标题',
        rareDynastyTitle: '稀有朝代标题',
        rareDynastyDescription: '稀有朝代描述',
        saveContent: '保存内容'
      }
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