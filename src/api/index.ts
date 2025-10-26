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
  petAvatarCdnUrl: string | null;
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
  title: string;
  placeId: number;
  placeName: string;
  category: string;
  address: string;
  imageUrl?: string;
  createdAt: string;
  contentId: number;
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

export const addWishlistAtMap = async (data: {
  name: string;
  category3: string;
  roadAddress: string;
  jibunAddress: string;
  homepage: string;
  closedDays: string;
  openingHours: string;
  latitude: number;
  longitude: number;
  phone: string;
  source: string;
  contentTypeId: number;
}) => {
  return await post("/wishlist/search", data);
};

// 찜하기 삭제
export const deleteWishlist = async (contentId: number) => {
  return await del(`/wishlist/${contentId}`);
};

// 찜하기 그룹 관련 인터페이스
export interface WishlistInGroup {
  id: number;
  contentId: number;
  contentTypeId: number;
  title: string;
  address: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface WishlistGroup {
  id: number;
  name: string;
  isPublic: boolean;
  categoryImageUrl: string;
  wishlists?: WishlistInGroup[];
  createdAt: string;
  updatedAt: string;
}

// 그룹 목록 조회
export interface GetWishlistGroupsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: WishlistGroup[];
  success: boolean;
}

export const getWishlistGroups = async (params?: {
  isPublic?: boolean;
}): Promise<GetWishlistGroupsResponse> => {
  return await get("/wishlist-groups", params);
};

// 그룹 생성
export interface CreateWishlistGroupRequest {
  name: string;
  isPublic: boolean;
  categoryImageUrl: string;
}

export interface CreateWishlistGroupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: WishlistGroup;
  success: boolean;
}

export const createWishlistGroup = async (
  data: CreateWishlistGroupRequest
): Promise<CreateWishlistGroupResponse> => {
  return await post("/wishlist-groups", data);
};

// 그룹 수정
export interface UpdateWishlistGroupRequest {
  name: string;
  isPublic: boolean;
  categoryImageUrl: string;
}

export interface UpdateWishlistGroupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: WishlistGroup;
  success: boolean;
}

export const updateWishlistGroup = async (
  groupId: number,
  data: UpdateWishlistGroupRequest
): Promise<UpdateWishlistGroupResponse> => {
  return await put(`/wishlist-groups/${groupId}`, data);
};

// 그룹 삭제
export interface DeleteWishlistGroupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: Record<string, unknown>;
  success: boolean;
}

export const deleteWishlistGroup = async (
  groupId: number
): Promise<DeleteWishlistGroupResponse> => {
  return await del(`/wishlist-groups/${groupId}`);
};

// 그룹에 찜하기 추가
export interface AddWishlistToGroupRequest {
  wishlistIds: number[];
}

export interface AddWishlistToGroupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: Record<string, unknown>;
  success: boolean;
}

export const addWishlistToGroup = async (
  groupId: number,
  wishlistIds: number[]
): Promise<AddWishlistToGroupResponse> => {
  return await post(`/wishlist-groups/${groupId}/items`, { wishlistIds });
};
