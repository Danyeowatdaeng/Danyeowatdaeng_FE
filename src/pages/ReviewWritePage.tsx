// src/pages/ReviewWritePage.tsx
import { useParams, useSearch, useRouter } from "@tanstack/react-router";
import { useRef, useState } from "react";
import ReviewWriteTemplate from "../components/templates/ReviewWriteTemplate";
import { createReview } from "../api/review";

// 파일 → Data URL(Base64) 유틸
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string) || "");
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function ReviewWritePage() {
  const router = useRouter();

  // /place/$placeId/review 라우트의 param & search
  const { placeId } = useParams({ strict: false }) as { placeId?: string };
  const { name } = useSearch({ from: "/place/$placeId/review" }) as {
    name?: string;
  };

  // 폼 상태
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // 실제 업로드에 사용할 파일들을 인덱스별로 보관
  const filesRef = useRef<(File | undefined)[]>([]);

  // 숨김 파일 input 컨트롤
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingIndexRef = useRef<number>(-1);

  const onPickImageAt = (idx: number) => {
    pendingIndexRef.current = idx;
    fileInputRef.current?.click();
  };

  const onFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const blobUrl = URL.createObjectURL(f);

    setImages((prev) => {
      const next = [...prev];
      const i = pendingIndexRef.current;

      if (i >= 0 && i < next.length) {
        // 기존 교체
        if (next[i]?.startsWith("blob:")) URL.revokeObjectURL(next[i]);
        next[i] = blobUrl;
        filesRef.current[i] = f;
      } else {
        // 새로 추가
        next.push(blobUrl);
        filesRef.current.push(f);
      }
      return next;
    });

    // 같은 파일 재선택 허용
    e.currentTarget.value = "";
  };

  const onRemoveImageAt = (idx: number) => {
    setImages((prev) => {
      const tgt = prev[idx];
      if (tgt?.startsWith("blob:")) URL.revokeObjectURL(tgt);
      const next = prev.filter((_, i) => i !== idx);
      // 파일 배열도 같은 인덱스 제거
      filesRef.current.splice(idx, 1);
      return next;
    });
  };

  const onSubmit = async () => {
    if (!text.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    const contentId = Number(placeId);
    if (!Number.isFinite(contentId)) {
      alert("장소 정보가 올바르지 않아요. 다시 시도해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      // 이미지들 Base64(Data URL)로 변환 → JSON으로 보냄
      const files = filesRef.current.filter(Boolean) as File[];
      const dataUrls = await Promise.all(files.map(fileToDataUrl));
      const imagesJson = dataUrls.length ? JSON.stringify(dataUrls) : undefined;

      // TODO: 로그인 붙기 전까지 임시 userId 사용 (스웨거 설명대로)
      await createReview({
        contentId,
        userId: 0,
        rating: 5, // 별점 UI 붙이면 교체
        content: text,
        imagesJson,
      });

      // 성공 → 퀘스트로 복귀 + review 완료 플래그
      router.navigate({
        to: "/mypet/quest",
        search: { completed: "review" },
      });
    } catch (e) {
      console.error("리뷰 작성 실패:", e);
      alert("리뷰 저장에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ReviewWriteTemplate
        placeName={name ?? "리뷰 작성"}
        onBack={() => router.history.back()}
        text={text}
        onTextChange={setText}
        images={images}
        onPickImageAt={onPickImageAt}
        onRemoveImageAt={onRemoveImageAt}
        onSubmit={submitting ? undefined : onSubmit} // 중복 제출 방지
      />

      {/* 숨김 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />
    </>
  );
}