//src/components/game/GameOver.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface GameOverProps {
  score: number;
  streak: number;
}

const GameOver: React.FC<GameOverProps> = ({ score, streak }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4"
    >
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Konec hry!</h2>
        <p className="text-xl text-white/90 mb-2">Skóre: {score}</p>
        <p className="text-lg text-white/90 mb-4">Nejdelší série: {streak}</p>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/categories")}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl transition-all duration-200"
          >
            Zpět na kategorie
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-all duration-200"
          >
            Hrát znovu
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GameOver;