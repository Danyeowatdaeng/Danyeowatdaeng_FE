// src/pages/MyPetDiaryWritePage.tsx
import { useState } from "react";
import axios from "axios";
import { useRouter } from "@tanstack/react-router";
import type { DiaryCreateResponse } from "../api/diary";

export default function MyPetDiaryWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await axios.post<DiaryCreateResponse>(
        "https://danyeowatdaeng.p-e.kr/api/mypet/diaries",
        { title, content, imageUrl },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data?.isSuccess) {
        // 성공 후 목록으로
        router.navigate({ to: "/mypet" });
      } else {
        alert("저장에 실패했습니다. 쿠키/크로스사이트 추적 설정도 확인해주세요.");
      }
    } catch (err) {
      console.error("다이어리 작성 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
      <input
        className="border p-2 rounded"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="border p-2 rounded"
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
      />
      <input
        className="border p-2 rounded"
        placeholder="이미지 URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-black text-white rounded px-4 py-2"
      >
        {submitting ? "작성 중..." : "작성하기"}
      </button>
    </form>
  );
}