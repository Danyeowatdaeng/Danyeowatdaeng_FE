import axios from "axios";

// API 기본 설정
const api = axios.create({
  baseURL: "https://danyeowatdaeng.p-e.kr/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 쿠키에서 토큰을 가져오는 함수
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "access_token") {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// 요청 인터셉터 - 모든 요청에 Authorization 헤더 추가
api.interceptors.request.use((config) => {
  console.log("API 요청:", {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers,
  });

  // 쿠키에서 토큰 가져와서 헤더에 추가
  const token = getTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 응답 인터셉터 - 401 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("인증 실패 - 로그인이 필요합니다.");

      // 사용자에게 확인
      const shouldLogin = window.confirm(
        "로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
      );

      if (shouldLogin) {
        window.location.href = "/login";
      } else {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export const post = async (
  url: string,
  data: unknown,
  headers?: Record<string, string>
) => {
  try {
    const res = await api.post(url, data, { headers });
    return res.data;
  } catch (error) {
    console.error("API 요청 오류:", error);
    throw error;
  }
};

export const get = async (url: string, params?: unknown) => {
  try {
    const res = await api.get(url, { params });
    return res.data;
  } catch (error) {
    console.error("API 요청 오류:", error);
    throw error;
  }
};

export const put = async (url: string, data: unknown) => {
  try {
    const res = await api.put(url, data);
    return res.data;
  } catch (error) {
    console.error("API 요청 오류:", error);
    throw error;
  }
};

export const del = async (url: string, params?: unknown) => {
  try {
    const res = await api.delete(url, { params });
    return res.data;
  } catch (error) {
    console.error("API 요청 오류:", error);
    throw error;
  }
};

// 회원 정보 조회
export interface MemberInfo {
  id: number;
  nickname: string | null;
  email: string;
  profileImageUrl: string | null;
  signUpCompleted: boolean;
  petAvatarId: number;
}

export interface MemberInfoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: MemberInfo;
  success: boolean;
}

export const getMemberInfo = async (): Promise<MemberInfoResponse> => {
  return await get("/members/me");
};

// 찜 목록 조회
export interface WishlistItem {
  id: number;
  placeId: number;
  placeName: string;
  category: string;
  address: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface WishlistResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: PageResponse<WishlistItem>;
  success: boolean;
}

export const getWishlist = async (params?: {
  page?: number;
  size?: number;
}): Promise<WishlistResponse> => {
  return await get("/wishlist", params);
};

// 찜하기 추가
export const addWishlist = async (data: {
  contentId: number;
  contentTypeId: number;
  title: string;
  address: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
}) => {
  return await post("/wishlist", data);
};

export const addWishlistAtMap = async (data: { source: string }) => {
  return await post("/wishlist/add", data);
};

// 찜하기 삭제
export const deleteWishlist = async (placeId: number) => {
  return await del(`/wishlist/${placeId}`);
};
