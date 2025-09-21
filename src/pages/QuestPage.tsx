import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearch } from "@tanstack/react-router";
import DailyQuestTemplate from "../components/templates/DailyQuestTemplate";

type CompletedKey = "walk" | "diary" | "review";

export default function QuestPage() {
  const router = useRouter();
  // /quest?completed=walk 또는 diary 로 돌아옴
  const search = useSearch({ strict: false }) as { completed?: CompletedKey };

  // 각 퀘스트 완료 플래그 (중복 방지)
  const [walkDone, setWalkDone]   = useState(false);
  const [diaryDone, setDiaryDone] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);

  // 돌아올 때 completed 파라미터로 상태 반영
  useEffect(() => {
    if (search?.completed === "walk")  setWalkDone(true);
    if (search?.completed === "diary") setDiaryDone(true);
    if (search?.completed === "review") setReviewDone(true);

    // URL 깔끔히: 파라미터 제거 (replace)
    if (search?.completed) {
      router.navigate({ to: "/mypet/quest", replace: true });
    }
  }, [search?.completed, router]);

  // 진행률 계산
  const total = 3;
  const done = useMemo(
    () => Number(walkDone) + Number(diaryDone) + Number(reviewDone),
    [walkDone, diaryDone, reviewDone]
  );

  // 이동 핸들러
  const goToDiaryWrite = () => router.navigate({ to: "/mypet/diary" });
  const goToWalk       = () => router.navigate({ to: "/mypet/walk" });
  const goToReview     = () => router.navigate({ to: "/mypet" });

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