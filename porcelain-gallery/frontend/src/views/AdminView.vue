<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 px-4 bg-gray-900">
          <h1 class="text-xl font-bold text-white">{{ $t('admin.title') }}</h1>
          </div>
        
        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <div
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
              'flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                activeTab === tab.id
                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
            <span class="text-lg">{{ tab.icon() }}</span>
            <span class="font-medium">{{ tab.name() }}</span>
              </div>
          </nav>
        
        <!-- Footer -->
        <div class="p-4 border-t">
          <button 
            @click="logout"
            class="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <span>🚪</span>
            <span>{{ $t('admin.logout') }}</span>
          </button>
        </div>
      </div>
        </div>

        <!-- Main Content -->
    <div class="ml-64">
      <!-- Top Header -->
      <div class="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
              <div>
          <h2 class="text-2xl font-semibold text-gray-900">{{ getCurrentTabName() }}</h2>
          <p class="text-sm text-gray-600">{{ getCurrentTabDescription() }}</p>
              </div>
                <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-500">
            Last updated: {{ new Date().toLocaleString() }}
          </div>
                </div>
              </div>

      <!-- Content Area -->
      <div class="p-6">
        <!-- Dashboard Tab -->
        <div v-if="activeTab === 'dashboard'" class="space-y-6">
          <!-- Welcome Section -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <h2 class="text-2xl font-bold mb-2">{{ $t('admin.dashboard.welcome') }}</h2>
            <p class="text-blue-100">{{ $t('admin.dashboard.subtitle') }}</p>
          </div>
          
          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">{{ $t('admin.dashboard.totalProducts') }}</p>
                  <p class="text-3xl font-bold text-gray-900">{{ products.length }}</p>
                  <p class="text-xs text-green-600 mt-1">+{{ products.filter(p => p.is_available).length }} {{ $t('admin.dashboard.available') }}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-full">
                  <span class="text-2xl">📦</span>
                </div>
                </div>
              </div>

            <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">{{ $t('admin.dashboard.bestSellers') }}</p>
                  <p class="text-3xl font-bold text-gray-900">{{ featuredProducts.length }}</p>
                  <p class="text-xs text-yellow-600 mt-1">{{ $t('admin.dashboard.featured') }}</p>
                </div>
                <div class="p-3 bg-yellow-100 rounded-full">
                  <span class="text-2xl">⭐</span>
                </div>
              </div>
              </div>

            <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">{{ $t('admin.dashboard.dynasties') }}</p>
                  <p class="text-3xl font-bold text-gray-900">{{ dynasties.length }}</p>
                  <p class="text-xs text-purple-600 mt-1">{{ $t('admin.dashboard.historical') }}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-full">
                  <span class="text-2xl">🏛️</span>
            </div>
          </div>
        </div>

            <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div class="flex items-center justify-between">
              <div>
                  <p class="text-sm font-medium text-gray-600">{{ $t('admin.dashboard.shapes') }}</p>
                  <p class="text-3xl font-bold text-gray-900">{{ shapes.length }}</p>
                  <p class="text-xs text-orange-600 mt-1">{{ $t('admin.dashboard.varieties') }}</p>
              </div>
                <div class="p-3 bg-orange-100 rounded-full">
                  <span class="text-2xl">🔷</span>
              </div>
              </div>
              </div>
              </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('admin.dashboard.quickActions') }}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button @click="activeTab = 'products'" class="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div class="text-2xl mb-2">📦</div>
                <div class="text-sm font-medium text-gray-900">{{ $t('admin.navigation.products') }}</div>
              </button>
              <button @click="activeTab = 'dynasties'" class="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div class="text-2xl mb-2">🏛️</div>
                <div class="text-sm font-medium text-gray-900">{{ $t('admin.navigation.dynasties') }}</div>
              </button>
              <button @click="activeTab = 'best-sellers'" class="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <div class="text-2xl mb-2">⭐</div>
                <div class="text-sm font-medium text-gray-900">{{ $t('admin.navigation.bestSellers') }}</div>
              </button>
              <button @click="activeTab = 'settings'" class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="text-2xl mb-2">⚙️</div>
                <div class="text-sm font-medium text-gray-900">{{ $t('admin.navigation.settings') }}</div>
                </button>
              </div>
            </div>
          </div>

        <!-- Products Management Tab -->
        <div v-if="activeTab === 'products'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('admin.products.title') }}</h3>
            <button @click="addProduct" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {{ $t('admin.products.addProduct') }}
              </button>
            </div>

          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.products.image') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.products.name') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.products.price') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.products.dynasty') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.products.status') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.products.actions') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <img 
                        :src="getImageSrc(product.primary_image || (product as any).mainImage)" 
                        :alt="(product as any).name" 
                        class="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        @error="handleImageError"
                        loading="lazy"
                      >
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ (product as any).name || product.name_en }}</div>
                      <div class="text-sm text-gray-500">{{ product.name_en }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.price }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ dynasties.find(d => d.id === product.dynasty_id)?.name || 'Unknown' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="product.is_available ? 'px-2 py-1 bg-green-100 text-green-800' : 'px-2 py-1 bg-red-100 text-red-800'" class="text-xs rounded-full">
                        {{ product.is_available ? $t('admin.products.available') : $t('admin.products.unavailable') }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex space-x-2">
                        <button @click="editProduct(product)" class="text-blue-600 hover:text-blue-900">{{ $t('admin.products.edit') }}</button>
                        <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-900">{{ $t('admin.products.delete') }}</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>
          </div>

        <!-- Dynasty Management Tab -->
        <div v-if="activeTab === 'dynasties'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('admin.dynasties.title') }}</h3>
            <button @click="addDynasty" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {{ $t('admin.dynasties.addDynasty') }}
            </button>
              </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="dynasty in dynasties" :key="dynasty.id" class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center space-x-4 mb-4">
                <img 
                  :src="getImageSrc(dynasty.image || '/src/assets/tea_image/1.png')" 
                  :alt="dynasty.name" 
                  class="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  @error="handleImageError"
                  loading="lazy"
                >
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ dynasty.name }}</h4>
                  <p class="text-sm text-gray-600">{{ dynasty.name_cn }}</p>
                  <p class="text-sm text-gray-500">{{ dynasty.period }}</p>
              </div>
              </div>
              <div class="flex items-center justify-between">
                <span :class="dynasty.is_enabled ? 'px-2 py-1 bg-green-100 text-green-800' : 'px-2 py-1 bg-red-100 text-red-800'" class="text-xs rounded-full">
                  {{ dynasty.is_enabled ? $t('admin.dynasties.enabled') : $t('admin.dynasties.disabled') }}
                </span>
                <div class="flex space-x-2">
                  <button @click="editDynasty(dynasty)" class="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">
                    {{ $t('admin.dynasties.edit') }}
                  </button>
                  <button @click="toggleDynasty(dynasty.id)" class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200">
                    {{ dynasty.is_enabled ? $t('admin.dynasties.disable') : $t('admin.dynasties.enable') }}
                  </button>
              </div>
              </div>
              </div>
            </div>
          </div>

        <!-- Shapes Management Tab -->
        <div v-if="activeTab === 'shapes'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('admin.shapes.title') }}</h3>
            <button @click="addShape" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {{ $t('admin.shapes.addShape') }}
                      </button>
                    </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="shape in shapes" :key="shape.id" class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center space-x-4 mb-4">
                <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span class="text-2xl">🔷</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ shape.name }}</h4>
                  <p class="text-sm text-gray-500">{{ shape.description }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span :class="shape.is_enabled ? 'px-2 py-1 bg-green-100 text-green-800' : 'px-2 py-1 bg-red-100 text-red-800'" class="text-xs rounded-full">
                  {{ shape.is_enabled ? $t('admin.shapes.enabled') : $t('admin.shapes.disabled') }}
                </span>
                <div class="flex space-x-2">
                  <button @click="editShape(shape)" class="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">
                    {{ $t('admin.shapes.edit') }}
                  </button>
                  <button @click="toggleShape(shape.id)" class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200">
                    {{ shape.is_enabled ? $t('admin.shapes.disable') : $t('admin.shapes.enable') }}
                  </button>
                  </div>
                </div>
                  </div>
                </div>
              </div>
        <div v-if="activeTab === 'best-sellers'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('admin.bestSellers.title') }}</h3>
            <button @click="activeTab = 'products'" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {{ $t('admin.bestSellers.manageProducts') }}
                      </button>
                    </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(product, index) in featuredProducts" :key="index" class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center space-x-4 mb-4">
                <img 
                  :src="getImageSrc((product as any).primary_image || product.mainImage)" 
                  :alt="product.name" 
                  class="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  @error="handleImageError"
                  loading="lazy"
                >
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ product.name }}</h4>
                  <p class="text-sm text-gray-600">{{ product.name_en }}</p>
                  <p class="text-sm text-gray-500">{{ product.price }}</p>
              </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  {{ $t('admin.bestSellers.featured') }}
                </span>
                <div class="flex space-x-2">
                  <button @click="editProduct(product)" class="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">
                    {{ $t('admin.bestSellers.edit') }}
                  </button>
              </div>
                  </div>
                </div>
                </div>
              </div>

        <!-- Users Tab -->
        <div v-if="activeTab === 'users'" class="space-y-6">
          <UserManagementView />
        </div>

        <!-- Homepage Content Tab -->
        <div v-if="activeTab === 'homepage-content'" class="space-y-6">
          <HomepageContentManagementView />
        </div>

        <!-- Media Library Tab -->
        <div v-if="activeTab === 'media-library'" class="space-y-6">
          <MediaLibraryManagementView />
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('admin.settings.title') }}</h3>
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-600">{{ $t('admin.settings.subtitle') }}</p>
            <div class="mt-4 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">{{ $t('admin.settings.language') }}</span>
                <select v-model="locale" class="px-3 py-1 border border-gray-300 rounded-md">
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                </select>
                </div>
              </div>
                  </div>
                </div>
              </div>
              </div>
              
    <!-- Product Edit Modal -->
    <div v-if="showProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-4xl my-8 max-h-screen flex flex-col">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingProduct?.id ? $t('admin.products.editProduct') : $t('admin.products.addProduct') }}
          </h3>
          <button @click="showProductModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
                      </button>
                </div>

        <!-- Modal Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="editingProduct" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.products.name') }}</label>
                <input v-model="editingProduct.name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.products.nameEn') }}</label>
                <input v-model="editingProduct.name_en" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.products.price') }}</label>
                <input v-model="editingProduct.price" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
                <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.products.dynasty') }}</label>
                <select v-model="editingProduct.dynasty_id" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option v-for="dynasty in dynasties" :key="dynasty.id" :value="dynasty.id">{{ dynasty.name }}</option>
                </select>
                  </div>
                </div>

            <!-- Product Specifications -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.products.dimensions') }}</label>
                <input v-model="editingProduct.dimensions" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </div>
                  <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.products.weight') }}</label>
                <input v-model="editingProduct.weight" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </div>
                <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.products.age') }}</label>
                <input v-model="editingProduct.age" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.products.material') }}</label>
                <input v-model="editingProduct.material" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.products.origin') }}</label>
                <input v-model="editingProduct.origin" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              </div>

            <!-- Primary Image -->
              <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.products.primaryImage') }}</label>
              <div class="flex items-center space-x-4">
                <img 
                  v-if="editingProduct.primary_image || editingProduct.mainImage" 
                  :src="getImageSrc(editingProduct.primary_image || editingProduct.mainImage)" 
                  :alt="editingProduct.name" 
                  class="w-20 h-20 rounded-lg object-cover border border-gray-200"
                  @error="handleImageError"
                >
                <button @click="openImageSelector('primary')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {{ $t('admin.products.selectImage') }}
          </button>
              </div>
            </div>

            <!-- Additional Images -->
              <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.products.additionalImages') }}</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="(image, index) in editingProduct.images" :key="index" class="relative">
                  <img 
                    :src="getImageSrc(image.image_url || image.image_path)" 
                    :alt="image.alt_text" 
                    class="w-full h-20 rounded-lg object-cover border border-gray-200"
                    @error="handleImageError"
                >
                <button 
                    @click="removeAdditionalImage(index)" 
                    class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                    ×
                    </button>
            </div>
                <button @click="openImageSelector('additional')" class="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors">
                  <span class="text-gray-500">+ {{ $t('admin.products.addImage') }}</span>
                </button>
                  </div>
                </div>
              </div>
            </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button 
            @click="showProductModal = false"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
            {{ $t('admin.products.cancel') }}
                </button>
              <button 
            @click="saveProduct"
            :disabled="isLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
            <div v-if="isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{{ $t('admin.products.save') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Shape Edit Modal -->
    <div v-if="showShapeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-2xl my-8">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingShape?.id ? $t('admin.shapes.editShape') : $t('admin.shapes.addShape') }}
        </h3>
          <button @click="showShapeModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
    </div>

        <div v-if="editingShape" class="p-6 space-y-4">
              <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.shapes.name') }}</label>
            <input v-model="editingShape.name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.shapes.description') }}</label>
            <textarea v-model="editingShape.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.shapes.sortOrder') }}</label>
            <input v-model="editingShape.sort_order" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
          <div class="flex items-center">
            <input v-model="editingShape.is_enabled" type="checkbox" id="shape-enabled" class="mr-2">
            <label for="shape-enabled" class="text-sm font-medium text-gray-700">{{ $t('admin.shapes.enabled') }}</label>
              </div>
            </div>

        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button 
            @click="showShapeModal = false"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
            {{ $t('admin.shapes.cancel') }}
                </button>
                  <button 
            @click="saveShape"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
            {{ $t('admin.shapes.save') }}
                  </button>
                </div>
              </div>
            </div>
    <div v-if="showDynastyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-2xl my-8">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingDynasty?.id ? $t('admin.dynasties.editDynasty') : $t('admin.dynasties.addDynasty') }}
          </h3>
          <button @click="showDynastyModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
    </div>

        <div v-if="editingDynasty" class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.dynasties.name') }}</label>
              <input v-model="editingDynasty.name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.dynasties.nameCn') }}</label>
              <input v-model="editingDynasty.name_cn" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.dynasties.period') }}</label>
            <input v-model="editingDynasty.period" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.dynasties.description') }}</label>
            <textarea v-model="editingDynasty.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            @click="showDynastyModal = false"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {{ $t('admin.dynasties.cancel') }}
          </button>
          <button
            @click="saveDynasty"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ $t('admin.dynasties.save') }}
          </button>
        </div>
          </div>
        </div>
        
    <!-- Image Selector Modal -->
    <div v-if="showImageSelector" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-4xl my-8 max-h-screen flex flex-col">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('admin.imageSelector.selectImage') }}</h3>
          <button @click="showImageSelector = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          </div>
        <!-- Modal Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
              v-for="imageName in availableImages"
              :key="imageName"
              @click="selectImage(imageName)"
              class="cursor-pointer border border-gray-200 rounded-lg p-2 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <img
                :src="getImageSrc(`/src/assets/tea_image/${imageName}`)"
                :alt="imageName"
                class="w-full h-20 object-cover rounded"
                @error="handleImageError"
              />
              <p class="text-xs text-gray-600 mt-1 text-center truncate">{{ imageName }}</p>
          </div>
          </div>
        </div>
        <!-- Modal Footer -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            @click="showImageSelector = false"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {{ $t('admin.imageSelector.cancel') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAdminStore } from '@/stores/admin'
import API_CONFIG from '@/config/api'
import UserManagementView from './UserManagementView.vue'
import HomepageContentManagementView from './HomepageContentManagementView.vue'
import MediaLibraryManagementView from './MediaLibraryManagementView.vue'

const router = useRouter()
const { t: $t, locale } = useI18n()
const adminStore = useAdminStore()

// State management
const activeTab = ref('dashboard')
const showProductModal = ref(false)
const showDynastyModal = ref(false)
const showShapeModal = ref(false)
const showImageSelector = ref(false)
const editingProduct = ref<any>(null)
const editingDynasty = ref<any>(null)
const editingShape = ref<any>(null)
const currentImageSelectionType = ref<'primary' | 'additional'>('primary')
const isLoading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

// Available images from assets
const availableImages = ref([
  '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png',
  '11.png', '12.png', '13.png', '14.png', '15.png', '16.png', '17.png', '18.png', '19.png', '20.png',
  '21.png', '22.png', '23.png', 'tang.png', 'song.png', 'yuan.png', 'ming.png', 'qing.png', 'zhizuo.png', 'best.png'
])

// Navigation tabs
const tabs = ref([
  { 
    id: 'dashboard', 
    name: () => $t('admin.navigation.dashboard'), 
    icon: () => '📊' 
  },
  { 
    id: 'products', 
    name: () => $t('admin.navigation.products'), 
    icon: () => '📦' 
  },
  { 
    id: 'dynasties', 
    name: () => $t('admin.navigation.dynasties'), 
    icon: () => '🏛️' 
  },
  { 
    id: 'shapes', 
    name: () => $t('admin.navigation.shapes'), 
    icon: () => '🔷' 
  },
  { 
    id: 'users', 
    name: () => $t('admin.navigation.users'), 
    icon: () => '👥' 
  },
  { 
    id: 'homepage-content', 
    name: () => $t('admin.navigation.homepageContent'), 
    icon: () => '🏠' 
  },
  { 
    id: 'media-library', 
    name: () => $t('admin.navigation.mediaLibrary'), 
    icon: () => '🖼️' 
  },
  { 
    id: 'best-sellers', 
    name: () => $t('admin.navigation.bestSellers'), 
    icon: () => '⭐' 
  },
  { 
    id: 'settings', 
    name: () => $t('admin.navigation.settings'), 
    icon: () => '⚙️' 
  }
])

// Computed properties
const products = computed(() => adminStore.products)
const dynasties = computed(() => adminStore.dynasties)
const shapes = computed(() => adminStore.shapes)
const featuredProducts = computed(() => adminStore.bestSellersProducts)
const siteSettings = computed(() => adminStore.siteSettings)

// Helper functions
function getCurrentTabName() {
  const tab = tabs.value.find(t => t.id === activeTab.value)
  return tab ? tab.name() : $t('admin.navigation.dashboard')
}

function getCurrentTabDescription() {
  const descriptions: Record<string, string> = {
    'dashboard': $t('admin.dashboard.subtitle'),
    'products': $t('admin.products.subtitle'),
    'dynasties': $t('admin.dynasties.subtitle'),
    'shapes': $t('admin.shapes.subtitle'),
    'best-sellers': $t('admin.bestSellers.subtitle'),
    'settings': $t('admin.settings.subtitle')
  }
  return descriptions[activeTab.value] || $t('admin.dashboard.subtitle')
}

function logout() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  router.push('/admin/login')
}

function getImageSrc(imagePath: string) {
  if (!imagePath || imagePath === 'undefined' || imagePath.includes('undefined')) {
    return new URL(`../assets/tea_image/1.png`, import.meta.url).href
  }
  return API_CONFIG.getImageUrl(imagePath)
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = new URL(`../assets/tea_image/1.png`, import.meta.url).href
  img.alt = 'Default image'
}

function showToastMessage(message: string) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Product management methods
function addProduct() {
  editingProduct.value = {
    name: '',
    name_en: '',
    name_cn: '',
    description: '',
    description_en: '',
    description_cn: '',
    price: '',
    dynasty_id: 1,
    shape_id: 1,
    dimensions: '',
    weight: '',
    age: '',
    material: '',
    origin: '',
    primary_image: '',
    mainImage: '',
    images: [],
    thumbnails: [],
    is_featured: false,
    is_available: true,
    stock_quantity: 0,
    category: 'porcelain'
  }
  showProductModal.value = true
}

function editProduct(product: any) {
  editingProduct.value = { ...product }
  
  // 如果产品有thumbnails但没有images，将thumbnails转换为images格式
  if (product.thumbnails && product.thumbnails.length > 0 && (!product.images || product.images.length === 0)) {
    editingProduct.value.images = product.thumbnails.map((thumbnail: string, index: number) => ({
      id: Date.now() + index,
      image_url: thumbnail,
      image_path: thumbnail,
      alt_text: `Image ${index + 1}`
    }))
  }
  
  showProductModal.value = true
}

function saveProduct() {
  if (!editingProduct.value) return
  
  isLoading.value = true
  
  try {
    // 确保价格是数字类型
    if (editingProduct.value.price) {
      const priceStr = String(editingProduct.value.price).replace(/[^0-9.]/g, '')
      editingProduct.value.price = parseFloat(priceStr) || 0
    }
    
    // 如果是Best Sellers产品，需要同步images到thumbnails
    if (editingProduct.value.images && editingProduct.value.images.length > 0) {
      editingProduct.value.thumbnails = editingProduct.value.images.map((img: any) => 
        img.image_url || img.image_path || img
      )
    }
    
    // 检查是否是Best Sellers产品
    const isBestSeller = featuredProducts.value.some((product: any) => 
      product.name === editingProduct.value.name || 
      (product.name_en && product.name_en === editingProduct.value.name_en)
    )
    
    if (isBestSeller) {
      // 如果是Best Sellers产品，直接更新bestSellersProducts数组
      const bestSellerIndex = featuredProducts.value.findIndex((product: any) => 
        product.name === editingProduct.value.name || 
        (product.name_en && product.name_en === editingProduct.value.name_en)
      )
      
      if (bestSellerIndex !== -1) {
        // 更新Best Sellers产品
        adminStore.bestSellersProducts[bestSellerIndex] = { ...editingProduct.value }
        
        // 保存到localStorage
        try {
          localStorage.setItem('bestSellersProducts', JSON.stringify(adminStore.bestSellersProducts))
          console.log('Best Sellers产品已保存到localStorage:', adminStore.bestSellersProducts[bestSellerIndex])
        } catch (error) {
          console.error('Failed to save best sellers products:', error)
        }
      }
    } else {
      // 普通产品更新
      if (editingProduct.value.id) {
        adminStore.updateProduct(editingProduct.value.id, editingProduct.value)
      } else {
        adminStore.addProduct(editingProduct.value)
      }
    }
    
    showToastMessage($t('admin.products.saveSuccess'))
    showProductModal.value = false
    editingProduct.value = null
  } catch (error) {
    console.error('Error saving product:', error)
    showToastMessage($t('admin.products.saveError'))
  } finally {
    isLoading.value = false
  }
}

function deleteProduct(productId: number) {
  if (confirm($t('admin.products.confirmDelete'))) {
    adminStore.deleteProduct(productId)
    showToastMessage($t('admin.products.deleteSuccess'))
  }
}

// Dynasty management methods
function addDynasty() {
  editingDynasty.value = {
    name: '',
    name_cn: '',
    period: '',
    description: '',
    image: '',
    sort_order: dynasties.value.length + 1,
    is_enabled: true
  }
  showDynastyModal.value = true
}

function editDynasty(dynasty: any) {
  editingDynasty.value = { ...dynasty }
  showDynastyModal.value = true
}

function saveDynasty() {
  if (!editingDynasty.value) return
  
  try {
    const dynastyData = {
      name: editingDynasty.value.name,
      name_cn: editingDynasty.value.name_cn,
      period: editingDynasty.value.period,
      description: editingDynasty.value.description || '',
      image: editingDynasty.value.image,
      sort_order: editingDynasty.value.sort_order,
      is_enabled: editingDynasty.value.is_enabled
    }
    
    if (editingDynasty.value.id) {
      adminStore.updateDynasty(editingDynasty.value.id, dynastyData)
  } else {
      adminStore.addDynasty(dynastyData)
    }
    
    showToastMessage($t('admin.dynasties.saveSuccess'))
    showDynastyModal.value = false
    editingDynasty.value = null
  } catch (error) {
    console.error('Error saving dynasty:', error)
    showToastMessage($t('admin.dynasties.saveError'))
  }
}

function toggleDynasty(dynastyId: number) {
  const dynasty = dynasties.value.find(d => d.id === dynastyId)
  if (dynasty) {
    dynasty.is_enabled = !dynasty.is_enabled
    adminStore.updateDynasty(dynastyId, dynasty)
    showToastMessage(dynasty.is_enabled ? $t('admin.dynasties.enabled') : $t('admin.dynasties.disabled'))
  }
}

// Shape management methods
function addShape() {
  editingShape.value = {
    name: '',
    description: '',
    sort_order: shapes.value.length + 1,
    is_enabled: true
  }
  showShapeModal.value = true
}

function editShape(shape: any) {
  editingShape.value = { ...shape }
  showShapeModal.value = true
}

function saveShape() {
  if (!editingShape.value) return
  
  try {
    const shapeData = {
      name: editingShape.value.name,
      description: editingShape.value.description || '',
      sort_order: editingShape.value.sort_order,
      is_enabled: editingShape.value.is_enabled
    }
    
    if (editingShape.value.id) {
      adminStore.updateShape(editingShape.value.id, shapeData)
    } else {
      adminStore.addShape(shapeData)
    }
    
    showToastMessage($t('admin.shapes.saveSuccess'))
    showShapeModal.value = false
    editingShape.value = null
  } catch (error) {
    console.error('Error saving shape:', error)
    showToastMessage($t('admin.shapes.saveError'))
  }
}

function toggleShape(shapeId: number) {
  const shape = shapes.value.find(s => s.id === shapeId)
  if (shape) {
    shape.is_enabled = !shape.is_enabled
    adminStore.updateShape(shapeId, shape)
    showToastMessage(shape.is_enabled ? $t('admin.shapes.enabled') : $t('admin.shapes.disabled'))
  }
}

// Image management methods
function openImageSelector(type: 'primary' | 'additional') {
  currentImageSelectionType.value = type
  showImageSelector.value = true
}

function selectImage(imageName: string) {
  if (currentImageSelectionType.value === 'primary') {
    handlePrimaryImageSelect(imageName)
  } else {
    handleAdditionalImageSelect(imageName)
  }
}

function handlePrimaryImageSelect(imageFileName: string) {
  if (!editingProduct.value) return
  
  const imagePath = `/src/assets/tea_image/${imageFileName}`
  editingProduct.value.primary_image = imagePath
  editingProduct.value.mainImage = imagePath
  showImageSelector.value = false
}

function handleAdditionalImageSelect(imageFileName: string) {
  if (!editingProduct.value) return
  
  const imagePath = `/src/assets/tea_image/${imageFileName}`
  editingProduct.value.images.push({
    id: Date.now(),
    image_url: imagePath,
    image_path: imagePath,
    alt_text: imageFileName
  })
  editingProduct.value.thumbnails.push(imagePath)
  showImageSelector.value = false
}

function removeAdditionalImage(index: number) {
  if (!editingProduct.value) return
  
  editingProduct.value.images.splice(index, 1)
  editingProduct.value.thumbnails.splice(index, 1)
}

function getImageDisplayName(imagePath: string) {
  if (!imagePath) return 'No Image'
  if (imagePath.includes('/src/assets/tea_image/')) {
    return imagePath.split('/').pop() || 'Image'
  }
  if (imagePath.startsWith('blob:')) return 'Uploaded Image'
  if (imagePath.startsWith('data:')) return 'Base64 Image'
  return 'Image'
}

function getImageDisplayPath(imagePath: string) {
  if (!imagePath) return 'No path'
  if (imagePath.includes('/src/assets/tea_image/')) {
    return imagePath
  }
  if (imagePath.startsWith('blob:')) return 'blob:uploaded-image'
  if (imagePath.startsWith('data:')) return 'data:base64-image...'
  return imagePath
}

// Initialize
onMounted(() => {
  adminStore.loadSettings()
})
</script>
