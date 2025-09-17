<!-- 统一图片组件 - 替换所有混乱的图片显示代码 -->
<template>
  <img
    v-if="imageInfo.url"
    :src="imageInfo.url"
    :alt="alt"
    :class="imgClass"
    :style="imgStyle"
    @load="onLoad"
    @error="onError"
    @click="onClick"
  />
  <div
    v-else-if="showPlaceholder"
    :class="placeholderClass"
    :style="placeholderStyle"
  >
    {{ placeholderText }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getImageUrl, processImage, type ImageInfo } from '../config/image-processor'

// Props
interface Props {
  src: string
  alt?: string
  class?: string | string[] | Record<string, boolean>
  style?: string | Record<string, any>
  placeholder?: string
  showPlaceholder?: boolean
  lazy?: boolean
  fallback?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  class: '',
  style: '',
  placeholder: 'Image not available',
  showPlaceholder: true,
  lazy: false,
  fallback: ''
})

// Emits
interface Emits {
  load: [event: Event]
  error: [event: Event]
  click: [event: MouseEvent]
}

const emit = defineEmits<Emits>()

// 响应式数据
const imageLoaded = ref(false)
const imageError = ref(false)

// 计算属性
const imageInfo = computed((): ImageInfo => {
  if (imageError.value && props.fallback) {
    return processImage(props.fallback)
  }
  return processImage(props.src)
})

const imgClass = computed(() => {
  const baseClass = 'unified-image'
  const propsClass = props.class
  const stateClass = imageLoaded.value ? 'loaded' : 'loading'
  const errorClass = imageError.value ? 'error' : ''
  
  return [baseClass, propsClass, stateClass, errorClass].filter(Boolean)
})

const imgStyle = computed(() => {
  const baseStyle = {
    transition: 'opacity 0.3s ease-in-out',
    opacity: imageLoaded.value ? 1 : 0
  }
  
  if (typeof props.style === 'string') {
    return { ...baseStyle, ...JSON.parse(props.style) }
  }
  
  return { ...baseStyle, ...props.style }
})

const placeholderClass = computed(() => {
  return [
    'unified-image-placeholder',
    'flex items-center justify-center',
    'bg-gray-200 text-gray-500',
    'text-sm font-medium'
  ]
})

const placeholderStyle = computed(() => {
  return {
    minHeight: '100px',
    minWidth: '100px'
  }
})

const placeholderText = computed(() => {
  return props.placeholder
})

// 事件处理
const onLoad = (event: Event) => {
  imageLoaded.value = true
  imageError.value = false
  emit('load', event)
}

const onError = (event: Event) => {
  imageError.value = true
  emit('error', event)
}

const onClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style scoped>
.unified-image {
  display: block;
  max-width: 100%;
  height: auto;
}

.unified-image.loading {
  opacity: 0;
}

.unified-image.loaded {
  opacity: 1;
}

.unified-image.error {
  opacity: 0.5;
}

.unified-image-placeholder {
  border: 2px dashed #d1d5db;
  border-radius: 0.375rem;
}
</style>
