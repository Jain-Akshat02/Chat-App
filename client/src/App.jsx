import './App.css'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage' 
import SignUpPage from './pages/SignUpPage'
import Login from './pages/Login.jsx'
import Settings from './pages/Settings'
import Profile from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore.js'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {Loader} from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemesStore } from './store/useThemesStore.js'
const App=()=> {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
  const {theme} = useThemesStore();
 
 
  useEffect(()=>{
    checkAuth()
  },[checkAuth]);

  if(isCheckingAuth && !authUser) return (
     <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
     </div>
  )

  return (
    <>
      <div data-theme= {theme}>
        <Navbar/>
        
        <div className="pt-16">
          <Routes>
            <Route path="/" element={authUser? <HomePage/>: <Navigate to="/login"/>} />
            <Route path="/signup" element={!authUser?<SignUpPage/>: <Navigate to="/"/>} />
            <Route path="/login" element={!authUser?<Login/>: <Navigate to="/"/>} />
            <Route path="/settings" element={<Settings/>} />
            <Route path="/profile" element={authUser?<Profile/>: <Navigate to="/login"/>} />
          </Routes>
        </div>
        <Toaster/>
      </div>
    </>
  )
}

export default App
