import Button from "../atoms/Button";
import Title from "../atoms/Title";
import { ChevronRight } from "lucide-react";

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
      <Title className="text-[18px] font-bold">{title}</Title>
      <ChevronRight className="w-6 h-6" aria-hidden />
    </Button>
  );
}