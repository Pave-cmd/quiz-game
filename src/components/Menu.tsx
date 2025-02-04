import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Menu = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20"
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
          >
            Quiz Master
          </motion.h1>
          
          <div className="space-y-6">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/game/all"
                className="block w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white py-4 px-8 rounded-2xl text-xl font-bold shadow-lg transition-all duration-300 text-center backdrop-blur-sm bg-opacity-90 border border-white/10"
              >
                Nová hra
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/categories"
                className="block w-full bg-gradient-to-r from-violet-400 to-violet-600 hover:from-violet-500 hover:to-violet-700 text-white py-4 px-8 rounded-2xl text-xl font-bold shadow-lg transition-all duration-300 text-center backdrop-blur-sm bg-opacity-90 border border-white/10"
              >
                Kategorie
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/leaderboard"
                className="block w-full bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white py-4 px-8 rounded-2xl text-xl font-bold shadow-lg transition-all duration-300 text-center backdrop-blur-sm bg-opacity-90 border border-white/10"
              >
                Žebříček
              </Link>
            </motion.div>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-white/80 text-center text-lg"
          >
            Otestujte své znalosti v různých kategoriích
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Menu;
