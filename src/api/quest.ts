// src/api/quest.ts
import axios from "axios";

/** 스웨거 예시 기반 타입 */
export type QuestType = "WALK_DAILY" | "DIARY_DAILY" | "REVIEW_DAILY";

export type TodayQuestsResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: {
    totalQuests: number;
    completedQuests: number;
    overallProgressPercentage: number; // 0~100
    questProgresses: Array<{
      questType: QuestType;
      title: string;
      description: string;
      currentCount: number;
      targetCount: number;
      progressPercentage: number; // 0~100
      isCompleted: boolean;
      rewardPoints: number;
      isRewardClaimed: boolean;
    }>;
  };
  success: boolean;
};

/** 오늘의 퀘스트 진행률 조회 */
export async function fetchTodayQuests() {
  const res = await axios.get<TodayQuestsResponse>(
    "https://danyeowatdaeng.p-e.kr/api/quests/today",
    { withCredentials: true }
  );

  const d = res.data?.data;

  // ⚠️ 방어코드
  const list = d?.questProgresses ?? [];
  const byType = Object.fromEntries(
    list.map((q) => [q.questType, q])
  ) as Partial<Record<QuestType, TodayQuestsResponse["data"]["questProgresses"][number]>>;

  return {
    raw: res.data,
    total: d?.totalQuests ?? (list.length || 3),                  // 서버 total 없으면 3개로
    completed: d?.completedQuests ?? list.filter((q) => q.isCompleted).length,
    percent: d?.overallProgressPercentage ?? 0,
    byType,                                                     // WALK_DAILY / DIARY_DAILY / REVIEW_DAILY 접근
  };
}