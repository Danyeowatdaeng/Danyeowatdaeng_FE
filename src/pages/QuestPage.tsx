import { useRouter } from "@tanstack/react-router";
import DailyQuestTemplate from "../components/templates/DailyQuestTemplate";

export default function QuestPage() {
  const router = useRouter();

  const goToDiaryWrite = () => router.navigate({ to: "/mypet/diary" });
  const goToWalk = () => router.navigate({ to: "/mypet/walk" });

  return (
    <DailyQuestTemplate
      onBack={() => router.history.back()}
      done={2}
      total={3}
      onWalk={goToWalk}
      onDiary={goToDiaryWrite}
      onReview={() => console.log("리뷰 이동")}
    />
  );
}