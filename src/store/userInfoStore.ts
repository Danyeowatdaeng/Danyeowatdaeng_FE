import { create } from "zustand";
import { getMemberInfo, type MemberInfo } from "../api";

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
  fetchUserInfo: () => Promise<void>;
}

const useUserInfoStore = create<UserInfo>((set, get) => ({
  isLogin: false,
  setIsLogin: (value) => {
    set({ isLogin: value });
    // 로그인 상태가 true로 변경되면 사용자 정보를 자동으로 가져옴
    if (value) {
      get().fetchUserInfo();
    } else {
      // 로그아웃 시 사용자 정보 초기화
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
  fetchUserInfo: async () => {
    const { isLogin } = get();
    if (!isLogin) return;
    
    try {
      set({ isLoadingUserInfo: true });
      const response = await getMemberInfo();
      if (response.isSuccess && response.data) {
        set({ 
          memberInfo: response.data
        });
      }
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
    } finally {
      set({ isLoadingUserInfo: false });
    }
  },
}));

export default useUserInfoStore;
