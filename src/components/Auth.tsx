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
        await authService.register({
          email: formData.email,
          password: formData.password,
          username: formData.username
        });
      }
      navigate('/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Něco se pokazilo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {isLogin ? 'Přihlášení' : 'Registrace'}
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder="Uživatelské jméno"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
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
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Heslo"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Načítání...' : isLogin ? 'Přihlásit se' : 'Registrovat se'}
          </button>

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