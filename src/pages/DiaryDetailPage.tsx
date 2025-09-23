// src/pages/MyPetDiaryDetailPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import DiaryDetailTemplate from "../components/templates/DiaryDetailTemplate";
import ConfirmModal from "../components/molecules/ConfirmModal"; // ✅ 추가: 모달

type DiaryDetail = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export default function DiaryDetailPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { id?: string };
  const id = Number(params.id);

  // ✅ 목록에서 전달된 인접 id들(쿼리)
  const { orderedIds = [] } = useSearch({ from: "/mypet/diary/$id" });

  const [detail, setDetail] = useState<DiaryDetail | null>(null);
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 삭제 모달/상태
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 현재/이전/다음 계산
  const currentIndex = useMemo(
    () => orderedIds.findIndex((x) => x === id),
    [orderedIds, id]
  );
  const prevId = currentIndex > 0 ? orderedIds[currentIndex - 1] : undefined;
  const nextId =
    currentIndex >= 0 && currentIndex < orderedIds.length - 1
      ? orderedIds[currentIndex + 1]
      : undefined;

  // 파일 입력(미리보기 전용)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingIndexRef = useRef<number>(-1);

  const handlePickImageAt = (idx: number) => {
    pendingIndexRef.current = idx;
    fileInputRef.current?.click();
  };

  const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImages((prev) => {
      const next = [...prev];
      if (pendingIndexRef.current >= 0 && pendingIndexRef.current < next.length) {
        if (next[pendingIndexRef.current]?.startsWith("blob:")) {
          URL.revokeObjectURL(next[pendingIndexRef.current]);
        }
        next[pendingIndexRef.current] = url;
      } else {
        next.push(url);
      }
      return next;
    });

    e.currentTarget.value = "";
  };

  const handleRemoveImageAt = (idx: number) => {
    setImages((prev) => {
      const tgt = prev[idx];
      if (tgt?.startsWith("blob:")) URL.revokeObjectURL(tgt);
      return prev.filter((_, i) => i !== idx);
    });
  };

  // 상세 조회
  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get<{ isSuccess: boolean; data: DiaryDetail }>(
        `https://danyeowatdaeng.p-e.kr/api/mypet/diaries/${id}`,
        { withCredentials: true }
      );
      const d = res.data.data;
      setDetail(d);
      setText(d.content ?? "");
      setImages(d.imageUrl ? [d.imageUrl] : []);
    } catch (e) {
      console.error("상세 조회 실패:", e);
      alert("상세를 불러오지 못했습니다.");
      navigate({ to: "/mypet" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Number.isFinite(id)) fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 편집 토글
  const handleToggleEdit = () => setIsEditing((v) => !v);

  // 저장(수정)
  const handleSubmit = async () => {
    if (!detail) return;
    if (!isEditing) {
      navigate({ to: "/mypet" });
      return;
    }

    try {
      const derivedTitle = (text.split("\n")[0] || detail.title || "무제").slice(0, 60);
      const first = images[0];
      const imageUrl = first && /^https?:\/\//i.test(first) ? first : detail.imageUrl;

      await axios.put(
        `https://danyeowatdaeng.p-e.kr/api/mypet/diaries/${detail.id}`,
        { title: derivedTitle, content: text, imageUrl },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      await fetchDetail();
      setIsEditing(false);
    } catch (e) {
      console.error("수정 실패:", e);
      alert("수정에 실패했습니다.");
    }
  };

  // 삭제 — 버튼 클릭 시: 모달만 오픈
  const handleDeleteClick = () => setConfirmOpen(true);

  // 삭제 — 모달에서 실제 실행
  const handleConfirmDelete = async () => {
    if (!detail || deleting) return;
    try {
      setDeleting(true);
      await axios.delete(
        `https://danyeowatdaeng.p-e.kr/api/mypet/diaries/${detail.id}`,
        { withCredentials: true }
      );
      setConfirmOpen(false);
      navigate({ to: "/mypet" });
    } catch (e) {
      console.error("삭제 실패:", e);
      alert("삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  // 이전/다음 이동 — 같은 orderedIds 유지
  const handlePrev = () => {
    if (prevId) navigate({ to: `/mypet/diary/${prevId}`, search: { orderedIds } });
  };
  const handleNext = () => {
    if (nextId) navigate({ to: `/mypet/diary/${nextId}`, search: { orderedIds } });
  };

  if (loading || !detail) return null;

  return (
    <>
      <DiaryDetailTemplate
        onBack={() => navigate({ to: "/mypet" })}
        text={text}
        onTextChange={setText}
        images={images}
        onPickImageAt={handlePickImageAt}
        onRemoveImageAt={handleRemoveImageAt}
        avatarSrc="/Assets/icons/PetProfile1.svg"
        isEditing={isEditing}
        onToggleEdit={handleToggleEdit}
        onDelete={handleDeleteClick}    // ✅ 여기서 모달 오픈
        onSubmit={handleSubmit}
        onPrev={handlePrev}
        onNext={handleNext}
        canPrev={!!prevId}
        canNext={!!nextId}
      />

      {/* 숨김 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChangeFile}
      />

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        open={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="정말 삭제하시겠습니까?"
        iconSrc=""                      // 디자인처럼 아이콘 없이
        confirmLabel={deleting ? "삭제 중..." : "삭제"}
        confirmBgColor="#00A3A5"
        confirmTextColor="#FFFFFF"
        size="md"
        showClose
      />
    </>
  );
}