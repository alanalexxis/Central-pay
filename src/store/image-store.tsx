import { create } from 'zustand';

interface ProfileImageState {
  profileImage: string;
  setProfileImage: (image: string) => void;
}

export const useProfileImageStore = create<ProfileImageState>((set) => ({
  profileImage: '',
  setProfileImage: (image) => set({ profileImage: image })
}));
