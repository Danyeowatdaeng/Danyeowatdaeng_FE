import QuestCard from "../../molecules/QuestCard";

type Props = {
  onWalk?: () => void;
  onDiary?: () => void;
  onReview?: () => void;
  className?: string;
};

export default function QuestList({ onWalk, onDiary, onReview, className = "" }: Props) {
  return (
    <section className={`flex flex-col gap-5 ${className}`}>
      <QuestCard
        icon="/Assets/icons/Walk.svg"
        title="산책하기"
        subtitle="퀘스트 완료시 20point 지급!"
        onClick={onWalk}
      />
      <QuestCard
        icon="/Assets/icons/Diary.svg"
        title="다이어리 올리기"
        subtitle="퀘스트 완료시 30point 지급!"
        onClick={onDiary}
      />
      <QuestCard
        icon="/Assets/icons/Review.svg"
        title="리뷰 남기기"
        subtitle="퀘스트 완료시 50point 지급!"
        onClick={onReview}
      />
    </section>
  );
}