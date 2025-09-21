import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import axios from "axios";
import MyPetTemplate from "../components/templates/MyPetTemplate";
import type { DiaryItem } from "../components/molecules/DiaryCard";

export default function MyPetPage() {
  const router = useRouter();
  const [diaries, setDiaries] = useState<DiaryItem[]>([]);

  const goToDiaryWrite = () => router.navigate({ to: "/mypet/diary" });
  const goToDailyQuest = () => router.navigate({ to: "/mypet/quest" });

  // ✅ 상세 이동 (id 전달)
  const goToDiaryDetail = (id: string | number) => {
    // 방법 1) 문자열 경로로 바로 이동
    router.navigate({ to: `/mypet/diary/${id}` });

    // 만약 파일 라우팅에 "/mypet/diary/$id" 로 route id를 쓰는 프로젝트라면:
    // router.navigate({ to: "/mypet/diary/$id", params: { id: String(id) } });
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(
          "https://danyeowatdaeng.p-e.kr/api/mypet/diaries",
          {
            params: { page: 0, size: 20 },
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        const raw = res.data?.data ?? res.data;
        const list = Array.isArray(raw) ? raw : (raw?.content ?? raw?.list ?? []);

        const mapped: DiaryItem[] = (list ?? []).map((d: any) => ({
          id: d.id,
          imageSrc:
            d.images?.[0]?.url ??
            d.imageUrl ??
            "/Assets/images/pet/placeholder.jpg",
          caption: d.content ?? d.caption ?? "",
        }));

        if (mounted) setDiaries(mapped);
      } catch (e: any) {
        if (e?.response?.status === 401) {
          router.navigate({ to: "/login" });
          return;
        }
        console.error("다이어리 목록 조회 실패:", e?.response ?? e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <MyPetTemplate
      avatarSrc="/Assets/images/pet/avatar.jpg"
      name="초코"
      subtitle="3살/푸들"
      onQuestClick={goToDailyQuest}
      diaries={diaries}
      onWriteDiary={goToDiaryWrite}
      onDiaryClick={goToDiaryDetail}   // ✅ 여기만 바꿔주면 카드 클릭 → 상세 이동
    />
  );
}