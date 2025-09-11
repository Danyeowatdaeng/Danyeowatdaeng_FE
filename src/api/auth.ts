import Cookies from "js-cookie";

// 토큰 관련 타입
export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
}

// 쿠키에서 토큰 가져오기
export const getTokenFromCookie = (): TokenInfo | null => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  if (!accessToken || !refreshToken) return null;

  return {
    accessToken,
    refreshToken,
  };
};

// 쿠키에 토큰 저장
export const saveTokenToCookie = (tokenInfo: TokenInfo) => {
  // secure, httpOnly 옵션은 서버에서 설정해야 합니다.
  Cookies.set("access_token", tokenInfo.accessToken);
  Cookies.set("refresh_token", tokenInfo.refreshToken);
};

// 쿠키에서 토큰 제거
export const removeTokenFromCookie = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
};
