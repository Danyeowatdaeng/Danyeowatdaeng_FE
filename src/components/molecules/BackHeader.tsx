// Molecule
import Button from "../atoms/Button";
import { ChevronLeft } from "lucide-react";
import Label from "../atoms/Label";

type BackHeaderProps = { onBack?: () => void; label?: string };

export default function BackHeader({ onBack, label }: BackHeaderProps) {
  return (
    <header className="w-full flex items-center gap-5">
      <Button aria-label="뒤로가기" onClick={onBack}>
        <ChevronLeft aria-label="chevron-left" aria-hidden />
      </Button>
      <Label content={label ?? ""} className="text-[20px] font-bold"/>
    </header>
  );
}
