// src/pages/MyPetPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";   // ✅ useRouter → useNavigate
import MyPetTemplate from "../components/templates/MyPetTemplate";
import type { DiaryItem, DiaryListResponse } from "../api/diary";
import { mapListItem } from "../api/diary";
import { getMemberInfo } from "../api";
import useUserInfoStore from "../store/userInfoStore";

export default function MyPetPage() {
  const navigate = useNavigate();                       // ✅ 선언
  const [diaries, setDiaries] = useState<DiaryItem[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { petAvatarCdnUrl, setPetAvatarCdnUrl } = useUserInfoStore();

  const goToDiaryWrite = () => navigate({ to: "/mypet/diary" });   // ✅ 교체
  const goToDailyQuest = () => navigate({ to: "/mypet/quest" });   // ✅ 교체

  const fetchDiaries = async (nextPage = 0) => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await axios.get<DiaryListResponse>(
        "https://danyeowatdaeng.p-e.kr/api/mypet/diaries",
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
          params: { page: nextPage, size },
        }
      );
      const content = res.data?.data?.content ?? [];
      const items = content.map(mapListItem);

      setDiaries((prev) => (nextPage === 0 ? items : [...prev, ...items]));
      setPage(res.data?.data?.number ?? nextPage);
      setHasMore(!(res.data?.data?.last ?? true));
    } catch (e) {
      console.error("다이어리 목록 조회 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await getMemberInfo();
        if (response.isSuccess && response.data) {
          // 전역 상태에 petAvatarCdnUrl 저장
          setPetAvatarCdnUrl(response.data.petAvatarCdnUrl);
        }
      } catch (error) {
        console.error("회원 정보 조회 실패:", error);
      }
    };

    fetchMemberInfo();
    fetchDiaries(0);
  }, []);

  return (
    <>
      <MyPetTemplate
        avatarSrc={
          petAvatarCdnUrl 
            ? `https://${petAvatarCdnUrl}` 
            : "/Assets/icons/PetProfile1.svg"
        }
        name="초코"
        subtitle="3살/푸들"
        onQuestClick={goToDailyQuest}
        diaries={diaries}
        onWriteDiary={goToDiaryWrite}
        onDiaryClick={(id) => {
          console.log("navigate to detail", id);
          const orderedIds = diaries.map((d) => Number(d.id));
          navigate({
            to: "/mypet/diary/$id",
            params: { id: String(id) },
            search: { orderedIds },                 // ✅ orderedIds는 search로 전달
          });
        }}
      />

      {hasMore && (
        <div className="p-4">
          <button
            type="button"
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