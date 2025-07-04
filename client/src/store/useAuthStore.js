import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === 'production'
  ? "https://chat-app-kz3d.onrender.com/"
  : 'http://localhost:5000';
export const useAuthStore = create((set,get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
      get().connectSocket(); 
    } catch (error) {
      console.error("Error signing up:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Signup failed";
      toast.error(errorMessage);
    } finally {                                          
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logged out successfully!");
        get().disconnectSocket(); // Disconnect from socket on logout
    } catch (error) {
        toast.error("Error logging out. Please try again.");
        console.error("Error logging out:", error);
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully!");

      get().connectSocket(); // Connect to socket after 
    } catch (error) {
      set({ authUser: null });
      console.error("Error logging in:", error);
      toast.error(
        error.response?.data?.message || error.message || "Login failed"
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },


  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      console.log("------data-----",data);
      const res = await axiosInstance.put("/auth/update-profile",data);
      set({ authUser: res.data});
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("Error updating profile:", error);
      toast.error(
        error.response?.data?.message || error.message || "Profile update failed"
      );
    } finally{
      set({ isUpdatingProfile: false });  
      toast.success("Reload once")    
    }
  },
  connectSocket: () => {
    const {authUser} = get();
    if (!authUser|| get().socket?.connected) { 
      return;
    }
    const socket = io(BASE_URL, 
      {query: {userId: authUser._id} }
    );
    socket.connect();
    set({socket: socket});

    socket.on('getOnlineUsers',(userIds) => {
      set({ onlineUsers: userIds });
    })
  },
  disconnectSocket: () => {
    if(get().socket.connected) get().socket.disconnect();
  }
}));
