import { useRouter, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import DailyQuestTemplate from "../components/templates/DailyQuestTemplate";
import { usePointStore } from "../store/pointStore"; // 👈 추가

type CompletedKey = "walk" | "diary" | "review";

export default function QuestPage() {
  const router = useRouter();
  const search = useSearch({ strict: false }) as { completed?: CompletedKey };

  const addPoint = usePointStore((s) => s.add); // 👈 +20 할 때 사용

  const [walkDone, setWalkDone] = useState(false);
  const [diaryDone, setDiaryDone] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);

  useEffect(() => {
    if (search?.completed === "walk") {
      setWalkDone(true);
      addPoint(20); // 👈 여기서 20 포인트 적립
    }
    if (search?.completed === "diary") setDiaryDone(true);
    if (search?.completed === "review") setReviewDone(true);

    // 파라미터 제거(중복 적립 방지)
    if (search?.completed) router.navigate({ to: "/mypet/quest", replace: true });
  }, [search?.completed, router, addPoint]);

  const total = 3;
  const done = useMemo(
    () => Number(walkDone) + Number(diaryDone) + Number(reviewDone),
    [walkDone, diaryDone, reviewDone]
  );

  const goToDiaryWrite = () => router.navigate({ to: "/mypet/diary" });
  const goToWalk = () => router.navigate({ to: "/mypet/walk" });
  const goToReview = () => router.navigate({ to: "/mypet" });

  return (
    <DailyQuestTemplate
      onBack={() => router.history.back()}
      done={done}
      total={total}
      onWalk={goToWalk}
      onDiary={goToDiaryWrite}
      onReview={goToReview}
    />
  );
}