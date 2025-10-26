import { create } from "zustand";

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
}

const useUserInfoStore = create<UserInfo>((set) => ({
  isLogin: false,
  setIsLogin: (value) => set({ isLogin: value }),
  petAvatarId: 1,
  setPetAvatarId: (id: number) => set({ petAvatarId: id }),
  petImage: null,
  setPetImage: (image: null | File) => set({ petImage: image }),
  generatedCharacterImage: null,
  setGeneratedCharacterImage: (image: null | string) => set({ generatedCharacterImage: image }),
  petAvatarCdnUrl: null,
  setPetAvatarCdnUrl: (url: null | string) => set({ petAvatarCdnUrl: url }),
}));

export default useUserInfoStore;
