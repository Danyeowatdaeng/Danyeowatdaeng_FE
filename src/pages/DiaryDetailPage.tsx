import { useParams } from "@tanstack/react-router";
import BackHeader from "../components/molecules/BackHeader";

export default function DiaryDetailPage() {
  const { id } = useParams({ from: "/mypet/diary/$id" });

  // TODO: API 호출해서 id에 맞는 다이어리 데이터 가져오기
  const diary = {
    id,
    image: "/Assets/images/pet/placeholder.jpg",
    content: "다이어리 상세 내용 예시입니다.",
  };

  return (
    <div className="p-6">
      <BackHeader onBack={() => history.back()} label="마이펫 다이어리" />

      <img
        src={diary.image}
        alt="다이어리 이미지"
        className="w-full h-[300px] rounded-xl object-cover mt-6"
      />

      <p className="mt-6 text-[16px] text-[#333] whitespace-pre-line">
        {diary.content}
      </p>
    </div>
  );
}