import PetProfileCard from "../../molecules/PetProfileCard";

type Props = {
  avatarSrc?: string;
  name: string;
  subtitle?: string;
  onEdit?: () => void;
  className?: string;
};

export default function MyPetHeader({
  avatarSrc,
  name,
  subtitle,
  onEdit,
  className = "",
}: Props) {
  return (
    <div className={className}>
      <PetProfileCard
        avatarSrc={avatarSrc}
        name={name}
        subtitle={subtitle}
        onEdit={onEdit}
      />
    </div>
  );
}