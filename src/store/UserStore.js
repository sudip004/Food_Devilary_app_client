import { create } from 'zustand'
import axios from 'axios';

const UserStore = create((set) => ({
  user: null,
   userStoreTotal: 0,

  setuser: (userData) => set({ user: userData }),
   setUserStoreTotal: (total) =>
    set({ userStoreTotal: total }),

  logout: async () => {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/logout`,
      {},
      { withCredentials: true }
    );
    set({ user: null });
  },

  fetchUser: async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/me`,
        { withCredentials: true }
      );
      set({ user: response.data });
    } catch {
      set({ user: null });
    }
  }
}));

export default UserStore;







