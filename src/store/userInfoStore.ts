import { create } from "zustand";
import type { MemberInfo } from "../api";

interface UserInfo {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  petAvatarId: number;
  setPetAvatarId: (id: number) => void;
  petImage: null | File;
  setPetImage: (image: null | File) => void;
  generatedCharacterImage: null | string; // 변환된 캐릭터 이미지 URL
  setGeneratedCharacterImage: (image: null | string) => void;
  petAvatarCdnUrl: null | string;
  setPetAvatarCdnUrl: (url: null | string) => void;
  // 사용자 정보 관련 추가
  memberInfo: MemberInfo | null;
  setMemberInfo: (info: MemberInfo | null) => void;
  isLoadingUserInfo: boolean;
  setIsLoadingUserInfo: (loading: boolean) => void;
}

const useUserInfoStore = create<UserInfo>((set) => ({
  isLogin: false,
  setIsLogin: (value) => {
    set({ isLogin: value });
    // 로그아웃 시 사용자 정보 초기화
    if (!value) {
      set({ 
        memberInfo: null, 
        petAvatarCdnUrl: null,
        isLoadingUserInfo: false 
      });
    }
  },
  petAvatarId: 1,
  setPetAvatarId: (id: number) => set({ petAvatarId: id }),
  petImage: null,
  setPetImage: (image: null | File) => set({ petImage: image }),
  generatedCharacterImage: null,
  setGeneratedCharacterImage: (image: null | string) => set({ generatedCharacterImage: image }),
  petAvatarCdnUrl: null,
  setPetAvatarCdnUrl: (url: null | string) => set({ petAvatarCdnUrl: url }),
  // 사용자 정보 관련 상태
  memberInfo: null,
  setMemberInfo: (info) => set({ memberInfo: info }),
  isLoadingUserInfo: false,
  setIsLoadingUserInfo: (loading) => set({ isLoadingUserInfo: loading }),
}));

export default useUserInfoStore;
