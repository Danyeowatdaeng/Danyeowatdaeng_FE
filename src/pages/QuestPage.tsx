// src/pages/QuestPage.tsx
import { useRouter, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import DailyQuestTemplate from "../components/templates/DailyQuestTemplate";
import { usePointStore } from "../store/pointStore";
import { fetchTodayQuests } from "../api/quest";

type CompletedKey = "walk" | "diary" | "review";

export default function QuestPage() {
  const router = useRouter();
  const search = useSearch({ strict: false }) as { completed?: CompletedKey };

  const addPoint = usePointStore((s) => s.add);

  // 서버/로컬 동기화용 상태
  const [walkDone, setWalkDone] = useState(false);
  const [diaryDone, setDiaryDone] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const [total, setTotal] = useState(3);

  /** 서버에서 오늘의 진행률 읽어오기 */
  const load = async () => {
    try {
      const t = await fetchTodayQuests();

      // 서버 값으로 덮어쓰기
      setTotal(t.total);
      setWalkDone(!!t.byType?.WALK_DAILY?.isCompleted);
      setDiaryDone(!!t.byType?.DIARY_DAILY?.isCompleted);
      setReviewDone(!!t.byType?.REVIEW_DAILY?.isCompleted);
    } catch (e) {
      console.error("오늘의 퀘스트 조회 실패:", e);
      // 서버 장애 시에도 UI가 죽지 않게 기본값 유지
    }
  };

  // 최초 진입 시 서버값으로 채우기
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 완료 플래그로 돌아올 때: 즉시 반영 + 포인트 적립 + 쿼리 제거 후 재조회
  useEffect(() => {
    const key = search?.completed;
    if (!key) return;

    // 1) 낙관적 진행률 반영(즉시 UI에 표시)
    if (key === "walk") setWalkDone(true);
    if (key === "diary") setDiaryDone(true);
    if (key === "review") setReviewDone(true);

    // 2) 포인트 적립
    if (key === "walk") addPoint(20);
    if (key === "diary") addPoint(30);
    // if (key === "review") addPoint(??); // 리뷰 포인트 확정 시

    // 3) 쿼리 제거(중복 적립 방지) 후 서버 최신값으로 동기화
    router
      .navigate({ to: "/mypet/quest", replace: true })
      .then(load)
      .catch(() => load());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.completed]);

  const done = useMemo(
    () => Number(walkDone) + Number(diaryDone) + Number(reviewDone),
    [walkDone, diaryDone, reviewDone]
  );

  const goToDiaryWrite = () => router.navigate({ to: "/mypet/diary" });
  const goToWalk = () => router.navigate({ to: "/mypet/walk" });
  const goToReview = () => router.navigate({ to: "/place" }); // TODO: 리뷰 페이지 연결

  return (
    <DailyQuestTemplate
      onBack={() => router.navigate({ to: "/mypet" })}
      done={done}
      total={total}
      onWalk={goToWalk}
      onDiary={goToDiaryWrite}
      onReview={goToReview}
    />
  );
}