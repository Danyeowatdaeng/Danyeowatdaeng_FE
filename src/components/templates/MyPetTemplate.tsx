import MyPetHeader from "../organisms/mypet/MyPetHeader";
import QuestRow from "../molecules//QuestRow";
import DiarySection from "../organisms/mypet/DiarySection";
import type { DiaryItem } from "../molecules/DiaryCard";

type Props = {
  // 헤더
  avatarSrc?: string;
  name: string;
  subtitle?: string;
  onEditHeader?: () => void;

  // 퀘스트
  onQuestClick?: () => void;

  // 다이어리
  diaries: DiaryItem[];
  onWriteDiary?: () => void;
  onDiaryClick?: (id: string | number) => void;
};

export default function MyPetTemplate({
  avatarSrc,
  name,
  subtitle,
  onEditHeader,
  onQuestClick,
  diaries,
  onWriteDiary,
  onDiaryClick,
}: Props) {
  return (
    <div className="h-dvh flex flex-col p-6 my-5">
      {/* 상단 고정 영역 */}
      <div className=" flex-none">
        <MyPetHeader
          avatarSrc={avatarSrc}
          name={name}
          subtitle={subtitle}
          onEdit={onEditHeader}
        />

        <QuestRow
          className="mt-10 "
          title="반려동물과 일일 퀘스트!"
          onClick={onQuestClick}
        />
      </div>

      {/* 다이어리 영역 — 이 래퍼가 스크롤 기준 */}
      <div className="flex-1 min-h-0 mt-8 ">
        <DiarySection
          className="h-full "
          items={diaries}
          onWrite={onWriteDiary}
          onItemClick={onDiaryClick}
        />
      </div>
    </div>
  );
}