import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { public: true } // 首页可以自由浏览
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
      meta: { public: true } // 产品页面公开访问
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
      meta: { public: true } // 产品详情页公开访问
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      meta: { requiresAuth: true } // 购物车需要登录
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { public: true } // 关于页面公开访问
    },
    // 独立的管理后台路由
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/AdminLoginView.vue'),
      meta: { public: true, requiresGuest: true } // 管理登录页面，已登录用户不能访问
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAdminAuth: true } // 需要管理员认证
    },
    {
      path: '/admin/dynasties',
      name: 'admin-dynasties',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAdminAuth: true } // 需要管理员认证
    },
    {
      path: '/admin/shapes',
      name: 'admin-shapes',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAdminAuth: true } // 需要管理员认证
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAdminAuth: true } // 需要管理员认证
    },
    // 重定向旧的admin路由到products
    {
      path: '/admin',
      redirect: '/admin/products'
    },
    // 重定向dashboard到products
    {
      path: '/admin/dashboard',
      redirect: '/admin/products'
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue'),
      meta: { public: true } // 测试页面可以自由浏览
    },
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  // 检查是否为管理后台路由
  if (to.path.startsWith('/admin')) {
    // 管理后台独立认证逻辑
    const adminToken = localStorage.getItem('admin_token')
    const adminUser = localStorage.getItem('admin_user')
    
    // 管理登录页面
    if (to.path === '/admin/login') {
      if (adminToken && adminUser) {
        // 已登录，重定向到产品管理页面
        next('/admin/products')
        return
      }
      next()
      return
    }
    
    // 其他管理页面需要认证
    if (to.meta.requiresAdminAuth) {
      if (!adminToken || !adminUser) {
        // 未认证，重定向到管理登录页
        next('/admin/login')
        return
      }
      
      try {
        const user = JSON.parse(adminUser)
        if (user.role !== 'admin') {
          // 非管理员，重定向到管理登录页
          next('/admin/login')
          return
        }
      } catch (error) {
        // 用户数据解析失败，重定向到管理登录页
        next('/admin/login')
        return
      }
    }
    
    next()
    return
  }
  
  // 前端页面认证逻辑
  const authStore = useAuthStore()
  
  // Initialize auth if not already done
  if (!authStore.isAuthenticated) {
    authStore.initializeAuth()
  }

  // Public routes - no authentication required
  if (to.meta.public) {
    next()
    return
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Show auth modal instead of redirecting
      if (typeof window !== 'undefined' && window.showAuthModal) {
        window.showAuthModal('login', to.fullPath)
      }
      // Don't proceed to the route
      return
    }

    // Check if route requires admin role
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      // Redirect to home page if not admin
      next({ name: 'home' })
      return
    }
  }

  // Check if route requires guest (not logged in)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Redirect to appropriate page based on role
    if (authStore.isAdmin) {
      next({ name: 'admin' })
    } else {
      next({ name: 'home' })
    }
    return
  }

  next()
})

export default router
