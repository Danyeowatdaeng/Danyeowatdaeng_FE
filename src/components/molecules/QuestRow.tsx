import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import Title from "../atoms/Title";

type Props = {
  title: string;
  onClick?: () => void;
  className?: string;
};

export default function QuestRow({ title, onClick, className = "" }: Props) {
  return (
    <Button
      onClick={onClick}
      className={`w-full flex items-center justify-between ${className}`}
      aria-label={title}
    >
      <Title className="text-[20px] font-bold">{title}</Title>
      <Icon src="/Assets/icons/ChevronRight.svg" alt="" aria-hidden width={20} height={20} />
    </Button>
  );
}