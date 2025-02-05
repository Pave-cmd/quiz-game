// src/components/game/QuestionDisplay.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Question, Category } from '../../shared/types';

interface QuestionDisplayProps {
  currentQuestion: Question;
  questionNumber: number;
  totalQuestions: number;
  category: Category;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  currentQuestion,
  questionNumber,
  totalQuestions,
  category
}) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-white/80">
        Otázka {questionNumber} z {totalQuestions}
      </span>
      <span className="text-sm font-medium text-white/80">
        {category.name}
      </span>
    </div>
    <div className="w-full bg-white/10 h-2 rounded-full">
      <motion.div 
        className="bg-white h-full rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
    <h2 className="text-2xl font-bold text-white mt-4">{currentQuestion.question}</h2>
  </div>
);

export default QuestionDisplay;