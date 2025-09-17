import TicketCard from "../../molecules/TicketCard";

export type Coupon = {
  id: string | number;
  title: string;
  highlight: string;
  expires: string;
  disabled?: boolean;
};

type Props = {
  items: Coupon[];
  className?: string;
  onItemClick?: (id: Coupon["id"]) => void;

  // 있으면 다운로드 버튼 표시 / 없으면 표시 안 함
  onDownloadClick?: (id: Coupon["id"]) => void;

  // ✅ 페이지별 티켓 배경 이미지
  ticketBgSrc?: string;
};

export default function CouponList({
  items,
  className = "",
  onItemClick,
  onDownloadClick,
  ticketBgSrc, // ✅ 추가
}: Props) {
  return (
    <section className={`flex flex-col px-6 pt-4 pb-50 gap-1 bg-[#F3F3F3] ${className}`}>
      {items.map((c) => (
        <TicketCard
          key={c.id}
          title={c.title}
          highlight={c.highlight}
          expires={c.expires}
          onClick={() => onItemClick?.(c.id)}
          // onDownloadClick가 있으면 버튼 노출, 없으면 숨김
          onDownload={onDownloadClick ? () => onDownloadClick(c.id) : undefined}
          downloadDisabled={c.disabled}
          downloadIcon="/Assets/icons/DownloadActive.svg"
          downloadIconDisabled="/Assets/icons/Download.svg"
          backgroundSrc={ticketBgSrc}
        />
      ))}
    </section>
  );
}