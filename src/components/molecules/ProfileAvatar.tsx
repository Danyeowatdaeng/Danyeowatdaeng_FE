import Button from "../atoms/Button";
import Icon from "../atoms/Icon";

type Props = {
  name: string;
  imageSrc?: string;
  onEdit?: () => void;
  className?: string;
};

export default function ProfileAvatar({
  name,
  imageSrc,
  onEdit,
  className = "",
}: Props) {
  return (
    <div className={`relative w-[126px] h-[126px] mx-auto ${className}`}>
      {/* 아바타 이미지 */}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={`${name} avatar`}
          className="w-full h-full rounded-full object-cover bg-gray-200"
        />
      ) : (
        <Icon
          src="/Assets/icons/ProfilePlaceholder.svg"
          alt="기본 아바타"
          className="w-full h-full rounded-full bg-gray-300"
        />
      )}

      {/* 편집 버튼 */}
      <Button
        aria-label="아바타 수정"
        onClick={onEdit}
        className="absolute right-0 bottom-0 w-[28px] h-[28px] rounded-full bg-[#858585] grid place-items-center"
      >
        <Icon
          src="/Assets/icons/Edit.svg"
          alt="edit"
          className="w-full h-full"
          aria-hidden
        />
      </Button>
    </div>
  );
}