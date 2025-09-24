<template>
  <div class="user-management">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">用户管理</h2>
      <p class="text-gray-600">查看和管理所有注册用户的信息</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">总用户数</p>
            <p class="text-3xl font-bold text-gray-900">{{ totalUsers }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <span class="text-2xl">👥</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">活跃用户</p>
            <p class="text-3xl font-bold text-gray-900">{{ activeUsers }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <span class="text-2xl">✅</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">管理员</p>
            <p class="text-3xl font-bold text-gray-900">{{ adminUsers }}</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-full">
            <span class="text-2xl">👑</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">本月新增</p>
            <p class="text-3xl font-bold text-gray-900">{{ newUsersThisMonth }}</p>
          </div>
          <div class="p-3 bg-yellow-100 rounded-full">
            <span class="text-2xl">📈</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索用户名或邮箱..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex gap-2">
          <select
            v-model="roleFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有角色</option>
            <option value="user">普通用户</option>
            <option value="admin">管理员</option>
          </select>
          <select
            v-model="statusFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有状态</option>
            <option value="active">活跃</option>
            <option value="inactive">非活跃</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">用户列表</h3>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600">加载中...</p>
        </div>
      </div>

      <!-- 用户表格 -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                用户信息
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                角色
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                注册时间
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最后登录
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-700">
                        {{ user.username.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                ]">
                  {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  user.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ user.is_active ? '活跃' : '非活跃' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.last_login_at ? formatDate(user.last_login_at) : '从未登录' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewUser(user)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    查看
                  </button>
                  <button
                    @click="editUser(user)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    编辑
                  </button>
                  <button
                    @click="toggleUserStatus(user)"
                    :class="[
                      'hover:text-gray-900',
                      user.is_active ? 'text-red-600' : 'text-green-600'
                    ]"
                  >
                    {{ user.is_active ? '禁用' : '启用' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="!loading && users.length > 0" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredUsers.length) }} 条，
            共 {{ filteredUsers.length }} 条记录
          </div>
          <div class="flex space-x-2">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span class="px-3 py-1 text-sm">
              第 {{ currentPage }} 页
            </span>
            <button
              @click="currentPage = Math.min(Math.ceil(filteredUsers.length / pageSize), currentPage + 1)"
              :disabled="currentPage >= Math.ceil(filteredUsers.length / pageSize)"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户详情模态框 -->
    <div v-if="showUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">用户详情</h3>
          <button @click="showUserModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="selectedUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">用户名</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedUser.username }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">邮箱</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedUser.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">角色</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedUser.role === 'admin' ? '管理员' : '普通用户' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">状态</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedUser.is_active ? '活跃' : '非活跃' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">注册时间</label>
            <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedUser.created_at) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">最后登录</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedUser.last_login_at ? formatDate(selectedUser.last_login_at) : '从未登录' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const users = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showUserModal = ref(false)
const selectedUser = ref<any>(null)

// 计算属性
const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.filter(user => user.is_active).length)
const adminUsers = computed(() => users.value.filter(user => user.role === 'admin').length)
const newUsersThisMonth = computed(() => {
  const thisMonth = new Date()
  thisMonth.setDate(1)
  return users.value.filter(user => new Date(user.created_at) >= thisMonth).length
})

const filteredUsers = computed(() => {
  let filtered = users.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  // 角色过滤
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  // 状态过滤
  if (statusFilter.value) {
    const isActive = statusFilter.value === 'active'
    filtered = filtered.filter(user => user.is_active === isActive)
  }

  return filtered
})

// 方法
async function loadUsers() {
  loading.value = true
  try {
    const response = await fetch('http://106.75.68.99:3000/api/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      users.value = data.users || []
      console.log('成功加载用户数据:', users.value.length, '个用户')
    } else {
      console.error('Failed to load users:', response.status, response.statusText)
      const errorData = await response.json().catch(() => ({}))
      console.error('Error details:', errorData)
      
      // 显示错误信息给用户
      alert(`加载用户数据失败: ${errorData.message || response.statusText}`)
      users.value = []
    }
  } catch (error) {
    console.error('Error loading users:', error)
    alert(`网络错误: ${(error as Error).message}`)
    users.value = []
  } finally {
    loading.value = false
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('zh-CN')
}

function viewUser(user: any) {
  selectedUser.value = user
  showUserModal.value = true
}

function editUser(user: any) {
  // TODO: 实现编辑用户功能
  console.log('Edit user:', user)
}

async function toggleUserStatus(user: any) {
  try {
    const response = await fetch(`http://106.75.68.99:3000/api/users/${user.id}/toggle-status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      user.is_active = data.is_active
      console.log(`用户 ${user.username} 状态已更新为: ${data.is_active ? '活跃' : '非活跃'}`)
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.error('Failed to toggle user status:', errorData)
      alert(`更新用户状态失败: ${errorData.message || response.statusText}`)
    }
  } catch (error) {
    console.error('Error toggling user status:', error)
    alert(`网络错误: ${(error as Error).message}`)
  }
}

// 生命周期
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-management {
  padding: 24px;
}
</style>
