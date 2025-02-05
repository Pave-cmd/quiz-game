import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, AchievementRarity } from '../shared/types';

interface AchievementPopupProps {
  achievement: Achievement;
  onClose: () => void;
}

const rarityColors: Record<AchievementRarity, string> = {
  common: 'from-gray-400 to-slate-600',
  rare: 'from-blue-400 to-indigo-600',
  epic: 'from-purple-400 to-pink-600',
  legendary: 'from-yellow-400 to-amber-600'
};

const rarityEmoji: Record<AchievementRarity, string> = {
  common: '🔰',
  rare: '🥈',
  epic: '🥇',
  legendary: '👑'
};

const AchievementPopup: React.FC<AchievementPopupProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Popup se zavře po 5 sekundách
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: 50 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className={`bg-gradient-to-r ${rarityColors[achievement.rarity]} p-4 rounded-xl shadow-xl backdrop-blur-lg border border-white/20 max-w-sm`}>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <achievement.icon className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {achievement.name}
                </h3>
                <span className="text-2xl" role="img" aria-label={`${achievement.rarity} achievement`}>
                  {rarityEmoji[achievement.rarity]}
                </span>
              </div>
              
              <p className="text-sm text-white/80 mt-1">
                {achievement.description}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5 }}
                  className="h-1 bg-white/30 rounded-full"
                />
                <span className="text-xs text-white/60">
                  Achievement odemčen!
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementPopup;