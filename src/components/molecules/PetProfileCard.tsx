import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import Label from "../atoms/Label";
import Title from "../atoms/Title";

type Props = {
  avatarSrc?: string;
  name: string;
  subtitle?: string;
  onEdit?: () => void;
  className?: string;
};

export default function PetProfileCard({
  avatarSrc,
  name,
  subtitle,
  onEdit,
  className = "",
}: Props) {
  return (
    <section
      className={`
        w-full h-[85px] rounded-full bg-[#00A3A5] text-white
        pl-3 pr-6 py-4 flex items-center gap-4 ${className}
      `}
    >
      {/* 펫 사진 */}
      <div className="w-[62px] h-[62px] rounded-full bg-white/15 grid place-items-center flex-shrink-0 overflow-hidden">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={`${name} avatar`}
            className="w-[62px] h-[62px] rounded-full object-cover bg-white/70"
          />
        ) : (
          <Icon
            src="/Assets/icons/PetPlaceholder.svg"
            aria-hidden
            alt=""
            width={52}
            height={52}
          />
        )}
      </div>

      {/* 텍스트 */}
      <div className="min-w-0 flex-1">
        <Title className="text-[20px] text-white font-semibold leading-none truncate">
          {name}
        </Title>
        {subtitle && (
          <Label
            content={subtitle}
            className="text-[14px] text-white mt-1 truncate"
          />
        )}
      </div>

      {/* 편집 버튼 */}
      <Button
        aria-label="프로필 편집"
        onClick={onEdit}
        className="w-[32px] h-[32px] rounded-full border border-white-100 grid place-items-center flex-shrink-0"
      >
        <Icon 
          src="/Assets/icons/Edit.svg" 
          alt="" 
          aria-hidden 
          className="w-[17.7px] h-[17.7px]"
        />
      </Button>
    </section>
  );
}