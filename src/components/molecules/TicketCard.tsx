import Button from "../atoms/Button";
import Label from "../atoms/Label";
import Icon from "../atoms/Icon";

type Props = {
  title: string;
  highlight: string;
  expires: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function TicketCard({
  title,
  highlight,
  expires,
  onClick,
  disabled,
  className = "",
}: Props) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      aria-label={`${title} 쿠폰`}
      className={[
        "relative w-full h-[107px] p-0 bg-transparent rounded-none",
        className,
      ].join(" ")}
    >
      {/* 티켓 배경 */}
      <Icon
        src="/Assets/icons/Ticket.svg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full pointer-events-none select-none"
      />

      {/* 티켓 내용 */}
      <div className="absolute inset-y-0 left-10 right-[112px] z-10 flex flex-col justify-center text-left">
        <Label content={title} className="text-[14px] " />
        <div className="text-[32px] font-extrabold leading-none text-[#00A3A5]">
          {highlight}
        </div>
        <Label content={`유효기간: ${expires}`} className="text-[12px] text-[#797979]" />
      </div>
    </Button>
  );
}