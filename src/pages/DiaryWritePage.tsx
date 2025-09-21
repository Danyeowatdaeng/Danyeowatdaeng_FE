import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "@tanstack/react-router";
import DiaryWriteTemplate from "../components/templates/DiaryWriteTemplate";
import type { DiaryCreateResponse } from "../api/diary";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || "");
    reader.onerror = reject;
    reader.readAsDataURL(file); // data:[mime];base64,XXXX...
  });
}

export default function MyPetDiaryWritePage() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]); // 미리보기용 URL
  const [firstFile, setFirstFile] = useState<File | undefined>(undefined); // 서버 전송용 원본 파일(대표 1장)

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
      if (pendingIndexRef.current >= 0 && pendingIndexRef.current < prev.length) {
        URL.revokeObjectURL(prev[pendingIndexRef.current]);
        next[pendingIndexRef.current] = url;
      } else {
        next.push(url);
      }
      return next;
    });

    // 대표 이미지는 첫 번째 것만 서버로 전송한다고 가정
    if (!firstFile || pendingIndexRef.current === 0) {
      setFirstFile(file);
    }

    e.currentTarget.value = "";
  };

  const handleRemoveImageAt = (idx: number) => {
    setImages((prev) => {
      const target = prev[idx];
      if (target?.startsWith("blob:")) URL.revokeObjectURL(target);
      const next = prev.filter((_, i) => i !== idx);
      // 대표(0번)를 지웠다면 firstFile도 비움
      if (idx === 0) setFirstFile(undefined);
      return next;
    });
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const derivedTitle = text.split("\n")[0].trim().slice(0, 60) || "무제";

    // ✅ Base64(Data URL) 변환
    let imageUrl: string | undefined = undefined;
    if (firstFile) {
      try {
        const dataUrl = await fileToDataUrl(firstFile);
        // 서버가 '순수 Base64'만 원한다면 아래 주석 해제:
        // imageUrl = dataUrl.split(",")[1];
        imageUrl = dataUrl; // Data URL 전체를 받는다면 이대로
      } catch {
        console.warn("이미지 인코딩 실패 — 이미지 없이 전송합니다.");
      }
    }

    try {
      setSubmitting(true);
      const res = await axios.post<DiaryCreateResponse>(
        "https://danyeowatdaeng.p-e.kr/api/mypet/diaries",
        {
          title: derivedTitle,
          content: text,
          imageUrl, // Base64 or Data URL
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
        onSubmit={submitting ? undefined : handleSubmit}
      />

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