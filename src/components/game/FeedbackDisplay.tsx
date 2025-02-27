//src/components/game/FeedbackDisplay.tsx
import React from 'react';

import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackDisplayProps {
  feedback: {
    isVisible: boolean;
    isCorrect: boolean;
  };
  correctAnswer: string;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, correctAnswer }) => (
  <AnimatePresence>
    {feedback.isVisible ? <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`mt-4 rounded-xl p-4 ${
          feedback.isCorrect 
            ? "bg-green-500/20 text-green-300"
            : "bg-red-500/20 text-red-300"
        }`}
      >
        {feedback.isCorrect
          ? "Správně! 🎉"
          : `Špatně! Správná odpověď byla: ${correctAnswer}`
        }
      </motion.div> : null}
  </AnimatePresence>
);

export default FeedbackDisplay;