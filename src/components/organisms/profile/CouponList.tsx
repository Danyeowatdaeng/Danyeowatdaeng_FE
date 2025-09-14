import TicketCard from "../../molecules/TicketCard";

type Coupon = {
  id: string | number;
  title: string;
  highlight: string;
  expires: string;
};

type Props = {
  items: Coupon[];
  className?: string;
  onItemClick?: (id: Coupon["id"]) => void;
};

export default function CouponList({ items, className = "", onItemClick }: Props) {
  return (
    <section className={`flex flex-col py-7 gap-4 bg-[#F3F3F3] ${className}`}>
      {items.map((c) => (
        <TicketCard
          key={c.id}
          title={c.title}
          highlight={c.highlight}
          expires={c.expires}
          onClick={() => onItemClick?.(c.id)}
        />
      ))}
    </section>
  );
}