import { useRouter } from "@tanstack/react-router";
import DailyQuestTemplate from "../components/templates/DailyQuestTemplate";

export default function QuestPage() {
  const router = useRouter();

  return (
    <DailyQuestTemplate
      onBack={() => router.history.back()}
      done={2}
      total={3}
      onWalk={() => console.log("산책하기 이동")}
      onDiary={() => console.log("다이어리 이동")}
      onReview={() => console.log("리뷰 이동")}
    />
  );
}