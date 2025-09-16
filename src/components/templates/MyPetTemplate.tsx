import { useState } from "react";
import MyPetHeader from "../organisms/mypet/MyPetHeader";
import QuestRow from "../molecules/QuestRow";
import DiarySection from "../organisms/mypet/DiarySection";
import ModalWrapper from "../molecules/ModalWrapper";
import PetEditForm from "../organisms/mypet/PetEditForm";
import type { DiaryItem } from "../molecules/DiaryCard";
import TabBar from "../molecules/TabBar";

type Props = {
  //헤더
  avatarSrc?: string;
  name: string;
  subtitle?: string;

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
  onQuestClick,
  diaries,
  onWriteDiary,
  onDiaryClick,
}: Props) {
  const [isEditOpen, setEditOpen] = useState(false);

  return (
    <div>
      <div className="h-dvh flex flex-col p-6 my-5">
        {/* 상단 고정 */}
        <div className="flex-none">
          <MyPetHeader
            avatarSrc={avatarSrc}
            name={name}
            subtitle={subtitle}
            onEdit={() => setEditOpen(true)} // 아이콘 클릭 시 모달 열기
          />
          <QuestRow
            className="mt-10"
            title="반려동물과 일일 퀘스트!"
            onClick={onQuestClick}
          />
        </div>

        {/* 다이어리 */}
        <div className="flex-1 min-h-0 mt-8">
          <DiarySection
            className="h-full"
            items={diaries}
            onWrite={onWriteDiary}
            onItemClick={onDiaryClick}
          />
        </div>

        {/* 모달 */}
        {isEditOpen && (
          <ModalWrapper onClose={() => setEditOpen(false)}>
            <PetEditForm
              avatarSrc={avatarSrc}
              name={name}
              subtitle={subtitle ?? ""}
              onSave={() => setEditOpen(false)}
            />
          </ModalWrapper>
        )}
      </div>
      <TabBar className="sticky bottom-0 w-full z-30" />
    </div>
  );
}
