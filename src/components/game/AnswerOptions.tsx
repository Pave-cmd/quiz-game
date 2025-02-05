// src/components/game/AnswerOptions.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnswerOptionsProps {
  options: string[];
  feedback: {
    isVisible: boolean;
    isCorrect: boolean;
    selectedIndex: number;
  };
  onAnswer: (index: number) => void;
  correctAnswer: number;
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  options,
  feedback,
  onAnswer,
  correctAnswer
}) => {
  const getOptionClassName = (index: number) => {
    if (!feedback.isVisible) return "bg-white/10 hover:bg-white/20";
    if (index === correctAnswer) return "bg-green-500/50 hover:bg-green-500/60";
    if (index === feedback.selectedIndex && !feedback.isCorrect) return "bg-red-500/50 hover:bg-red-500/60";
    return "bg-white/10";
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <AnimatePresence mode="wait">
        {options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !feedback.isVisible && onAnswer(index)}
            disabled={feedback.isVisible}
            className={`${getOptionClassName(index)} p-4 rounded-xl text-left text-white transition-all duration-200 relative overflow-hidden`}
          >
            {option}
            {feedback.isVisible && index === correctAnswer && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AnswerOptions;