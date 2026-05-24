import React from 'react';

interface OfflineBannerProps {
  isOnline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs sm:text-sm py-2.5 px-4 text-center font-medium shadow-md sticky top-0 z-50 flex items-center justify-center space-x-2">
      <span className="inline-block animate-ping rounded-full h-2 w-2 bg-white"></span>
      <span>
        ⚡ <strong>Chế độ ngoại tuyến (Offline)</strong> - Hệ thống đã tự chuyển sang chế độ dự phòng. 
        Các đơn hàng mới sẽ lưu trữ cục bộ và tự động đồng bộ khi kết nối mạng được phục hồi!
      </span>
    </div>
  );
};
