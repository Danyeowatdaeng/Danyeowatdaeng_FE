import { create } from "zustand";

interface UserInfo {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  petAvatarId: number;
  setPetAvatarId: (id: number) => void;
  petImage: null | File;
  setPetImage: (image: null | File) => void;
}

const useUserInfoStore = create<UserInfo>((set) => ({
  isLogin: false,
  setIsLogin: (value) => set({ isLogin: value }),
  petAvatarId: 1,
  setPetAvatarId: (id: number) => set({ petAvatarId: id }),
  petImage: null,
  setPetImage: (image: null | File) => set({ petImage: image }),
}));

export default useUserInfoStore;
