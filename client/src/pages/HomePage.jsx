import NoChatSelected from "../components/NoChatSelected.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useChatStore } from "../store/useChatStore";
import ChatContainer from "../components/ChatContainer.jsx";
import { useState } from "react";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-base-200 flex flex-col lg:flex-row items-center justify-center relative">
      <Navbar onSidebarToggle={() => setSidebarOpen((open) => !open)} />
      {/* Sidebar for desktop */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex lg:hidden">
          <div className="bg-base-100 w-64 h-full shadow-xl">
            <Sidebar />
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
      <div className="flex-1 h-full flex flex-col w-full lg:w-auto">
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>
    </div>
  );
};

export default HomePage;
