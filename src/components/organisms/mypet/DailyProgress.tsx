import ProgressBar from "../../molecules/ProgressBar";

type Props = {
  done: number;
  total: number;
  className?: string;
};

export default function DailyProgress({ done, total, className = "" }: Props) {
  return (
    <section className={className}>
      <div className="flex items-end justify-between mb-2 px-2">
        <p className="text-[15px] font-medium">오늘의 퀘스트 달성률</p>
        <p className="text-[15px] text-[#FF8A2B]">{done}/{total}</p>
      </div>
      <ProgressBar value={done} max={total} />
    </section>
  );
}