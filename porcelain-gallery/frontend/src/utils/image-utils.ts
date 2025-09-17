// 通用图片URL处理工具
import { getImageUrl } from '@/utils/oss-image-manager'

/**
 * 获取图片URL - 兼容现有代码
 * @param imagePath 图片路径
 * @returns 处理后的图片URL
 */
export function getImageSrc(imagePath: string): string {
  return getImageUrl(imagePath)
}

/**
 * 获取默认图片URL
 * @returns 默认图片URL
 */
export function getDefaultImageSrc(): string {
  return getImageUrl('/src/assets/tea_image/1.png')
}

/**
 * 处理图片错误 - 设置默认图片
 * @param event 图片错误事件
 */
export function handleImageError(event: Event): void {
  const target = event.target as HTMLImageElement
  target.src = getDefaultImageSrc()
}

/**
 * 批量处理图片URL数组
 * @param imagePaths 图片路径数组
 * @returns 处理后的URL数组
 */
export function batchProcessImageUrls(imagePaths: string[]): string[] {
  return imagePaths.map(path => getImageSrc(path))
}
