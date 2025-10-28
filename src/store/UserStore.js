import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios';

const UserStore = create(
    persist(
        (set) => ({
            user: null,
            userStoreTotal: 0,
            

            setuser: (userData) => set({ user: userData }),
            setStoreCart: (cartData) => set({ storeCart: cartData }),
            setUserStoreTotal: (total) => set({ userStoreTotal: total }),

            logout: async() =>{
                await axios.post('http://localhost:8080/api/logout', {}, { withCredentials: true });
                set({ user: null });
            },

            fetchUser: async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/me', { withCredentials: true });
                    set({ user: response.data });
                } catch (error) {
                    set({ user: null });
                }
            }
        }),
        {
            name:'user-storage'
        }
    )
)

export default UserStore;






