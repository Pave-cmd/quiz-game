// src/components/game/GameHeader.tsx
import { motion } from 'framer-motion';

interface GameHeaderProps {
  questionNumber: number;
  totalQuestions: number;
  score: number;
  timeLeft: number;
  category: string;
  streak?: number;
}

const GameHeader = ({ 
  questionNumber, 
  totalQuestions, 
  score, 
  timeLeft, 
  category,
  streak = 0
}: GameHeaderProps) => {
  // Procento otázek
  const progressPercentage = (questionNumber / totalQuestions) * 100;
  
  // Barva pro časovač
  const getTimerColor = () => {
    if (timeLeft > 20) return 'bg-green-500';
    if (timeLeft > 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
      <div className="flex justify-between">
        <div className="text-white">
          <div className="text-lg font-bold">{category}</div>
          <div className="text-sm opacity-80">Otázka {questionNumber} z {totalQuestions}</div>
        </div>
        <div className="text-right text-white">
          <div className="text-lg font-bold">{score} bodů</div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <span className="opacity-80">Série:</span>
              <span className="font-bold text-yellow-300">{streak}🔥</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
          initial={{ width: `${(questionNumber - 1) / totalQuestions * 100}%` }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {/* Timer */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-white">⏱️ Čas:</div>
        <div className="flex-1 overflow-hidden rounded-full bg-white/20">
          <motion.div 
            className={`h-2 ${getTimerColor()}`}
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / 30) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="min-w-8 rounded-md bg-white/20 px-2 py-1 text-center text-sm font-bold text-white">
          {timeLeft}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;