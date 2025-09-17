import Button from "../atoms/Button";
import Label from "../atoms/Label";
import Icon from "../atoms/Icon";

type Props = {
  iconSrc: string;
  value: string | number;
  caption: string;
  onClick?: () => void;
  className?: string;
};

export default function StatItem({
  iconSrc,
  value,
  caption,
  onClick,
  className = "",
}: Props) {
  return (
    <Button
      onClick={onClick}
      aria-label={`${caption} 보기`}
      className={[
        "flex flex-col items-center justify-center flex-1",
        "rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3A5]/60",
        "active:scale-[.99] select-none",   // 터치 피드백
        className,
      ].join(" ")}
    >
      {/* 아이콘 + 값 */}
      <div className="flex items-center gap-2">
        <Icon src={iconSrc} alt="" aria-hidden className="w-[32.5px] h-[32.5px]" />
        <Label
          content={`${value}`}
          className="text-[24px] font-semibold text-black leading-none"
        />
      </div>

      {/* 캡션 */}
      <Label content={caption} className="text-[13px] text-[#858585] mt-2" />
    </Button>
  );
}