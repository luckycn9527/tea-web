<template>
  <div class="resource-management">
    <!-- 上传区域 -->
    <div class="upload-section mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-4">📤 资源上传</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">资源类型</label>
            <select v-model="uploadForm.type" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="images">图片</option>
              <option value="videos">视频</option>
              <option value="documents">文档</option>
              <option value="audio">音频</option>
              <option value="other">其他</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">分类</label>
            <input 
              v-model="uploadForm.category" 
              type="text" 
              placeholder="例如: products, banners, avatars"
              class="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
        
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input 
            ref="fileInput"
            type="file" 
            multiple 
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
            @change="handleFileSelect"
            class="hidden"
          />
          
          <div v-if="!selectedFiles.length" @click="$refs.fileInput.click()" class="cursor-pointer">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p class="mt-2 text-sm text-gray-600">点击选择文件或拖拽文件到此处</p>
            <p class="text-xs text-gray-500">支持图片、视频、音频、文档等格式</p>
          </div>
          
          <div v-else class="space-y-2">
            <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span class="text-sm">{{ file.name }}</span>
              <span class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
              <button @click="removeFile(index)" class="text-red-500 hover:text-red-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button 
            @click="uploadFiles" 
            :disabled="!selectedFiles.length || uploading"
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ uploading ? '上传中...' : '开始上传' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 上传结果 -->
    <div v-if="uploadResults.length" class="upload-results mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">📋 上传结果</h3>
        
        <div class="space-y-3">
          <div v-for="(result, index) in uploadResults" :key="index" class="border rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium">{{ result.originalName }}</span>
              <span :class="result.cdnUrl ? 'text-green-600' : 'text-red-600'">
                {{ result.cdnUrl ? '✅ 成功' : '❌ 失败' }}
              </span>
            </div>
            
            <div v-if="result.cdnUrl" class="text-sm text-gray-600">
              <p><strong>CDN URL:</strong> {{ result.cdnUrl }}</p>
              <p><strong>Hash:</strong> {{ result.hash }}</p>
              <p><strong>大小:</strong> {{ formatFileSize(result.metadata.size) }}</p>
              <div v-if="result.metadata.width && result.metadata.height">
                <p><strong>尺寸:</strong> {{ result.metadata.width }} × {{ result.metadata.height }}</p>
              </div>
            </div>
            
            <div v-if="result.error" class="text-sm text-red-600">
              <p><strong>错误:</strong> {{ result.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 资源列表 -->
    <div class="resource-list mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">📁 资源列表</h2>
          <div class="flex space-x-2">
            <select v-model="filters.type" @change="loadResources" class="border border-gray-300 rounded-md px-3 py-1">
              <option value="">所有类型</option>
              <option value="images">图片</option>
              <option value="videos">视频</option>
              <option value="documents">文档</option>
              <option value="audio">音频</option>
              <option value="other">其他</option>
            </select>
            
            <input 
              v-model="filters.search" 
              @input="debounceSearch"
              type="text" 
              placeholder="搜索文件名..."
              class="border border-gray-300 rounded-md px-3 py-1"
            />
          </div>
        </div>
        
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">加载中...</p>
        </div>
        
        <div v-else-if="resources.length === 0" class="text-center py-8 text-gray-500">
          暂无资源
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="resource in resources" :key="resource.id" class="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
              <img 
                v-if="resource.resource_type === 'images'" 
                :src="resource.cdn_url" 
                :alt="resource.original_name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            
            <div class="space-y-2">
              <h3 class="font-medium text-sm truncate">{{ resource.original_name }}</h3>
              <p class="text-xs text-gray-500">{{ resource.resource_type }} • {{ resource.category }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(resource.file_size) }}</p>
              
              <div class="flex space-x-2">
                <button 
                  @click="copyUrl(resource.cdn_url)"
                  class="text-blue-600 hover:text-blue-800 text-xs"
                >
                  复制URL
                </button>
                <button 
                  @click="testResource(resource.cdn_url)"
                  class="text-green-600 hover:text-green-800 text-xs"
                >
                  测试
                </button>
                <button 
                  @click="deleteResource(resource.id)"
                  class="text-red-600 hover:text-red-800 text-xs"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="pagination.pages > 1" class="mt-6 flex justify-center">
          <nav class="flex space-x-2">
            <button 
              v-for="page in pagination.pages" 
              :key="page"
              @click="loadResources(page)"
              :class="[
                'px-3 py-1 rounded-md text-sm',
                page === pagination.page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              {{ page }}
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- 测试结果 -->
    <div v-if="testResults" class="test-results mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">🧪 测试结果</h3>
        
        <div class="space-y-4">
          <div v-if="testResults.summary" class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium mb-2">整体健康度</h4>
            <div class="flex items-center space-x-4">
              <span class="text-2xl font-bold" :class="getHealthColor(testResults.summary.overallHealth.level)">
                {{ testResults.summary.overallHealth.score }}/100
              </span>
              <span class="text-sm text-gray-600">{{ testResults.summary.overallHealth.level }}</span>
            </div>
          </div>
          
          <div v-if="testResults.availability" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ testResults.availability.successRate }}</div>
              <div class="text-sm text-gray-600">可用性</div>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ testResults.consistency.consistencyRate }}</div>
              <div class="text-sm text-gray-600">一致性</div>
            </div>
            <div class="text-center p-3 bg-yellow-50 rounded-lg">
              <div class="text-2xl font-bold text-yellow-600">{{ testResults.cache.cacheRate }}</div>
              <div class="text-sm text-gray-600">缓存率</div>
            </div>
            <div class="text-center p-3 bg-red-50 rounded-lg">
              <div class="text-2xl font-bold text-red-600">{{ testResults.brokenLinks.brokenRate }}</div>
              <div class="text-sm text-gray-600">断链率</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import apiService from '@/services/api'

// 响应式数据
const selectedFiles = ref<File[]>([])
const uploading = ref(false)
const uploadResults = ref<any[]>([])
const resources = ref<any[]>([])
const loading = ref(false)
const testResults = ref<any>(null)

// 表单数据
const uploadForm = reactive({
  type: 'images',
  category: 'general'
})

// 过滤器
const filters = reactive({
  type: '',
  search: ''
})

// 分页
const pagination = reactive({
  page: 1,
  limit: 12,
  total: 0,
  pages: 0
})

// 搜索防抖
let searchTimeout: NodeJS.Timeout
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadResources(1)
  }, 500)
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedFiles.value = Array.from(target.files)
  }
}

// 移除文件
const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 上传文件
const uploadFiles = async () => {
  if (!selectedFiles.value.length) return
  
  uploading.value = true
  uploadResults.value = []
  
  try {
    const formData = new FormData()
    selectedFiles.value.forEach(file => {
      formData.append('files', file)
    })
    formData.append('type', uploadForm.type)
    formData.append('category', uploadForm.category)
    
    const response = await apiService.request('/resources/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      uploadResults.value = response.data
      selectedFiles.value = []
      loadResources()
    } else {
      console.error('上传失败:', response.message)
    }
  } catch (error) {
    console.error('上传错误:', error)
  } finally {
    uploading.value = false
  }
}

// 加载资源列表
const loadResources = async (page = 1) => {
  loading.value = true
  
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pagination.limit.toString()
    })
    
    if (filters.type) params.append('type', filters.type)
    if (filters.search) params.append('search', filters.search)
    
    const response = await apiService.request(`/resources?${params.toString()}`)
    
    if (response.success) {
      resources.value = response.data
      pagination.page = response.pagination.page
      pagination.total = response.pagination.total
      pagination.pages = response.pagination.pages
    }
  } catch (error) {
    console.error('加载资源失败:', error)
  } finally {
    loading.value = false
  }
}

// 复制URL
const copyUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url)
    alert('URL已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 测试资源
const testResource = async (url: string) => {
  try {
    const response = await apiService.request('/resources/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        urls: [url],
        testType: 'comprehensive'
      })
    })
    
    if (response.success) {
      testResults.value = response.results
    }
  } catch (error) {
    console.error('测试失败:', error)
  }
}

// 删除资源
const deleteResource = async (id: number) => {
  if (!confirm('确定要删除这个资源吗？')) return
  
  try {
    const response = await apiService.request(`/resources/${id}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      loadResources()
    } else {
      alert('删除失败: ' + response.message)
    }
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 处理图片错误
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/src/assets/tea_image/1.png'
}

// 获取健康度颜色
const getHealthColor = (level: string) => {
  switch (level) {
    case 'excellent': return 'text-green-600'
    case 'good': return 'text-blue-600'
    case 'fair': return 'text-yellow-600'
    case 'poor': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

// 组件挂载时加载资源
onMounted(() => {
  loadResources()
})
</script>

<style scoped>
.resource-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.upload-section {
  margin-bottom: 2rem;
}

.upload-results {
  margin-bottom: 2rem;
}

.resource-list {
  margin-bottom: 2rem;
}

.test-results {
  margin-bottom: 2rem;
}
</style>


