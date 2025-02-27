import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  email: string;
  username: string;
}

const UserInfo = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const isAuth = await authService.checkAuth();
      if (isAuth) {
        const userInfo = authService.getUserInfo();
        setUser(userInfo);
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Poslouchání na změny v přihlášení
    window.addEventListener('storage', checkUser);
    return () => {
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="fixed right-4 top-4 z-50 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="text-white">
          <p className="text-sm font-semibold">{user.username}</p>
          <p className="text-xs opacity-70">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;