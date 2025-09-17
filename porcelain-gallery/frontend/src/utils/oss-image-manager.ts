// OSS图片URL处理工具类
export class OSSImageManager {
  private static instance: OSSImageManager;
  private ossBaseUrl: string;
  private useOSS: boolean;

  constructor() {
    // 从环境变量获取OSS配置
    this.useOSS = import.meta.env.VITE_USE_OSS === 'true';
    this.ossBaseUrl = import.meta.env.VITE_OSS_BASE_URL || 'https://tea-web.oss-cn-hangzhou.aliyuncs.com';
  }

  static getInstance(): OSSImageManager {
    if (!OSSImageManager.instance) {
      OSSImageManager.instance = new OSSImageManager();
    }
    return OSSImageManager.instance;
  }

  /**
   * 获取图片URL
   * @param imagePath 图片路径
   * @returns 处理后的图片URL
   */
  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return this.getDefaultImage();
    }

    // 如果使用OSS且路径包含tea_image
    if (this.useOSS && imagePath.includes('tea_image')) {
      return this.convertToOSSUrl(imagePath);
    }

    // 如果已经是OSS URL，直接返回
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // 默认使用本地资源
    return this.convertToLocalUrl(imagePath);
  }

  /**
   * 转换为OSS URL
   * @param imagePath 本地图片路径
   * @returns OSS URL
   */
  private convertToOSSUrl(imagePath: string): string {
    // 提取文件名
    const fileName = this.extractFileName(imagePath);
    if (!fileName) {
      return this.getDefaultImage();
    }

    // 构建OSS URL
    return `${this.ossBaseUrl}/tea_image/${fileName}`;
  }

  /**
   * 转换为本地URL
   * @param imagePath 图片路径
   * @returns 本地URL
   */
  private convertToLocalUrl(imagePath: string): string {
    // 如果路径以/src/assets/开头，使用new URL处理
    if (imagePath.startsWith('/src/assets/')) {
      const fileName = this.extractFileName(imagePath);
      if (fileName) {
        return new URL(`../assets/tea_image/${fileName}`, import.meta.url).href;
      }
    }

    // 如果路径包含tea_image，提取文件名
    if (imagePath.includes('tea_image')) {
      const fileName = this.extractFileName(imagePath);
      if (fileName) {
        return new URL(`../assets/tea_image/${fileName}`, import.meta.url).href;
      }
    }

    return imagePath;
  }

  /**
   * 提取文件名
   * @param imagePath 图片路径
   * @returns 文件名
   */
  private extractFileName(imagePath: string): string | null {
    // 处理各种路径格式
    const patterns = [
      /\/src\/assets\/tea_image\/(.+)$/,
      /tea_image\/(.+)$/,
      /([^\/]+\.(png|jpg|jpeg|gif|webp))$/i
    ];

    for (const pattern of patterns) {
      const match = imagePath.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * 获取默认图片
   * @returns 默认图片URL
   */
  private getDefaultImage(): string {
    if (this.useOSS) {
      return `${this.ossBaseUrl}/tea_image/1.png`;
    }
    return new URL('../assets/tea_image/1.png', import.meta.url).href;
  }

  /**
   * 批量处理图片URL
   * @param imagePaths 图片路径数组
   * @returns 处理后的URL数组
   */
  batchProcessUrls(imagePaths: string[]): string[] {
    return imagePaths.map(path => this.getImageUrl(path));
  }

  /**
   * 检查是否使用OSS
   * @returns 是否使用OSS
   */
  isUsingOSS(): boolean {
    return this.useOSS;
  }

  /**
   * 获取OSS基础URL
   * @returns OSS基础URL
   */
  getOSSBaseUrl(): string {
    return this.ossBaseUrl;
  }
}

// 导出单例实例
export const ossImageManager = OSSImageManager.getInstance();

// 便捷函数
export function getImageUrl(imagePath: string): string {
  return ossImageManager.getImageUrl(imagePath);
}

export function getDefaultImage(): string {
  return ossImageManager.getImageUrl('/src/assets/tea_image/1.png');
}
