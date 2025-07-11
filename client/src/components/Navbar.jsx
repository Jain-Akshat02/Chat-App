import { useAuthStore } from '../store/useAuthStore.js'
import {Link} from 'react-router-dom';
import {LogOut, Settings,MessageSquare,User, Menu} from 'lucide-react'
import { useState } from 'react';

const Navbar = ({ onSidebarToggle }) => {
  const {logout, authUser} = useAuthStore();
  return (
    <header className='bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 h-16 flex items-center'>
      <div className='container mx-auto px-4 h-full flex items-center justify-between'>
        <div className="flex items-center gap-3">
          {/* Hamburger for mobile */}
          <button className="lg:hidden p-2" onClick={onSidebarToggle} aria-label="Open sidebar">
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold hidden sm:block">Chat App</h1>
          </Link>
        </div>
        <div className= 'flex items-center gap-2'>
            <Link to={"/settings"}
            className={`btn btn-sm gap-2 transition-colors`}>
              <Settings className="w-4 h-4" />
              <span className='hidden sm:inline' >
                Settings
              </span>
            </Link>
            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button className="flex gap-2 items-center cursor-pointer" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
