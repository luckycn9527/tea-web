<template>
  <Transition name="toast">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <!-- Background overlay with blur -->
      <div class="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>
      
      <!-- Toast content -->
      <div class="relative bg-gray-900 border border-gray-600 rounded-xl shadow-2xl px-6 py-4 flex items-center space-x-3 pointer-events-auto transform">
        <!-- Success Icon with Animation -->
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <!-- Success Message -->
        <div class="text-white font-medium text-base">
          {{ message }}
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  show: boolean
  message: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2000
})

const emit = defineEmits<{
  close: []
}>()

const show = ref(props.show)

watch(() => props.show, (newShow) => {
  show.value = newShow
  if (newShow) {
    setTimeout(() => {
      show.value = false
      emit('close')
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: scale(0.7) translateY(-30px);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Background overlay animation */
.toast-enter-active .absolute {
  transition: opacity 0.3s ease-out;
}

.toast-leave-active .absolute {
  transition: opacity 0.2s ease-in;
}

.toast-enter-from .absolute {
  opacity: 0;
}

.toast-leave-to .absolute {
  opacity: 0;
}

/* Success icon animation */
@keyframes success-bounce {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.toast-enter-active .w-8 {
  animation: success-bounce 0.6s ease-out;
}
</style>
