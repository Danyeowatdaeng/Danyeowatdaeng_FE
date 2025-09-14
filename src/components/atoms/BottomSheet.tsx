// components/BottomSheet.tsx
import React from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { animated } from "@react-spring/web";
import { useBottomSheet } from "../../hooks/useBottomSheet";

type BottomSheetProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  height?: string | number;
};

export default function BottomSheet({
  open,
  onOpenChange,
  children,
  title,
  className = "",
}: BottomSheetProps) {
  const MIN_HEIGHT = 400; // 기본 높이 (px)
  const MAX_HEIGHT = window.innerHeight - 50; // 전체 화면 높이에서 여유 공간

  const { height, y, bind } = useBottomSheet({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    open,
    onClose: () => onOpenChange(false),
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[1000] ${open ? "" : "pointer-events-none"}`}
    >
      {/* Overlay */}
      <button
        aria-label="닫기"
        onClick={() => onOpenChange(false)}
        className={`absolute inset-0 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />

      {/* Sheet */}
      <animated.div
        {...bind()}
        role="dialog"
        aria-modal="true"
        style={{
          height: height.to((h) => `${h}px`),
          transform: y.to((py) => `translateY(${py}px)`),
          touchAction: "none",
        }}
        className={`
        bg-white
          absolute left-0 right-0 bottom-0
          rounded-t-4xl shadow-xl
          transition-transform duration-500
          ${open ? "" : "translate-y-full"}
          ${className}
          pb-[env(safe-area-inset-bottom)]
        `}
      >
        <div className="h-1.5 w-10 mx-auto my-3 rounded-full bg-gray-300" />
        {title && (
          <div className="px-4 pb-2 text-base font-semibold">{title}</div>
        )}
        <div className="px-2 pb-6">{children}</div>
      </animated.div>
    </div>,
    document.body
  );
}
