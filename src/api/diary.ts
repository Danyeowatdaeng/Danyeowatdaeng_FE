// src/types/diary.ts
export type DiaryListResponse = {
  isSuccess: boolean;
  data: {
    totalPages: number;
    totalElements: number;
    size: number;
    content: Array<{
      id: number;
      title: string;
      imageUrl: string;
      createdAt: string;
    }>;
    number: number; // 현재 페이지
    first: boolean;
    last: boolean;
  };
};

export type DiaryCreateResponse = {
  isSuccess: boolean;
  data: {
    id: number;
    title: string;
    content: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
  };
};

// 카드에서 쓰는 타입(이미 쓰던 구조)
export type DiaryItem = {
  id: number | string;
  imageSrc: string;
  caption: string;
  createdAt?: string;
};

// 목록 응답 -> 카드 아이템으로 매핑
export const mapListItem = (d: {
  id: number; title: string; imageUrl: string; createdAt: string;
}): DiaryItem => ({
  id: d.id,
  imageSrc: d.imageUrl,
  caption: d.title,        // 제목을 카드 캡션으로 사용
  createdAt: d.createdAt,
});