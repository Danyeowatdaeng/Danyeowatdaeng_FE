import Label from "../atoms/Label";
import Icon from "../atoms/Icon";

type Props = {
  iconSrc: string;
  value: string | number;
  caption: string;
};

export default function StatItem({ iconSrc, value, caption }: Props) {
  return (
    <div className="flex flex-col items-center flex-1">
      {/* 아이콘 + 값 */}
      <div className="flex items-center gap-2">
        <Icon
          src={iconSrc}
          alt={caption}
          className="w-[32.5px] h-[32.5px]"
        />
        <Label
          content={`${value}`}
          className="text-[24px] font-semibold text-black leading-none"
        />
      </div>

      {/* 캡션 */}
      <Label
        content={caption}
        className="text-[13px] text-[#858585] mt-2"
      />
    </div>
  );
}