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

export const post = async (url: string, data: unknown) => {
  try {
    const res = await api.post(url, data);
    return res.data;
  } catch (error) {
    console.error("API 요청 오류:", error);
    throw error;
  }
};
