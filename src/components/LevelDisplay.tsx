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
    <div className={`${className} rounded-xl bg-white/10 p-4`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-bold text-white">Level {levelInfo.currentLevel}</span>
        <span className="text-sm text-white/80">
          {levelInfo.xpToNextLevel} XP to next level
        </span>
      </div>
      
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="mt-2 text-right">
        <span className="text-sm text-white/60">
          Total XP: {levelInfo.totalXP}
        </span>
      </div>
    </div>
  );
};

export default LevelDisplay;