<template>
  <div class="media-library-management">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">媒体库管理</h2>
      <p class="text-gray-600">管理网站的所有图片资源，上传新图片到媒体库</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">总图片数</p>
            <p class="text-3xl font-bold text-gray-900">{{ mediaLibrary.length }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <span class="text-2xl">🖼️</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">公开图片</p>
            <p class="text-3xl font-bold text-gray-900">{{ publicImages }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <span class="text-2xl">🌐</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">私有图片</p>
            <p class="text-3xl font-bold text-gray-900">{{ privateImages }}</p>
          </div>
          <div class="p-3 bg-yellow-100 rounded-full">
            <span class="text-2xl">🔒</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">总大小</p>
            <p class="text-3xl font-bold text-gray-900">{{ totalSize }}</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-full">
            <span class="text-2xl">💾</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类筛选 -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">图片分类</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(label, key) in categories"
          :key="key"
          @click="selectedCategory = key; loadMediaLibrary()"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === key
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ label }}
        </button>
      </div>
    </div>

    <!-- 上传区域 -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">上传新图片</h3>
      
      <!-- 上传选项 -->
      <div class="mb-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">图片分类</label>
          <select v-model="uploadCategory" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="(label, key) in categories" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div class="flex items-center space-x-4">
          <label class="flex items-center">
            <input v-model="isPublic" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
            <span class="ml-2 text-sm text-gray-700">设为公开</span>
          </label>
        </div>
      </div>
      
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
        <div v-if="!isUploading" class="space-y-4">
          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div>
            <label for="file-upload" class="cursor-pointer">
              <span class="mt-2 block text-sm font-medium text-gray-900">
                点击选择图片文件
              </span>
              <span class="mt-1 block text-sm text-gray-500">
                或拖拽图片到此区域
              </span>
            </label>
            <input
              id="file-upload"
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              class="sr-only"
              @change="handleFileSelect"
            />
          </div>
          <p class="text-xs text-gray-500">
            支持 JPG, PNG, GIF, WebP 格式，单个文件最大 10MB
          </p>
        </div>

        <div v-else class="space-y-4">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="text-sm text-gray-600">正在上传图片...</p>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
          </div>
          <p class="text-xs text-gray-500">{{ uploadProgress }}% 完成</p>
        </div>

        <!-- 压缩状态显示 -->
        <div v-if="isCompressing" class="space-y-4">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p class="text-sm text-gray-600">{{ compressionStatus }}</p>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-green-600 h-2 rounded-full transition-all duration-300" :style="{ width: compressionProgress + '%' }"></div>
          </div>
          <p class="text-xs text-gray-500">{{ compressionProgress }}% 完成</p>
        </div>
      </div>

      <!-- 上传预览 -->
      <div v-if="selectedFiles.length > 0" class="mt-6">
        <h4 class="text-lg font-medium text-gray-900 mb-4">待上传图片预览</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="(file, index) in selectedFiles" :key="index" class="relative group">
            <img 
              :src="file.preview" 
              :alt="file.name"
              class="w-full h-24 object-cover rounded-lg border"
            />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
              <button
                @click="removeFile(index)"
                class="opacity-0 group-hover:opacity-100 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div class="mt-1 text-xs text-gray-500 truncate">{{ file.name }}</div>
            <div class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</div>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end space-x-3">
          <button
            @click="clearSelectedFiles"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            清空选择
          </button>
          <button
            @click="uploadFiles"
            :disabled="isUploading"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            上传图片
          </button>
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
            placeholder="搜索图片名称..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex gap-2">
          <select
            v-model="visibilityFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有图片</option>
            <option value="public">公开</option>
            <option value="private">私有</option>
          </select>
          <select
            v-model="typeFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有类型</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/gif">GIF</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 媒体库网格 -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">媒体库</h3>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600">加载中...</p>
        </div>
      </div>

      <!-- 图片网格 -->
      <div v-else class="p-6">
        <div v-if="filteredMedia.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-gray-500">没有找到图片</p>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          <div 
            v-for="media in filteredMedia" 
            :key="media.id" 
            class="group cursor-pointer bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            @click="selectMedia(media)"
          >
            <!-- 图片 -->
            <div class="aspect-square relative">
              <img 
                :src="getImageUrl(media)" 
                :alt="media.alt_text || media.filename"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              
              <!-- 选中状态 -->
              <div v-if="selectedMediaId === media.id" class="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>

              <!-- 操作按钮 -->
              <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="flex space-x-1">
                  <button
                    @click.stop="toggleVisibility(media)"
                    :class="[
                      'p-1 rounded-full text-white',
                      media.is_public ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
                    ]"
                    :title="media.is_public ? '设为私有' : '设为公开'"
                  >
                    <svg v-if="media.is_public" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/>
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                    </svg>
                  </button>
                  <button
                    v-if="!media.is_existing"
                    @click.stop="deleteMedia(media)"
                    class="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    title="删除图片"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                  <button
                    v-if="media.is_existing"
                    class="p-1 bg-gray-400 text-white rounded-full cursor-not-allowed"
                    title="现有图片无法删除"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- 图片信息 -->
            <div class="p-2">
              <div class="text-xs font-medium text-gray-900 truncate">{{ media.filename }}</div>
              <div class="text-xs text-gray-500">{{ formatFileSize(media.file_size) }}</div>
              <div class="flex items-center justify-between mt-1">
                <span :class="[
                  'inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full',
                  media.is_public ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ media.is_public ? '公开' : '私有' }}
                </span>
                <div class="flex items-center space-x-1">
                  <span v-if="media.is_existing" class="inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    现有
                  </span>
                  <span class="text-xs text-gray-400">{{ media.mime_type.split('/')[1].toUpperCase() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="!loading && filteredMedia.length > 0" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredMedia.length) }} 条，
            共 {{ filteredMedia.length }} 条记录
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
              @click="currentPage = Math.min(Math.ceil(filteredMedia.length / pageSize), currentPage + 1)"
              :disabled="currentPage >= Math.ceil(filteredMedia.length / pageSize)"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片详情模态框 -->
    <div v-if="showMediaModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">图片详情</h3>
          <button @click="showMediaModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="selectedMedia" class="space-y-4">
          <div class="text-center">
            <img 
              :src="getImageUrl(selectedMedia)" 
              :alt="selectedMedia.alt_text || selectedMedia.filename"
              class="max-w-full max-h-96 mx-auto rounded-lg"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">文件名</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedMedia.filename }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">文件大小</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatFileSize(selectedMedia.file_size) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">文件类型</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedMedia.mime_type }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">可见性</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedMedia.is_public ? '公开' : '私有' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">尺寸</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedMedia.width }} × {{ selectedMedia.height }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">上传时间</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedMedia.created_at) }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Alt文本</label>
            <input
              v-model="selectedMedia.alt_text"
              type="text"
              class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="图片描述文本"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">标签</label>
            <input
              v-model="selectedMedia.tags"
              type="text"
              class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="用逗号分隔的标签"
            />
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="showMediaModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            关闭
          </button>
          <button
            @click="saveMediaDetails"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            保存更改
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const loading = ref(false)
const searchQuery = ref('')
const visibilityFilter = ref('')
const typeFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(24)
const showMediaModal = ref(false)
const selectedMedia = ref<any>(null)
const selectedMediaId = ref<number | null>(null)

// 压缩相关状态
const isCompressing = ref(false)
const compressionProgress = ref(0)
const compressionStatus = ref('')

// 分类相关
const selectedCategory = ref('all')
const uploadCategory = ref('other')
const isPublic = ref(true)
const categories = ref<Record<string, string>>({
  'all': '全部',
  'product': '产品图片',
  'dynasty': '朝代图片', 
  'shape': '器型图片',
  'category': '分类图片',
  'banner': '横幅图片',
  'gallery': '画廊图片',
  'other': '其他图片'
})

// 媒体库数据
const mediaLibrary = ref<Array<{
  id: number | string
  filename: string
  original_filename: string
  file_path: string
  file_url: string
  oss_url?: string
  mime_type: string
  file_size: number
  width: number
  height: number
  alt_text: string
  caption: string
  tags: string
  category: string
  is_public: boolean
  uploaded_by: number
  created_at: string
  is_existing?: boolean
}>>([])

// 上传相关
const isUploading = ref(false)
const uploadProgress = ref(0)
const selectedFiles = ref<any[]>([])
const fileInput = ref<HTMLInputElement>()
const publicImages = computed(() => mediaLibrary.value.filter(media => media.is_public).length)
const privateImages = computed(() => mediaLibrary.value.filter(media => !media.is_public).length)
const totalSize = computed(() => {
  const total = mediaLibrary.value.reduce((sum, media) => sum + media.file_size, 0)
  return formatFileSize(total)
})

const filteredMedia = computed(() => {
  let filtered = mediaLibrary.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(media => 
      media.filename.toLowerCase().includes(query) ||
      (media.alt_text && media.alt_text.toLowerCase().includes(query))
    )
  }

  // 可见性过滤
  if (visibilityFilter.value) {
    const isPublic = visibilityFilter.value === 'public'
    filtered = filtered.filter(media => media.is_public === isPublic)
  }

  // 类型过滤
  if (typeFilter.value) {
    filtered = filtered.filter(media => media.mime_type === typeFilter.value)
  }

  return filtered
})

// 方法
function getImageUrl(media: any) {
  // 优先使用OSS URL
  if (media.oss_url) {
    return media.oss_url
  }
  
  // 如果是现有图片，直接使用file_url
  if (media.is_existing) {
    return media.file_url
  }
  
  // 如果是上传的图片，使用file_url或生成URL
  if (media.file_url) {
    return media.file_url
  }
  
  // 回退到默认路径
  return new URL(`../assets/tea_image/${media.filename}`, import.meta.url).href
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('zh-CN')
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = '/src/assets/placeholder.png'
}

function selectMedia(media: any) {
  selectedMedia.value = { ...media }
  selectedMediaId.value = media.id
  showMediaModal.value = true
}

function toggleVisibility(media: any) {
  media.is_public = !media.is_public
  // TODO: 调用API更新可见性
  console.log('Toggle visibility for media:', media.id, 'to', media.is_public)
}

async function deleteMedia(media: any) {
  if (media.is_existing) {
    alert('现有图片无法删除，这些是系统预设的图片资源')
    return
  }
  
  if (confirm(`确定要删除图片 "${media.filename}" 吗？`)) {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        throw new Error('No admin token found')
      }

      const response = await fetch(`/api/media-library-oss/${media.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      const data = await response.json()
      if (data.success) {
        alert('图片删除成功！')
        // 重新加载媒体库
        await loadMediaLibrary()
      } else {
        throw new Error(data.message || 'Delete failed')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('删除失败，请重试')
    }
  }
}

async function saveMediaDetails() {
  try {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      throw new Error('No admin token found')
    }

    const response = await fetch(`/api/media-library-oss/${selectedMedia.value.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        alt_text: selectedMedia.value.alt_text,
        caption: selectedMedia.value.caption,
        tags: selectedMedia.value.tags,
        category: selectedMedia.value.category,
        is_public: selectedMedia.value.is_public
      })
    })

    if (!response.ok) {
      throw new Error('Update failed')
    }

    const data = await response.json()
    if (data.success) {
      alert('图片信息更新成功！')
      showMediaModal.value = false
      // 重新加载媒体库
      await loadMediaLibrary()
    } else {
      throw new Error(data.message || 'Update failed')
    }
  } catch (error) {
    console.error('Update error:', error)
    alert('更新失败，请重试')
  }
}

// 智能压缩工具函数 - 确保文件小于1MB
function compressImageToTargetSize(file: File, targetSizeKB: number = 1000): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // 计算压缩后的尺寸
      const maxWidth = 1920
      const maxHeight = 1080
      let { width, height } = img
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }
      
      canvas.width = width
      canvas.height = height
      
      // 绘制压缩后的图片
      ctx?.drawImage(img, 0, 0, width, height)
      
      // 动态调整质量直到文件大小符合要求
      const tryCompress = (quality: number): void => {
        canvas.toBlob((blob) => {
          if (blob) {
            const sizeKB = blob.size / 1024
            if (sizeKB <= targetSizeKB || quality <= 0.1) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              // 继续降低质量
              tryCompress(quality - 0.1)
            }
          } else {
            reject(new Error('图片压缩失败'))
          }
        }, file.type, quality)
      }
      
      // 从0.8质量开始尝试
      tryCompress(0.8)
    }
    
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = URL.createObjectURL(file)
  })
}

// 图片压缩工具函数

// 分片上传功能
function createFileChunks(file: File, chunkSize: number = 500 * 1024): Blob[] {
  const chunks: Blob[] = []
  let start = 0
  
  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size)
    chunks.push(file.slice(start, end))
    start = end
  }
  
  return chunks
}

async function uploadFileInChunks(file: File): Promise<void> {
  const chunks = createFileChunks(file)
  const token = localStorage.getItem('admin_token')
  
  if (!token) {
    throw new Error('No admin token found')
  }
  
  // 创建上传会话
  const sessionResponse = await fetch('/api/media-library-oss/upload-session', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filename: file.name,
      totalChunks: chunks.length,
      totalSize: file.size
    })
  })
  
  if (!sessionResponse.ok) {
    throw new Error('创建上传会话失败')
  }
  
  const session = await sessionResponse.json()
  
  // 上传每个分片
  for (let i = 0; i < chunks.length; i++) {
    const formData = new FormData()
    formData.append('chunk', chunks[i])
    formData.append('chunkIndex', i.toString())
    formData.append('sessionId', session.sessionId)
    
    const response = await fetch('/api/media-library-oss/upload-chunk', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`上传分片 ${i + 1}/${chunks.length} 失败`)
    }
    
    uploadProgress.value = ((i + 1) / chunks.length) * 100
  }
  
  // 完成上传
  const completeResponse = await fetch('/api/media-library-oss/upload-complete', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sessionId: session.sessionId
    })
  })
  
  if (!completeResponse.ok) {
    throw new Error('完成上传失败')
  }
}
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  const MAX_FILE_SIZE = 1024 * 1024 // 1MB - 适配nginx限制
  
  files.forEach(async (file) => {
    if (file.type.startsWith('image/')) {
      // 检查文件大小
      if (file.size > MAX_FILE_SIZE) {
        const shouldCompress = confirm(`文件 "${file.name}" 超过1MB限制。是否自动压缩后上传？\n\n注意：压缩可能会影响图片质量，但可以确保上传成功。`)
        if (shouldCompress) {
          try {
            isCompressing.value = true
            compressionStatus.value = '正在压缩图片...'
            compressionProgress.value = 0
            
            const compressedFile = await compressImageToTargetSize(file, 900) // 压缩到900KB
            
            compressionStatus.value = '压缩完成！'
            compressionProgress.value = 100
            
            const reader = new FileReader()
            reader.onload = (e) => {
              selectedFiles.value.push({
                file: compressedFile,
                name: compressedFile.name,
                size: compressedFile.size,
                type: compressedFile.type,
                preview: e.target?.result
              })
              isCompressing.value = false
              compressionStatus.value = ''
              compressionProgress.value = 0
            }
            reader.readAsDataURL(compressedFile)
          } catch (error) {
            alert(`压缩失败: ${error}`)
            isCompressing.value = false
            compressionStatus.value = ''
            compressionProgress.value = 0
          }
        }
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedFiles.value.push({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: e.target?.result
        })
      }
      reader.readAsDataURL(file)
    } else {
      alert(`文件 "${file.name}" 不是图片格式，请选择图片文件`)
    }
  })
}

function removeFile(index: number) {
  selectedFiles.value.splice(index, 1)
}

function clearSelectedFiles() {
  selectedFiles.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function uploadFiles() {
  if (selectedFiles.value.length === 0) return

  // 检查总文件大小
  const totalSize = selectedFiles.value.reduce((sum, fileData) => sum + fileData.size, 0)
  const MAX_TOTAL_SIZE = 5 * 1024 * 1024 // 5MB总限制 - 适配nginx
  
  if (totalSize > MAX_TOTAL_SIZE) {
    alert(`所有文件总大小超过5MB限制，请分批上传`)
    return
  }

  isUploading.value = true
  uploadProgress.value = 0

  try {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      throw new Error('No admin token found')
    }

    const formData = new FormData()
    
    // 添加所有文件
    selectedFiles.value.forEach(fileData => {
      formData.append('file', fileData.file)
    })
    
    // 添加上传选项
    formData.append('category', uploadCategory.value)
    formData.append('is_public', isPublic.value.toString())

    const response = await fetch('/api/media-library-oss/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    if (data.success) {
      console.log('Files uploaded successfully:', data.files)
      uploadProgress.value = 100
      
      // 重新加载媒体库
      await loadMediaLibrary()
      
      // 清空选择
      clearSelectedFiles()
      
      alert(`成功上传 ${data.files.length} 个文件！`)
    } else {
      throw new Error(data.message || 'Upload failed')
    }
  } catch (error) {
    console.error('Upload error:', error)
    alert('上传失败，请重试')
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

async function loadMediaLibrary() {
  loading.value = true
  try {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      console.error('No admin token found')
      return
    }

    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: pageSize.value.toString()
    })
    
    if (selectedCategory.value !== 'all') {
      params.append('category', selectedCategory.value)
    }

    const response = await fetch(`/api/media-library-oss?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch media library')
    }

    const data = await response.json()
    if (data.success) {
      mediaLibrary.value = data.media
      console.log('媒体库数据已加载:', mediaLibrary.value.length, '个文件')
    } else {
      console.error('Error loading media library:', data.message)
    }
  } catch (error) {
    console.error('Error loading media library:', error)
    // 使用默认数据
    mediaLibrary.value = []
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadMediaLibrary()
})
</script>

<style scoped>
.media-library-management {
  padding: 24px;
}
</style>
