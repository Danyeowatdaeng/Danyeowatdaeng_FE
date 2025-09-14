import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import { ChevronRight } from "lucide-react";

type Props = {
  icon: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
  className?: string;
};

export default function QuestCard({ icon, title, subtitle, onClick, className = "" }: Props) {
  return (
    <Button
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-2xl bg-[#F4F4F4] px-5 py-3 ${className}`}
      aria-label={title}
    >
      <div className="flex items-center gap-5">
        <div className="grid place-items-center w-[60px] h-[60px] rounded-full bg-white">
          <Icon 
            src={icon} 
            alt="" 
            className="w-[46px] h-[46px]" 
          />
        </div>

        <div>
          <p className="text-[16px] font-bold leading-none text-left">{title}</p>
          <p className="text-[14px] text-[#FF8A2B] text-left mt-1">{subtitle}</p>
        </div>
      </div>

      <ChevronRight className="w-[24px] h-[24px] text-[#858585]" aria-hidden />
    </Button>
  );
}