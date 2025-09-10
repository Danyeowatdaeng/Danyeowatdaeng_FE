import Title from "../../atoms/Title";
import Label from "../../atoms/Label";
import ProfileAvatar from "../../molecules/ProfileAvatar";
import InfoIconButton from "../../molecules/InfoIconButton";

type Props = {
  name: string;
  subtitle?: string;
  imageSrc?: string;
  onEditAvatar?: () => void;
  onInfo?: () => void;
};

export default function ProfileHeader({
  name,
  subtitle = "",
  imageSrc,
  onEditAvatar,
  onInfo,
}: Props) {
  return (
    <section className="relative pt-2">
      {/* 우상단 info 버튼 */}
      <InfoIconButton
        onClick={onInfo}
        className="absolute right-1 top-0"
        ariaLabel="프로필 가이드"
      />

      <ProfileAvatar
        name={name}
        imageSrc={imageSrc}
        onEdit={onEditAvatar}
        className="mt-8"
      />

      <div className="text-center mt-6">
        <Title className="text-[18px] font-bold">{name}</Title>
        {subtitle && (
          <Label
            content={subtitle}
            className="text-[14px] text-[#444444] mt-1 inline-block"
          />
        )}
      </div>
    </section>
  );
}