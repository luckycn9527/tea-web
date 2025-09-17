<!-- 规范化产品管理组件 -->
<template>
  <div class="space-y-6">
    <!-- 产品列表 -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900">产品管理</h3>
      <button @click="showAddModal = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        添加产品
      </button>
    </div>

    <!-- 产品表格 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">图片</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">产品名称</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">朝代</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">形状</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <img 
                :src="getImageSrc(product.primary_image_url || '/src/assets/tea_image/1.png')" 
                :alt="product.name_en" 
                class="w-12 h-12 rounded-lg object-cover"
              >
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ product.name_en }}</div>
              <div class="text-sm text-gray-500">{{ product.name_cn }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.dynasty_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.shape_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ product.price }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="product.is_available ? 'px-2 py-1 bg-green-100 text-green-800' : 'px-2 py-1 bg-red-100 text-red-800'" class="text-xs rounded-full">
                {{ product.is_available ? '可用' : '不可用' }}
              </span>
              <span v-if="product.is_featured" class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                推荐
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="editProduct(product)" class="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
              <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-900">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 添加/编辑产品模态框 -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ showAddModal ? '添加新产品' : '编辑产品' }}
        </h3>
        
        <form @submit.prevent="saveProduct" class="space-y-6">
          <!-- 基本信息 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">英文名称 *</label>
              <input v-model="currentProduct.name_en" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">中文名称 *</label>
              <input v-model="currentProduct.name_cn" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">价格 *</label>
              <input v-model="currentProduct.price" type="number" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">原价</label>
              <input v-model="currentProduct.original_price" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">朝代 *</label>
              <select v-model="currentProduct.dynasty_id" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">选择朝代</option>
                <option v-for="dynasty in dynasties" :key="dynasty.id" :value="dynasty.id">{{ dynasty.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">形状 *</label>
              <select v-model="currentProduct.shape_id" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">选择形状</option>
                <option v-for="shape in shapes" :key="shape.id" :value="shape.id">{{ shape.name }}</option>
              </select>
            </div>
          </div>

          <!-- 描述信息 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">英文描述</label>
              <textarea v-model="currentProduct.description_en" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">中文描述</label>
              <textarea v-model="currentProduct.description_cn" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">工艺说明(英文)</label>
              <textarea v-model="currentProduct.craftsmanship_en" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">工艺说明(中文)</label>
              <textarea v-model="currentProduct.craftsmanship_cn" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
          </div>

          <!-- 物理属性 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">尺寸</label>
              <input v-model="currentProduct.dimensions" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">重量</label>
              <input v-model="currentProduct.weight" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">材质</label>
              <input v-model="currentProduct.material" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>

          <!-- 图片管理 -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900">图片管理</h4>
            
            <!-- 主图 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">主图 *</label>
              <div class="flex items-center space-x-4">
                <img v-if="currentProduct.primary_image_url" :src="getImageSrc(currentProduct.primary_image_url)" alt="主图" class="w-24 h-24 object-cover rounded-lg">
                <input type="file" @change="handlePrimaryImageUpload" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
              </div>
            </div>

            <!-- 附件图 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">附件图 (可选)</label>
              <div class="grid grid-cols-4 gap-4">
                <div v-for="(image, index) in currentProduct.additional_images" :key="index" class="relative">
                  <img :src="getImageSrc(image.url)" alt="附件图" class="w-full h-20 object-cover rounded-lg">
                  <button @click="removeAdditionalImage(index)" type="button" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">×</button>
                </div>
                <div v-if="currentProduct.additional_images.length < 5" class="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-20">
                  <input type="file" @change="handleAdditionalImageUpload" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                  <span class="text-gray-500 text-sm">+ 添加图片</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 状态设置 -->
          <div class="flex items-center space-x-6">
            <label class="flex items-center">
              <input v-model="currentProduct.is_featured" type="checkbox" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              <span class="ml-2 text-sm text-gray-700">推荐产品</span>
            </label>
            <label class="flex items-center">
              <input v-model="currentProduct.is_available" type="checkbox" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              <span class="ml-2 text-sm text-gray-700">可用</span>
            </label>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end space-x-4">
            <button type="button" @click="closeModal" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              取消
            </button>
            <button type="submit" :disabled="saving" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin-new'
import apiService from '@/services/api'

const adminStore = useAdminStore()

// 响应式数据
const showAddModal = ref(false)
const showEditModal = ref(false)
const saving = ref(false)
const currentProduct = ref({
  id: 0,
  name_en: '',
  name_cn: '',
  description_en: '',
  description_cn: '',
  craftsmanship_en: '',
  craftsmanship_cn: '',
  history_en: '',
  history_cn: '',
  price: 0,
  original_price: 0,
  dimensions: '',
  weight: '',
  material: '',
  color: '',
  dynasty_id: 0,
  shape_id: 0,
  primary_image_url: '',
  additional_images: [] as Array<{url: string, alt_text?: string}>,
  is_featured: false,
  is_available: true,
  stock_quantity: 0
})

// 计算属性
const products = computed(() => adminStore.products)
const dynasties = computed(() => adminStore.dynasties)
const shapes = computed(() => adminStore.shapes)

// 方法
function getImageSrc(imagePath: string) {
  if (!imagePath) return '/src/assets/tea_image/1.png'
  if (imagePath.startsWith('http')) return imagePath
  if (imagePath.startsWith('/src/')) return imagePath
  return `/src/assets/tea_image/${imagePath}`
}

function resetCurrentProduct() {
  currentProduct.value = {
    id: 0,
    name_en: '',
    name_cn: '',
    description_en: '',
    description_cn: '',
    craftsmanship_en: '',
    craftsmanship_cn: '',
    history_en: '',
    history_cn: '',
    price: 0,
    original_price: 0,
    dimensions: '',
    weight: '',
    material: '',
    color: '',
    dynasty_id: 0,
    shape_id: 0,
    primary_image_url: '',
    additional_images: [],
    is_featured: false,
    is_available: true,
    stock_quantity: 0
  }
}

function handlePrimaryImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // 这里应该上传到服务器，现在先用本地路径
    const reader = new FileReader()
    reader.onload = (e) => {
      currentProduct.value.primary_image_url = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function handleAdditionalImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && currentProduct.value.additional_images.length < 5) {
    const reader = new FileReader()
    reader.onload = (e) => {
      currentProduct.value.additional_images.push({
        url: e.target?.result as string,
        alt_text: `附件图 ${currentProduct.value.additional_images.length + 1}`
      })
    }
    reader.readAsDataURL(file)
  }
}

function removeAdditionalImage(index: number) {
  currentProduct.value.additional_images.splice(index, 1)
}

async function saveProduct() {
  saving.value = true
  try {
    // 这里应该调用API保存产品
    if (showAddModal.value) {
      await adminStore.addProduct(currentProduct.value as any)
    } else {
      await adminStore.updateProduct(currentProduct.value.id, currentProduct.value as any)
    }
    
    closeModal()
    alert('产品保存成功！')
  } catch (error) {
    console.error('保存产品失败:', error)
    alert('保存产品失败，请重试')
  } finally {
    saving.value = false
  }
}

function editProduct(product: any) {
  currentProduct.value = {
    ...product,
    additional_images: product.images?.filter((img: any) => !img.is_primary).map((img: any) => ({
      url: img.image_url,
      alt_text: img.alt_text
    })) || []
  }
  showEditModal.value = true
}

async function deleteProduct(productId: number) {
  if (confirm('确定要删除这个产品吗？')) {
    try {
      await adminStore.deleteProduct(productId)
      alert('产品删除成功！')
    } catch (error) {
      console.error('删除产品失败:', error)
      alert('删除产品失败，请重试')
    }
  }
}

function closeModal() {
  showAddModal.value = false
  showEditModal.value = false
  resetCurrentProduct()
}

onMounted(async () => {
  await adminStore.loadAllData()
})
</script>

