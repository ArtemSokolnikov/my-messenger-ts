import { useState } from 'react';
import { Socket } from 'socket.io-client';

interface LoginProps {
  setIsLogin: (isLogin: boolean) => void;
  setCurrentUser: React.Dispatch<React.SetStateAction<{ currentUsername: string; currentRoom: string }>>;
  socket: Socket;
}

const Login = ({ setIsLogin, setCurrentUser, socket }: LoginProps) => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (username !== '') {
      socket.emit('login', { username });
      setCurrentUser((prev) => ({ ...prev, currentUsername: username }));
      setIsLogin(true);
      setUsername('');
    }
  };

  return (
    <div className='w-fit flex flex-col justify-center items-center text-center space-y-2 bg-white/10 backdrop-blur-sm rounded-xl py-8 px-4'>
      <h1 className='text-3xl font-bold'>Welcome to chat</h1>
      <input
        type='text'
        placeholder='Your name'
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        value={username}
        className='outline-none text-black p-2 rounded-md overflow-hidden w-[300px]'
      />
      <button
        onClick={handleLogin}
        className="btn btn-success w-100"
        style={{ padding: '0.5rem', borderRadius: '0.375rem' }}
      >
        Login
      </button>
    </div>
  );
};

export default Login;
