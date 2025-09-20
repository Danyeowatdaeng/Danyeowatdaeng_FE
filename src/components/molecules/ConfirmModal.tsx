import Icon from "../../components/atoms/Icon";
import CTAButton from "../../components/atoms/CTAButton";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;

  title: string;                // 예: "산책하기 퀘스트 완료!"
  iconSrc?: string;             // 예: "/Assets/icons/paw-active.svg"
  confirmLabel?: string;        // 기본: "확인"
  confirmBgColor?: string;      // 기본: "#00A3A5"
  confirmTextColor?: string;    // 기본: "#FFFFFF"

  description?: string;         // 선택: 부가 설명
  size?: "sm" | "md";           // 카드 폭
  showClose?: boolean;          // 우상단 X 버튼
  className?: string;
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  iconSrc = "/Assets/icons/paw-active.svg",
  confirmLabel = "확인",
  confirmBgColor = "#00A3A5",
  confirmTextColor = "#FFFFFF",
  description,
  size = "md",
  showClose = true,
  className = "",
}: Props) {
  if (!open) return null;

  const width = size === "sm" ? "w-[320px]" : "w-[360px]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();  // 바깥 클릭 닫기
      }}
    >
      <div className={`relative bg-white rounded-2xl p-6 ${width} ${className}`}>
        {showClose && (
          <button
            aria-label="닫기"
            onClick={onClose}
            className="absolute right-3 top-3 p-1 rounded-md hover:bg-black/5"
          >
            <X className="w-4 h-4 text-gray-500" aria-hidden />
          </button>
        )}

        <div className="flex flex-col items-center gap-4">
          {iconSrc && (
            <Icon src={iconSrc} alt="" aria-hidden className="w-7 h-7" />
          )}
          <p className="text-[18px] font-bold text-[#111] text-center">{title}</p>
          {description && (
            <p className="text-[14px] text-gray-500 text-center leading-relaxed">
              {description}
            </p>
          )}

          <CTAButton
            label={confirmLabel}
            onClick={onConfirm}
            bgColor={confirmBgColor}
            textColor={confirmTextColor}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}