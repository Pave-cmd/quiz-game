import React from 'react';
import { motion } from 'framer-motion';
import { LevelSystem } from '../shared/types';

interface LevelDisplayProps {
  levelInfo?: LevelSystem;  // Přidáme optional operator
  className?: string;
}

const LevelDisplay: React.FC<LevelDisplayProps> = ({ levelInfo, className }) => {
  if (!levelInfo) {
    return null;  // Pokud levelInfo není definováno, nezobrazíme nic
  }

  const progressPercentage = ((levelInfo.totalXP - (levelInfo.currentXP - levelInfo.xpToNextLevel)) / levelInfo.xpToNextLevel) * 100;

  return (
    <div className={`${className} bg-white/10 rounded-xl p-4`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-bold">Level {levelInfo.currentLevel}</span>
        <span className="text-white/80 text-sm">
          {levelInfo.xpToNextLevel} XP to next level
        </span>
      </div>
      
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="mt-2 text-right">
        <span className="text-white/60 text-sm">
          Total XP: {levelInfo.totalXP}
        </span>
      </div>
    </div>
  );
};

export default LevelDisplay;