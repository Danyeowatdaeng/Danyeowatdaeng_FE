import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { getTokenFromCookie } from "./auth";

// API 기본 설정
const BASE_URL = "https://danyeowatdaeng.p-e.kr/api"; // 실제 API 서버 주소로 변경

// axios 인스턴스 생성
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 쿠키 전송을 위해 필요
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
  (config) => {
    const { accessToken } = getTokenFromCookie() || {};
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러(인증 실패)이고 토큰 갱신이 필요한 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await api.post("/auth/refresh", { refreshToken });
        const { accessToken } = response.data;

        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그인 페이지로 이동
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// GET 요청
export const get = <T>(url: string, config?: AxiosRequestConfig) => {
  return api.get<T>(url, config).then((response) => response.data);
};

// POST 요청
export const post = <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) => {
  return api.post<T>(url, data, config).then((response) => response.data);
};

// PUT 요청
export const put = <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) => {
  return api.put<T>(url, data, config).then((response) => response.data);
};

// DELETE 요청
export const del = <T>(url: string, config?: AxiosRequestConfig) => {
  return api.delete<T>(url, config).then((response) => response.data);
};
