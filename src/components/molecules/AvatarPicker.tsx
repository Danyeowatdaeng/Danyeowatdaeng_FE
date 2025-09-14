import Button from "../atoms/Button";
import Icon from "../atoms/Icon";

type Props = {
  value?: string; // 현재 선택된 아바타
  options: string[];
  onChange: (src?: string) => void;
  onUpload?: () => void;
  className?: string;
  size?: number;
  thumbSize?: number;
};

export default function AvatarPicker({
  value,
  options,
  onChange,
  onUpload,
  className = "",
  size = 138,
  thumbSize = 58,
}: Props) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* 큰 아바타 */}
      <div
        className="overflow-hidden rounded-full bg-[#00A3A5]"
        style={{ width: size, height: size }}
      >
        {value ? (
          <img src={value} alt="current avatar" className="w-full h-full object-cover" />
        ) : null}
      </div>

      {/* 썸네일들 */}
      <div className="mt-6 flex items-center justify-center gap-3">
        {/* 업로드(+) */}
        <Button
          type="button"
          aria-label="사진 추가"
          onClick={onUpload ?? (() => console.log("아바타 업로드"))}
          className="grid place-items-center rounded-full bg-[#D9D9D9]"
          style={{ width: thumbSize, height: thumbSize }}
        >
          <Icon src="/Assets/icons/Plus.svg" alt="" aria-hidden />
        </Button>

        {/* 옵션 3개 */}
        {options.slice(0, 3).map((src) => (
          <Button
            key={src}
            aria-label="아바타 선택"
            onClick={() => onChange(src)}
            className="overflow-hidden rounded-full bg-[#D9D9D9]"
            style={{ width: thumbSize, height: thumbSize }}
          >
            <Icon src={src} alt="avatar option" className="w-full h-full object-contain" />
          </Button>
        ))}
      </div>
    </div>
  );
}