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
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'access_token') {
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
      // 필요시 로그인 페이지로 리다이렉트
      // window.location.href = '/login';
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