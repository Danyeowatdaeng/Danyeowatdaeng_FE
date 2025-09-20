import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import { X } from "lucide-react";

type Props = {
  imageSrc?: string;
  onPick?: () => void;
  onRemove?: () => void;
  className?: string;
};

export default function UploadFile({ imageSrc, onPick, onRemove, className = "" }: Props) {
  return (
    <div className={`relative w-[96px] h-[96px] rounded-2xl overflow-hidden ${className}`}>
      {imageSrc ? (
        <>
          <img src={imageSrc} alt="preview" className="w-full h-full object-cover" />


          <Button
            aria-label="사진 삭제"
            onClick={onRemove}
            className="absolute right-2 top-2 grid place-items-center w-7 h-7 rounded-full bg-black/60"
          >
            <X className="w-4 h-4 text-white" aria-hidden />
          </Button>
        </>
      ) : (
        <Button
          aria-label="사진 추가"
          onClick={onPick}
          className="w-full h-full grid place-items-center"
        >

          <Icon 
            src="/Assets/icons/Plus.svg" 
            alt="" 
            aria-hidden
            className="w-[35px] h-[35px]" />
        </Button>
      )}
    </div>
  );
}