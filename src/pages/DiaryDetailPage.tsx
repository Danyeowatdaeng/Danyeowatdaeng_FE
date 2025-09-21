import { useParams } from "@tanstack/react-router";
import DiaryDetailTemplate from "../components/templates/DiaryDetailTemplate";

export default function DiaryDetailPage() {
  const { id } = useParams({ from: "/mypet/diary/$id" });

  // TODO: id로 상세 API 호출
  const diary = {
    id,
    image: "/Assets/images/pet/placeholder.jpg",
    content: "다이어리 상세 내용 예시입니다.",
  };

  return (
    <DiaryDetailTemplate
      image={diary.image}
      content={diary.content}
      onBack={() => history.back()}
      onEdit={() => console.log("수정 이동")}
      onDelete={() => console.log("삭제")}
    />
  );
}