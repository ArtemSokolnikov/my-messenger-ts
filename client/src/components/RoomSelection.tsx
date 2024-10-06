import { useState } from 'react';
import { Socket } from 'socket.io-client';

interface RoomSelectionProps {
  setShowChat: (showChat: boolean) => void;
  setIsLogin:(isLogin: boolean) => void;
  setCurrentUser: React.Dispatch<
    React.SetStateAction<{ currentUsername: string; currentRoom: string }>
  >;
  currentUser: { currentUsername: string; currentRoom: string };
  socket: Socket;
}

const RoomSelection = ({
  setShowChat,
  setCurrentUser,
  currentUser,
  socket,
  setIsLogin
}: RoomSelectionProps) => {
  const [room, setRoom] = useState('');

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', { username: currentUser.currentUsername, room });
      setCurrentUser((prev) => ({ ...prev, currentRoom: room }));
      setShowChat(true);
      setRoom('');
    }
  };

  const handleLogout = () => {
    socket.emit('logout');
    setIsLogin(false)
  };

  return (
    <div className='w-fit flex flex-col justify-center items-center text-center space-y-2 bg-white/10 backdrop-blur-sm rounded-xl py-8 px-4'>
      <h1 className='text-3xl font-bold'>Choose your room</h1>
      <input
        type='text'
        placeholder='Room ID'
        onChange={(e) => setRoom(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
        value={room}
        className='outline-none text-black p-2 rounded-md overflow-hidden md:max-w-96 w-[300px]'
      />
      <div className='coupleOfButton'>
        <button
          onClick={joinRoom}
          className="btn btn-primary"
          style={{ padding: '0.5rem', borderRadius: '0.375rem', width: '145px', fontWeight: '500' }}
        >
          Join a Room
        </button>
        <button
          onClick={handleLogout}
          className='btn btn-success'
          style={{
            padding: '0.5rem',
            borderRadius: '0.375rem',
            width: '145px',
            fontWeight: '500',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RoomSelection;
