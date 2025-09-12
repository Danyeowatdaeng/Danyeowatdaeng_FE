import type { ReactNode } from "react";
import Button from "../atoms/Button";
import Icon from "../atoms/Icon";

type Props = {
  children: ReactNode;
  onClose: () => void;
};

export default function ModalWrapper({ children, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-2xl w-[90%] max-w-md p-6">
        {/* 닫기 버튼 */}
        <Button
          onClick={onClose}
          className="absolute top-5 right-5 w-[24px] h-[24px] flex items-center justify-center "
          aria-label="닫기"
        >
          <Icon src="/Assets/icons/Close.svg" alt="" aria-hidden />
        </Button>

        {children}
      </div>
    </div>
  );
}