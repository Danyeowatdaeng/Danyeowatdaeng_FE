// 아이콘 + 라벨 버튼
import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import Label from "../atoms/Label";

export type CategoryItemProps = {
  style: string;
  iconSrc: string;
  label: string;
  onClick?: () => void;
};

export default function CategoryItem({
  style,
  iconSrc,
  label,
  onClick,
}: CategoryItemProps) {
  return (
    <Button
      onClick={onClick}
      aria-label={label}
      className="
        w-[61px] h-[82px]          
        inline-flex flex-col items-center justify-center
        gap-2                    
        p-0                     
      "
    >
      {/* 회색 아이콘 박스 */}
      <div
        className={`
          w-[61px] h-[61px]
          rounded-xl ${style}
          flex items-center justify-center
        `}
      >
        <Icon src={iconSrc} alt={label} width={42} height={42} />
      </div>

      {/* 라벨 */}
      {label !== "" && (
        <Label
          content={label}
          className="text-[13px] leading-[18px] text-black"
        />
      )}
    </Button>
  );
}
