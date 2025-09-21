// src/pages/MyPetDiaryWritePage.tsx
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "@tanstack/react-router";
import DiaryWriteTemplate from "../components/templates/DiaryWriteTemplate";
import type { DiaryCreateResponse } from "../api/diary";

export default function MyPetDiaryWritePage() {
  const router = useRouter();

  // 템플릿 인터페이스에 맞춘 상태
  const [text, setText] = useState("");          // 본문 (textarea)
  const [images, setImages] = useState<string[]>([]); // 미리보기 URL 리스트 (string)

  // 숨김 파일 입력 1개를 모든 타일이 공유
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingIndexRef = useRef<number>(-1);

  const handlePickImageAt = (idx: number) => {
    pendingIndexRef.current = idx;
    fileInputRef.current?.click();
  };

  const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 로컬 미리보기용 blob URL
    const url = URL.createObjectURL(file);

    setImages((prev) => {
      const next = [...prev];
      if (pendingIndexRef.current >= 0 && pendingIndexRef.current < prev.length) {
        // 교체
        // 기존 blob URL 있으면 메모리 해제
        URL.revokeObjectURL(prev[pendingIndexRef.current]);
        next[pendingIndexRef.current] = url;
      } else {
        // 추가
        next.push(url);
      }
      return next;
    });

    // 같은 파일 재선택 가능하도록 초기화
    e.currentTarget.value = "";
  };

  const handleRemoveImageAt = (idx: number) => {
    setImages((prev) => {
      // 메모리 누수 방지
      const target = prev[idx];
      if (target?.startsWith("blob:")) URL.revokeObjectURL(target);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    // 제목은 본문 첫 줄에서 파생 (템플릿에 제목 입력이 없기 때문)
    const derivedTitle = text.split("\n")[0].trim().slice(0, 60) || "무제";

    // imageUrl은 서버가 '공개 URL'을 기대하므로,
    // 이미지 배열의 첫 항목이 http(s)로 시작할 때만 사용.
    // blob: URL은 서버에서 접근 불가이므로 제외.
    const first = images[0];
    const imageUrl = first && /^https?:\/\//i.test(first) ? first : "";

    try {
      setSubmitting(true);

      const res = await axios.post<DiaryCreateResponse>(
        "https://danyeowatdaeng.p-e.kr/api/mypet/diaries",
        {
          title: derivedTitle,
          content: text,
          imageUrl: imageUrl || undefined, // 빈 문자열이면 아예 보내지 않음
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data?.isSuccess) {
        router.navigate({ to: "/mypet" });
      } else {
        alert("저장에 실패했습니다. 쿠키/크로스사이트 추적 설정을 확인해주세요.");
      }
    } catch (err) {
      console.error("다이어리 작성 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <DiaryWriteTemplate
        onBack={() => router.history.back()}
        text={text}
        onTextChange={setText}
        images={images}
        onPickImageAt={handlePickImageAt}
        onRemoveImageAt={handleRemoveImageAt}
        onSubmit={submitting ? undefined : handleSubmit} // 중복 제출 방지
      />

      {/* 숨김 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChangeFile}
      />
    </>
  );
}