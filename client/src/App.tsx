import { useState } from 'react';
import io from 'socket.io-client';
import Chat from './components/Chat';
import Login from './components/Login.tsx';
import RoomSelection from './components/RoomSelection.tsx';
import './styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const PORT = import.meta.env.PORT || '3001';
const VITE_SERVER_URL =
  import.meta.env.VITE_SERVER_URL || `http://localhost:${PORT}`;
const socket = io(VITE_SERVER_URL);

interface currentUserProps {
  currentUsername: string;
  currentRoom: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<currentUserProps>({
    currentUsername: '',
    currentRoom: '',
  });
  const [showChat, setShowChat] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className='px-8 flex items-center justify-center text-white bg-[url(/src/assets/background.jpg)] bg-no-repeat bg-cover w-full h-screen'>
      {!showChat && !isLogin ? (
        <Login setIsLogin={setIsLogin} setCurrentUser={setCurrentUser} socket={socket} />
      ) : !showChat && isLogin ? (
        <RoomSelection
          setShowChat={setShowChat}
          setCurrentUser={setCurrentUser}
          currentUser={currentUser}
          socket={socket}
          setIsLogin={setIsLogin}
        />
      ) : (
        <Chat
          socket={socket}
          username={currentUser.currentUsername}
          room={currentUser.currentRoom}
          setShowChat={setShowChat}
        />
      )}
    </div>
  );
}

export default App;
