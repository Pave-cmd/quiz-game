// src/components/game/GameHeader.tsx
import { motion } from 'framer-motion';
import { GameState, LevelSystem } from '../../shared/types';
import LevelDisplay from '../LevelDisplay';

interface GameHeaderProps {
  gameState: GameState;
  timeLeft: number;
  xpGained: number;
  levelInfo: LevelSystem;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  gameState,
  timeLeft,
  xpGained,
  levelInfo
}) => (
  <>
    <div className="mb-4">
      <LevelDisplay levelInfo={levelInfo} />
      {xpGained > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-green-400 font-bold text-center mt-2"
        >
          +{xpGained} XP
        </motion.div>
      )}
    </div>
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-white">Skóre: {gameState.score}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white/80">Série: {gameState.streak}</span>
          {gameState.streak > 0 && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="px-2 py-1 bg-yellow-500/20 rounded-full text-yellow-300 text-sm"
            >
              🔥 {gameState.streak}
            </motion.div>
          )}
        </div>
      </div>
      <span className="text-xl font-bold text-white">{timeLeft}s</span>
    </div>
  </>
);

export default GameHeader;