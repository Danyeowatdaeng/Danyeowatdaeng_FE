import MyPetTemplate from "../components/templates/MyPetTemplate";
import type { DiaryItem } from "../components/molecules/DiaryCard";

export default function MyPetPage() {

  const diaries: DiaryItem[] = [
    { id: 1, imageSrc: "/Assets/images/pet/1.jpg", caption: "바람맞은 강아지" },
    { id: 2, imageSrc: "/Assets/images/pet/1.jpg", caption: "바람맞은 강아지" },
    { id: 3, imageSrc: "/Assets/images/pet/1.jpg", caption: "바람맞은 강아지" },
    { id: 4, imageSrc: "/Assets/images/pet/1.jpg", caption: "바람맞은 강아지" },
    { id: 5, imageSrc: "/Assets/images/pet/1.jpg", caption: "바람맞은 강아지" },
    { id: 6, imageSrc: "/Assets/images/pet/1.jpg", caption: "바람맞은 강아지" },
    { id: 7, imageSrc: "/Assets/images/pet/1.jpg", caption: "바람맞은 강아지" },
    { id: 8, imageSrc: "/Assets/images/pet/1.jpg", caption: "바람맞은 강아지" },
  ];

  return (
    <MyPetTemplate
      avatarSrc="/Assets/images/pet/avatar.jpg"
      name="초코"
      subtitle="3살/푸들"
      onEditHeader={() => console.log("프로필 편집")}
      onQuestClick={() => console.log("퀘스트 이동")}
      diaries={diaries}
      onWriteDiary={() => console.log("다이어리 작성")}
      onDiaryClick={(id) => console.log("다이어리 클릭:", id)}
    />
  );
}