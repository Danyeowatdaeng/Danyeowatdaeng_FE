// src/api/reviews.ts
import axios from "axios";

/** 공통 응답 래퍼 */
export type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
  success: boolean;
};

/** 페이지 응답 */
export type Page<T> = {
  totalPages: number;
  totalElements: number;
  size: number;
  content: T[];
  number: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  pageable: {
    offset: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

/** 리뷰 엔티티 */
export type Review = {
  id: number;
  contentId: number;
  userId: number;
  rating: number;
  content: string;
  imagesJson: string; // JSON string
  createdAt: string;
  updatedAt: string;
};

const client = axios.create({
  baseURL: "https://danyeowatdaeng.p-e.kr",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/** 최신순 리뷰 목록 조회 */
export async function fetchReviewsByContentId(params: {
  contentId: number;
  page?: number;
  size?: number;
}) {
  const { contentId, page = 0, size = 10 } = params;
  const res = await client.get<ApiEnvelope<Page<Review>>>("/api/reviews", {
    params: { contentId, page, size },
  });
  // 필요하면 그대로 반환해도 되고, 자주 쓰는 data만 꺼내서 반환해도 OK
  return res.data.data; // Page<Review>
}

/** 리뷰 작성 */
export type CreateReviewPayload = {
  contentId: number;
  userId: number; // 인증 붙기 전 임시 필드
  rating: number; // 별점 UI 생기면 연결
  content: string;
  imagesJson?: string; // JSON.stringify([...Base64(DataURL)...])
};

export async function createReview(payload: CreateReviewPayload) {
  const res = await client.post<ApiEnvelope<Review>>("/api/reviews", payload);
  return res.data.data; // Review
}