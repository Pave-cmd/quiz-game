import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { authService } from "../services/authService";

const Menu = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authService.checkAuth();
      setIsLoggedIn(isAuth);
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="mb-12 bg-gradient-to-r from-white to-white/80 bg-clip-text text-center text-5xl font-bold text-transparent"
          >
            Quiz Master
          </motion.h1>

          <div className="space-y-6">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/categories"
                className="block w-full rounded-2xl border border-white/10 bg-opacity-90 bg-gradient-to-r from-violet-400 to-violet-600 px-8 py-4 text-center text-xl font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:from-violet-500 hover:to-violet-700"
              >
                Kategorie
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/leaderboard"
                className="block w-full rounded-2xl border border-white/10 bg-opacity-90 bg-gradient-to-r from-emerald-400 to-emerald-600 px-8 py-4 text-center text-xl font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:from-emerald-500 hover:to-emerald-700"
              >
                Žebříček
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="block w-full rounded-2xl border border-white/10 bg-opacity-90 bg-gradient-to-r from-red-400 to-red-600 px-8 py-4 text-center text-xl font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:from-red-500 hover:to-red-700"
                >
                  Odhlásit se
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="block w-full rounded-2xl border border-white/10 bg-opacity-90 bg-gradient-to-r from-green-400 to-green-600 px-8 py-4 text-center text-xl font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:from-green-500 hover:to-green-700"
                >
                  Přihlásit se
                </button>
              )}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-lg text-white/80"
          >
            Otestujte své znalosti v různých kategoriích
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Menu;