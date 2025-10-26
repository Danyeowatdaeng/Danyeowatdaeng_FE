import { useState, useEffect } from "react";

interface LoadingModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
}

export default function LoadingModal({ 
  isOpen, 
  title = "캐릭터 생성 중...", 
  message = "잠시만 기다려주세요" 
}: LoadingModalProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");

  const messages = [
    "펫 사진을 분석하고 있어요...",
    "AI가 캐릭터를 디자인하고 있어요...",
    "마지막 터치를 하고 있어요...",
    "거의 완성되었어요!"
  ];

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentMessage("");
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 500);

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = messages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2000);

    // 초기 메시지 설정
    setCurrentMessage(messages[0]);

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 mx-4 max-w-sm w-full shadow-2xl transform transition-all duration-300 scale-100 border border-white/20">
        {/* 펫 아이콘과 로딩 애니메이션 */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* 펫 아이콘 배경 */}
            <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
              <svg 
                className="w-10 h-10 text-white animate-bounce" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z" />
              </svg>
            </div>
            
            {/* 회전하는 점들 */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1 -left-3 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* 텍스트 */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 min-h-[20px] transition-all duration-500">
            {currentMessage || message}
          </p>
        </div>

        {/* 진행률 표시 */}
        <div className="space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {Math.round(Math.min(progress, 100))}% 완료
            </span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-teal-500 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>

        {/* 하단 장식 */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
