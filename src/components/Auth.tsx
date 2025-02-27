import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Odstraněna kontrola existující autentizace při načtení stránky

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await authService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        if (formData.password.length < 6) {
          throw new Error('Heslo musí mít alespoň 6 znaků');
        }
        await authService.register({
          email: formData.email,
          password: formData.password,
          username: formData.username
        });
      }
      navigate('/'); // Po přihlášení přesměrování na hlavní menu
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Něco se pokazilo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/'); // Vrátit se do hlavního menu
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          {isLogin ? 'Přihlášení' : 'Registrace'}
        </h2>

        {error ? <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/20 p-3 text-white">
            {error}
          </div> : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder="Uživatelské jméno"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Heslo"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-white/20 p-3 font-semibold text-white transition-colors hover:bg-white/30 disabled:opacity-50"
            >
              {isLoading ? 'Načítání...' : isLogin ? 'Přihlásit se' : 'Registrovat se'}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg bg-red-500/20 p-3 font-semibold text-white transition-colors hover:bg-red-500/30"
            >
              Zpět
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/80 hover:text-white"
            >
              {isLogin ? 'Nemáte účet? Registrujte se' : 'Máte účet? Přihlaste se'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;