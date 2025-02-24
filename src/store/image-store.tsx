import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
  profileImage: string;
  name: string;
  email: string;
  setProfileImage: (image: string) => void;
  setName: (name: string) => void;
  setEmail: (name: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profileImage: '',
      name: '',
      email: '',
      setProfileImage: (image) => set({ profileImage: image }),
      setName: (name) => set({ name }),
      setEmail: (email) => set({ email })
    }),
    {
      name: 'profile-storage' // Guarda los datos en localStorage
    }
  )
);
