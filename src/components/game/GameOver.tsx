// src/components/game/GameOver.tsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface GameOverProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const GameOver = ({ score, totalQuestions, onRestart }: GameOverProps) => {
  const navigate = useNavigate();
  
  // Výpočet procentuálního výsledku
  const percentage = Math.round((score / (totalQuestions * 10)) * 100);
  
  // Hodnocení výkonu
  const getRating = () => {
    if (percentage >= 90) return '🏆 Šampion kvízu!';
    if (percentage >= 70) return '🌟 Skvělý výkon!';
    if (percentage >= 50) return '👍 Dobrá práce!';
    if (percentage >= 30) return '🙂 Máš na víc!';
    return '😕 Příště to bude lepší!';
  };
  
  // Návrat do hlavního menu
  const handleBackToMenu = () => {
    navigate('/');
  };

  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-4xl font-bold text-transparent"
      >
        Konec hry
      </motion.h2>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 text-4xl font-bold text-white"
      >
        {score}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-4 text-white"
      >
        <p className="text-xl">
          <span className="font-bold">{percentage}%</span> úspěšnost
        </p>
        <p className="text-2xl font-semibold">{getRating()}</p>
      </motion.div>
      
      <div className="mt-8 space-y-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 py-3 font-semibold text-white shadow-lg"
        >
          Hrát znovu
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackToMenu}
          className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 py-3 font-semibold text-white shadow-lg"
        >
          Zpět do menu
        </motion.button>
      </div>
    </div>
  );
};

export default GameOver;