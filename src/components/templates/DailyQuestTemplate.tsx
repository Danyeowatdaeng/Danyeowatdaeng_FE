import BackHeader from "../molecules/BackHeader";
import DailyProgress from "../organisms/mypet/DailyProgress";
import QuestList from "../organisms/mypet/QuestList";

type Props = {
  onBack?: () => void;
  // 진행률
  done: number;
  total: number;
  // 버튼 핸들러
  onWalk?: () => void;
  onDiary?: () => void;
  onReview?: () => void;
};

export default function DailyQuestTemplate({
  onBack,
  done,
  total,
  onWalk,
  onDiary,
  onReview,
}: Props) {
  return (
    <div className="p-6 my-5">
      {/* 헤더 */}
      <BackHeader onBack={onBack} label="일일퀘스트" />

      {/* 펫 캐릭터 (임시) */}
      <div className="w-full flex justify-center my- bg-red-100">
        <img
          src="/Assets/icons/Pet.svg"
          alt=""
          aria-hidden
          className="w-[188px] h-[188px] object-contain"
        />
      </div>

      {/* 진행률 */}
      <DailyProgress done={done} total={total} />

      {/* 목록 */}
      <QuestList className="mt-6" onWalk={onWalk} onDiary={onDiary} onReview={onReview} />
    </div>
  );
}