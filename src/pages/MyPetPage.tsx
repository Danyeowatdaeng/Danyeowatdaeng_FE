// src/pages/MyPetPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "@tanstack/react-router";
import MyPetTemplate from "../components/templates/MyPetTemplate";
import type { DiaryItem, DiaryListResponse } from "../api/diary";
import { mapListItem } from "../api/diary";

export default function MyPetPage() {
  const router = useRouter();
  const [diaries, setDiaries] = useState<DiaryItem[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(12);            // 그리드에 맞게 적당히
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const goToDiaryWrite = () => router.navigate({ to: "/mypet/diary" });
  const goToDailyQuest = () => router.navigate({ to: "/mypet/quest" });

  const fetchDiaries = async (nextPage = 0) => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await axios.get<DiaryListResponse>(
        "https://danyeowatdaeng.p-e.kr/api/mypet/diaries",
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
          params: { page: nextPage, size }, // 스웨거 기본 파라미터 관례
        }
      );

      const content = res.data?.data?.content ?? [];
      const items = content.map(mapListItem);

      setDiaries((prev) => nextPage === 0 ? items : [...prev, ...items]);
      setPage(res.data?.data?.number ?? nextPage);
      setHasMore(!(res.data?.data?.last ?? true));
    } catch (e) {
      console.error("다이어리 목록 조회 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiaries(0);
  }, []);

  return (
    <>
      <MyPetTemplate
        avatarSrc="/Assets/images/pet/avatar.jpg"
        name="초코"
        subtitle="3살/푸들"
        onQuestClick={goToDailyQuest}
        diaries={diaries}
        onWriteDiary={goToDiaryWrite}
        onDiaryClick={(id) => router.navigate({ to: `/mypet/diary/${id}` })}
      />
      {/* 더보기 버튼(무한스크롤 쓰면 대체 가능) */}
      {hasMore && (
        <div className="p-4">
          <button
            disabled={loading}
            onClick={() => fetchDiaries(page + 1)}
            className="w-full border rounded py-2"
          >
            {loading ? "불러오는 중..." : "더 보기"}
          </button>
        </div>
      )}
    </>
  );
}