// src/pages/MyPetPage.tsx
import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import axios from "axios";
import MyPetTemplate from "../components/templates/MyPetTemplate";
import type { DiaryItem } from "../components/molecules/DiaryCard";

export default function MyPetPage() {
  const router = useRouter();
  const [diaries, setDiaries] = useState<DiaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const goToDiaryWrite = () => router.navigate({ to: "/mypet/diary" });
  const goToDailyQuest = () => router.navigate({ to: "/mypet/quest" });

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
          imageSrc: d.images?.[0]?.url ?? d.imageUrl ?? "/Assets/images/pet/placeholder.jpg",
          caption: d.content ?? d.caption ?? "",
        }));

        if (mounted) setDiaries(mapped);
      } catch (e: any) {
        if (e?.response?.status === 401) {
          router.navigate({ to: "/login" });
          return;
        }
        console.error("다이어리 목록 조회 실패:", e?.response ?? e);
      } finally {
        if (mounted) setLoading(false);
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
      onDiaryClick={(id) => console.log("다이어리 클릭:", id)}
    />
  );
}