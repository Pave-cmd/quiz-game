import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GameState, Question, Achievement } from "../types";
import { categories } from "../data/categories";
import { questions } from "../data/questions";
import { getUserStats, updateUserStats, updateCategoryStats, trackAnswerForAchievements } from "../utils/storage";
import { checkAchievements } from "../utils/achievements";
import AchievementPopup from "./AchievementPopup";

const Game = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const category = categories.find(c => c.id === categoryId);
  
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    currentQuestion: 0,
    isGameOver: false,
    streak: 0
  });

  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState<{
    isVisible: boolean;
    isCorrect: boolean;
    selectedIndex: number;
  }>({ isVisible: false, isCorrect: false, selectedIndex: -1 });

  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  
  // Filtrujeme otázky podle kategorie
  const categoryQuestions: Question[] = questions.filter(q => q.category.toLowerCase() === categoryId);
  const currentQuestion = categoryQuestions[gameState.currentQuestion];

  useEffect(() => {
    if (!category) {
      navigate('/categories');
      return;
    }
  }, [category, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !gameState.isGameOver && !feedback.isVisible) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && !gameState.isGameOver) {
      handleGameOver();
    }
  }, [timeLeft, gameState.isGameOver, feedback.isVisible]);

  // Kontrola achievementů
  useEffect(() => {
    if (feedback.isVisible && feedback.isCorrect) {
      // Trackujeme odpověď pro speciální achievementy
      trackAnswerForAchievements({
        timeLeft,
        isCorrect: true
      });

      // Kontrolujeme, zda jsme získali nové achievementy
      const newAchievements = checkAchievements();
      if (newAchievements.length > 0) {
        setNewAchievement(newAchievements[0]); // Zobrazíme první nový achievement
      }
    }
  }, [feedback, timeLeft, currentQuestion]);

  const handleAnswer = async (answerIndex: number) => {
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    setFeedback({ isVisible: true, isCorrect, selectedIndex: answerIndex });
    
    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + currentQuestion.points,
        streak: prev.streak + 1
      }));
    }

    await new Promise(resolve => setTimeout(resolve, 4000));
    
    setFeedback({ isVisible: false, isCorrect: false, selectedIndex: -1 });

    if (!isCorrect || gameState.currentQuestion === categoryQuestions.length - 1) {
      handleGameOver();
    } else {
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
      setTimeLeft(30);
    }
  };

  const getOptionClassName = (index: number) => {
    if (!feedback.isVisible) {
      return "bg-white/10 hover:bg-white/20";
    }
    if (index === currentQuestion.correctAnswer) {
      return "bg-green-500/50 hover:bg-green-500/60";
    }
    if (index === feedback.selectedIndex && !feedback.isCorrect) {
      return "bg-red-500/50 hover:bg-red-500/60";
    }
    return "bg-white/10";
  };

  const handleGameOver = () => {
    setGameState(prev => ({ ...prev, isGameOver: true }));
    
    // Aktualizace statistik
    const currentStats = getUserStats();
    const updatedStats = {
      highScore: Math.max(currentStats.highScore, gameState.score),
      gamesPlayed: currentStats.gamesPlayed + 1,
      totalScore: currentStats.totalScore + gameState.score,
      longestStreak: Math.max(currentStats.longestStreak, gameState.streak),
      questionsAnswered: (currentStats.questionsAnswered || 0) + gameState.currentQuestion + 1,
      correctAnswers: (currentStats.correctAnswers || 0) + gameState.streak
    };

    updateUserStats(updatedStats);
    
    // Aktualizace statistik kategorie
    if (categoryId) {
      updateCategoryStats(categoryId, gameState.score);
    }

    // Závěrečná kontrola achievementů
    const endGameAchievements = checkAchievements();
    if (endGameAchievements.length > 0) {
      setNewAchievement(endGameAchievements[0]);
    }
  };

  if (!category || !currentQuestion) {
    return null;
  }

  if (gameState.isGameOver) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4"
      >
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Konec hry!</h2>
          <p className="text-xl text-white/90 mb-2">Skóre: {gameState.score}</p>
          <p className="text-lg text-white/90 mb-4">Nejdelší série: {gameState.streak}</p>
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
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4"
      >
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl">
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
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white/80">
                Otázka {gameState.currentQuestion + 1} z {categoryQuestions.length}
              </span>
              <span className="text-sm font-medium text-white/80">
                {category.name}
              </span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full">
              <motion.div 
                className="bg-white h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ 
                  width: `${((gameState.currentQuestion) / categoryQuestions.length) * 100}%` 
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="wait">
              {currentQuestion.options.map((option: string, index: number) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !feedback.isVisible && handleAnswer(index)}
                  disabled={feedback.isVisible}
                  className={`${getOptionClassName(index)} p-4 rounded-xl text-left text-white transition-all duration-200 relative overflow-hidden`}
                >
                  {option}
                  {feedback.isVisible && index === currentQuestion.correctAnswer && (
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

          <AnimatePresence>
            {feedback.isVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`mt-4 p-4 rounded-xl ${
                  feedback.isCorrect 
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {feedback.isCorrect
                  ? "Správně! 🎉"
                  : `Špatně! Správná odpověď byla: ${currentQuestion.options[currentQuestion.correctAnswer]}`
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Achievement Popup */}
      {newAchievement && (
        <AchievementPopup 
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}
    </>
  );
};

export default Game;