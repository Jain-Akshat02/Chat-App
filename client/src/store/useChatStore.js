import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";
export const useChatStore = create((set,get) => ({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
         const res = await axiosInstance.get("/message/users");
         set({users: res.data.users});  
        } catch (error) {
            console.error("Failed to load users", error);
            toast.error("Failed to load users");
        } finally {
            set({ isUsersLoading: false });
        } 
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data.messages});
        } catch (error) {
            toast.error("Failed to load messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    subscribeToMessages: ()=> {
        const { selectedUser} = get();
        if (!selectedUser) return;
        const socket  = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage]
            });
        })
    },
    unsubscribeFromMessages: ()=> {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    sendMessage: async (messageData)=>{
        const {selectedUser, messages} = get();

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data]});
        } catch (error) {
            console.log("Error sending message:", error);
            toast.error("Failed to send message");
        }
    },
    setSelectedUser: (selectedUser) => {
        set({selectedUser})
    }

    
}));