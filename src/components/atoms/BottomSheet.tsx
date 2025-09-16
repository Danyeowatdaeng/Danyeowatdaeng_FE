// components/BottomSheet.tsx
import React from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { animated } from "@react-spring/web";
import { useBottomSheet } from "../../hooks/useBottomSheet";
import { useWebControlStore } from "../../store/webControlStore";
import { cn } from "../../utils/style";

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
  const isWide = useWebControlStore((state) => state.isWide);
  const MIN_HEIGHT = 400; // 기본 높이 (px)
  let MAX_HEIGHT = 600; // fallback

  // web/app 높이 다르게 계산
  if (typeof document !== "undefined") {
    if (isWide) {
      const appContainer = document.getElementById("app-container");
      if (appContainer) {
        const style = window.getComputedStyle(appContainer);
        const height = parseInt(style.height, 10);
        if (!isNaN(height)) {
          MAX_HEIGHT = height - 50;
        }
      }
    } else {
      MAX_HEIGHT = window.innerHeight - 50;
    }
  }

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
      className={cn(
        `w-full left-0 bottom-0 z-[100] ${open ? "" : "pointer-events-none"}`,
        {
          fixed: !isWide,
          absolute: isWide,
        }
      )}
    >
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
        className={`bg-white
          relative bottom-0 max-w-full
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
    isWide ? document.getElementById("app-container")! : document.body
  );
}
