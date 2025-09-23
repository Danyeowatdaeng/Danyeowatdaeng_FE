// src/components/molecules/UploadFile.tsx
import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import { X } from "lucide-react";

type Props = {
  imageSrc?: string;
  onPick?: () => void;
  onRemove?: () => void;
  fallbackSrc?: string;   // 이미지 깨질 때 대체 이미지
  className?: string;
};

export default function UploadFile({
  imageSrc,
  onPick,
  onRemove,
  fallbackSrc = "/Assets/images/diary-fallback.png",
  className = "",
}: Props) {
  return (
    <div
      className={`relative w-[96px] h-[96px] rounded-2xl overflow-hidden bg-gray-100 ${className}`}
    >
      {imageSrc ? (
        <>
          <img
            src={imageSrc}
            alt="미리보기"
            className="w-full h-full object-cover select-none"
            draggable={false}
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src !== fallbackSrc) img.src = fallbackSrc;
            }}
          />

          {/* 삭제 버튼: 클릭 버블링 방지, type=button로 폼 submit 방지 */}
          <Button
            type="button"
            aria-label="사진 삭제"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove?.();
            }}
            className="absolute right-2 top-2 grid place-items-center w-7 h-7 rounded-full bg-black/60 hover:bg-black/70"
          >
            <X className="w-4 h-4 text-white" aria-hidden />
          </Button>
        </>
      ) : (
        // 추가 버튼: type=button 필수
        <Button
          type="button"
          aria-label="사진 추가"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPick?.();
          }}
          className="w-full h-full grid place-items-center hover:bg-gray-200/60 active:scale-95 transition"
        >
          <Icon
            src="/Assets/icons/Plus.svg"
            alt=""
            aria-hidden
            className="w-[35px] h-[35px] opacity-70"
          />
        </Button>
      )}
    </div>
  );
}