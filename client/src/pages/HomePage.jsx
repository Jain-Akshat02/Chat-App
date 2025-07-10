import NoChatSelected from "../components/NoChatSelected.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useChatStore } from "../store/useChatStore";
import ChatContainer from "../components/ChatContainer.jsx";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  return (
    <div className="h-screen bg-base-200 flex items-center justify-center">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-4rem)] flex">
        <Sidebar />
        <div className="flex-1 h-full flex flex-col">
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
