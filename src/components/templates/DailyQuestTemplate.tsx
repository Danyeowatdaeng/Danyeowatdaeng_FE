import BackHeader from "../molecules/BackHeader";
import DailyProgress from "../organisms/mypet/DailyProgress";
import QuestList from "../organisms/mypet/QuestList";
import useUserInfoStore from "../../store/userInfoStore";

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
  const { memberInfo } = useUserInfoStore();

  return (
    <div className="p-6 my-5">
      {/* 헤더 */}
      <BackHeader onBack={onBack} label="일일퀘스트" />

      {/* 펫 캐릭터 */}
      <div className="w-full flex justify-center">
        <img
          src={
            memberInfo?.petAvatarCdnUrl 
              ? `https://${memberInfo.petAvatarCdnUrl}` 
              : memberInfo?.profileImageUrl || "/Assets/icons/PetAvatar1.svg"
          }
          alt=""
          aria-hidden
          className="w-[180px] h-[214px] object-contain"
        />
      </div>

      {/* 진행률 */}
      <DailyProgress done={done} total={total} className="my-5"/>

      {/* 목록 */}
      <QuestList onWalk={onWalk} onDiary={onDiary} onReview={onReview} />
    </div>
  );
}