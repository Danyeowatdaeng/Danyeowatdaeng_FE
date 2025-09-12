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
        // 버튼 자체를 배경 컨테이너로 사용
        "relative w-full h-[107px] p-0 bg-transparent rounded-none",
        "active:scale-[.99] disabled:opacity-50",
        className,
      ].join(" ")}
    >
      {/* 배경: 점선 포함된 SVG 한 장 */}
      <Icon
        src="/Assets/icons/Ticket.svg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full pointer-events-none select-none"
      />

      {/* 내용: 항상 티켓 안에서 중앙정렬 */}
      {/* 오른쪽 톱니/점선 영역을 피하려고 right 여백 고정 */}
      <div className="absolute inset-y-0 left-6 right-[112px] z-10 flex flex-col justify-center tes ">
        <Label content={title} className="text-[14px]" />
        <div className="text-[32px] font-extrabold leading-none text-[#00A3A5]">
          {highlight}
        </div>
        <Label content={`유효기간: ${expires}`} className="text-[12px] text-[#797979]" />
      </div>
    </Button>
  );
}