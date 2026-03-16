/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // 關鍵：在靜態匯出模式下，必須關閉 Next.js 的圖片優化功能
  images: {
    unoptimized: true,
  },
  // 如果你的專案未來有用到特殊的路徑設定，可以在這裡加 trailingSlash
  trailingSlash: true, 
};

export default nextConfig;