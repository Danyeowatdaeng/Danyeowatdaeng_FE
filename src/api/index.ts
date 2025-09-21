import axios from "axios";

// API 기본 설정
const api = axios.create({
  baseURL: "https://danyeowatdaeng.p-e.kr/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 로깅
api.interceptors.request.use((config) => {
  console.log("API 요청:", {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers,
  });
  return config;
});

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

// put 함수 시그니처를 post와 동일하게 url, data만 받도록 수정
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
