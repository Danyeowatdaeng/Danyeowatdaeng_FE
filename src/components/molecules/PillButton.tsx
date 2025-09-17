import Button from "../atoms/Button";
import Label from "../atoms/Label";

type Props = {
  text: string;
  onClick?: () => void;
  className?: string;
};

export default function PillButton({ text, onClick, className = "" }: Props) {
  return (
    <Button
      onClick={onClick}
      className={`h-7 px-4 rounded-full border border-[#D9D9D9] bg-white text-[#00A3A5] ${className}`}
    >
      <Label content={text} className="text-[12px] font-medium" />
    </Button>
  );
}