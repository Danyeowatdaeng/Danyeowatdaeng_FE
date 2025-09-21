import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfo {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  petAvatarId: number;
  setPetAvatarId: (id: number) => void;
  petImage: null | File;
  setPetImage: (image: null | File) => void;
}

const useUserInfoStore = create<UserInfo>()(
  persist(
    (set) => ({
      isLogin: false,
      setIsLogin: (value) => set({ isLogin: value }),
      petAvatarId: 1,
      setPetAvatarId: (id: number) => set({ petAvatarId: id }),
      petImage: null,
      setPetImage: (image: null | File) => set({ petImage: image }),
    }),
    {
      name: "user-info-storage",
      // petImage는 File 객체이므로 localStorage에 저장하지 않음
      partialize: (state) => ({
        isLogin: state.isLogin,
        petAvatarId: state.petAvatarId,
      }),
    }
  )
);

export default useUserInfoStore;
