// 在AdminView.vue中修改loadMediaLibrary函数
async function loadMediaLibrary() {
  try {
    // 使用静态媒体库数据
    const staticMediaData = {
      success: true,
      media: [
        {
          id: 24,
          filename: "media_1758089165792-528600025.png",
          original_filename: "jimeng-2025-09-17-8325-参照这个陶瓷的款式和图片布局，衍生出相同款式，其他颜色的陶瓷，背景同样保持纯黑色....png",
          file_path: "media_library/product/media_1758089165792-528600025.png",
          file_url: "/media_library/product/media_1758089165792-528600025.png",
          oss_url: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/media_library/product/media_1758089165792-528600025.png",
          mime_type: "image/png",
          file_size: 1384377,
          width: 1080,
          height: 1080,
          alt_text: "jimeng-2025-09-17-8325-参照这个陶瓷的款式和图片布局，衍生出相同款式，其他颜色的陶瓷，背景同样保持纯黑色....png",
          caption: "",
          tags: "[\"product\"]",
          category: "product",
          is_public: 1,
          uploaded_by: 1,
          created_at: "2025-09-17T06:06:07.000Z"
        },
        {
          id: 23,
          filename: "media_1758089154599-766836463.png",
          original_filename: "jimeng-2025-09-17-4902-参照这个陶瓷的款式和图片布局，衍生出相同款式，其他颜色的陶瓷，背景同样保持纯黑色....png",
          file_path: "media_library/product/media_1758089154599-766836463.png",
          file_url: "/media_library/product/media_1758089154599-766836463.png",
          oss_url: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/media_library/product/media_1758089154599-766836463.png",
          mime_type: "image/png",
          file_size: 1118952,
          width: 1080,
          height: 1080,
          alt_text: "jimeng-2025-09-17-4902-参照这个陶瓷的款式和图片布局，衍生出相同款式，其他颜色的陶瓷，背景同样保持纯黑色....png",
          caption: "",
          tags: "[\"product\"]",
          category: "product",
          is_public: 1,
          uploaded_by: 1,
          created_at: "2025-09-17T06:05:56.000Z"
        }
        // 可以添加更多媒体文件...
      ],
      total: 23
    };
    
    mediaLibrary.value = staticMediaData.media;
    console.log('媒体库数据加载成功:', mediaLibrary.value.length, '个文件');
    
  } catch (error) {
    console.error('Error loading media library:', error);
  }
}
