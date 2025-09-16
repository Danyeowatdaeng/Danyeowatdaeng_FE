// src/api/diary.ts
import { get, post, put, del } from "./index";


// 필요 시 여기만 바꿔서 필드명 맞추세요.
const FIELD_CONTENT = "content";
const FIELD_IMAGES = "images";       // 서버가 files, photos 등일 수 있음

// ----- 타입(프론트에서 사용하는 최소 타입만) -----
export interface DiarySummary {
  id: number;
  imageUrl?: string | null;
  caption?: string | null;   // 서버에 없다면 프론트에서 content 일부를 잘라 사용
  createdAt?: string;
}

export interface DiaryDetail {
  id: number;
  content: string;
  images: { id?: number; url: string }[];
  createdAt: string;
}

// ----- API 함수 -----

// 목록 조회 (페이징 파라미터는 서버 스펙에 맞게 선택)
export async function fetchDiaries(params?: { page?: number; size?: number; petId?: number }) {
  // 예: /api/mypet/diaries?page=0&size=20&petId=123
  const data = await get("/mypet/diaries", params);
  return data as { content?: DiarySummary[]; list?: DiarySummary[] } | DiarySummary[];
}

// 상세
export async function fetchDiary(diaryId: number) {
  const data = await get(`/mypet/diaries/${diaryId}`);
  return data as DiaryDetail;
}

// 작성 (텍스트 + 이미지[])
export async function createDiary(payload: { content: string; images?: File[] }) {
  const form = new FormData();
  form.append(FIELD_CONTENT, payload.content);
  (payload.images ?? []).forEach((file) => {
    // 서버가 배열 필드명을 images[] 로 요구하면 아래 키만 바꾸면 됩니다.
    // form.append("images[]", file);
    form.append(FIELD_IMAGES, file);
  });

  // axios가 자동으로 multipart 헤더 셋업
  const res = await post("/mypet/diaries", form);
  return res as { id: number };
}

// 수정 (텍스트 교체 + 이미지 추가/삭제 등 서버 스펙에 맞춰 확장)
// 여기선 단순 교체 예시
export async function updateDiary(diaryId: number, payload: { content?: string; addImages?: File[] }) {
  const form = new FormData();
  if (payload.content != null) form.append(FIELD_CONTENT, payload.content);
  (payload.addImages ?? []).forEach((f) => form.append(FIELD_IMAGES, f));

  return await put(`/mypet/diaries/${diaryId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// 삭제
export async function deleteDiary(diaryId: number) {
  return await del(`/mypet/diaries/${diaryId}`);
}