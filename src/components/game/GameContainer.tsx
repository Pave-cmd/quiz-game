import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';

import AnswerOptions from './AnswerOptions';
import FeedbackDisplay from './FeedbackDisplay';
import GameHeader from './GameHeader';
import GameOver from './GameOver';
import QuestionDisplay from './QuestionDisplay';
import { categories } from '../../data/categories';
import { questions } from '../../data/questions';
import { checkAchievements, trackAnswerForAchievements } from '../../services/achievementService';
import { calculateXPForAnswer, updateLevelProgress } from '../../services/levelService';
import { storageService } from '../../services/storageService';
import { GameState, Question, Achievement, UserStats } from '../../shared/types';
import AchievementPopup from '../AchievementPopup';
import BackToMenu from '../BackToMenu';

// Přidaná funkce pro náhodný výběr otázek z technické kategorie
const getRandomTechQuestions = (allQuestions: Question[]): Question[] => {
  // Filtrujeme pouze technické otázky
  const techQuestions = allQuestions.filter(q => q.category === "tech");
  
  // Rozdělíme otázky podle obtížnosti
  const easyQuestions = techQuestions.filter(q => q.difficulty === "easy");
  const mediumQuestions = techQuestions.filter(q => q.difficulty === "medium");
  const hardQuestions = techQuestions.filter(q => q.difficulty === "hard");
  
  // Funkce pro náhodné zamíchání pole (Fisher-Yates shuffle algoritmus)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Definujeme počet otázek pro každou obtížnost
  // Celkem chceme 20 otázek, zachováme podobný poměr jako v původních datech
  const numEasy = 8;     // 8 lehkých otázek (40%)
  const numMedium = 8;   // 8 středních otázek (40%)
  const numHard = 4;     // 4 těžké otázky (20%)
  
  // Náhodně vybereme otázky pro každou obtížnost
  const selectedEasy = shuffleArray(easyQuestions).slice(0, numEasy);
  const selectedMedium = shuffleArray(mediumQuestions).slice(0, numMedium);
  const selectedHard = shuffleArray(hardQuestions).slice(0, numHard);
  
  // Spojíme vybrané otázky podle obtížnosti (od nejlehčí po nejtěžší)
  return [...selectedEasy, ...selectedMedium, ...selectedHard];
};

const GameContainer = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    currentQuestion: 0,
    isGameOver: false,
    streak: 0
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState({
    isVisible: false,
    isCorrect: false,
    selectedIndex: -1
  });
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  // Přidáme nový stav pro povolení přechodu na další otázku
  const [canProceed, setCanProceed] = useState(false);
  
  // Reference pro ukládání aktivního časovače
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Odstraníme aktivní časovač při změně komponenty
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const category = categories.find(c => c.id === categoryId);
  
  // Upravená část pro výběr otázek
  let categoryQuestions: Question[] = [];
  if (categoryId === 'tech') {
    // Pro technickou kategorii použijeme náš speciální výběr 20 otázek
    categoryQuestions = getRandomTechQuestions(questions);
  } else {
    // Pro ostatní kategorie zachováme původní kód
    categoryQuestions = questions.filter(q => q.category.toLowerCase() === categoryId);
  }
  
  const currentQuestion = categoryQuestions[gameState.currentQuestion];

  useEffect(() => {
    if (!category) {
      navigate('/categories');
    }
  }, [category, navigate]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const userStats = await storageService.getUserStats();
        setStats(userStats);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Nepodařilo se načíst statistiky';
        setError(message);
        if (message === 'Uživatel není přihlášen') {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (timeLeft > 0 && !gameState.isGameOver && !feedback.isVisible) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    else if (timeLeft === 0 && !gameState.isGameOver && !feedback.isVisible) {
      handleGameOver();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, gameState.isGameOver, feedback.isVisible]);

  useEffect(() => {
    const checkForAchievements = async () => {
      if (feedback.isVisible && feedback.isCorrect) {
        await trackAnswerForAchievements({ timeLeft, isCorrect: true });
        const newAchievements = await checkAchievements();
        if (newAchievements.length > 0) {
          setNewAchievement(newAchievements[0]);
        }
      }
    };
    checkForAchievements();
  }, [feedback, timeLeft]);

  const handleAnswer = async (answerIndex: number) => {
    try {
      // Zruším jakýkoliv existující časovač
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      setFeedback({ isVisible: true, isCorrect, selectedIndex: answerIndex });
      
      const earnedXP = calculateXPForAnswer(
        isCorrect,
        timeLeft,
        currentQuestion.difficulty,
        gameState.streak
      );
      
      if (isCorrect) {
        setGameState(prev => ({
          ...prev,
          score: prev.score + currentQuestion.points,
          streak: prev.streak + 1
        }));
        
        try {
          const currentStats = await storageService.getUserStats();
          const updatedStats = updateLevelProgress(currentStats, earnedXP);
          await storageService.updateUserStats(updatedStats);
        } catch (statsError) {
          console.error('Nelze aktualizovat statistiky:', statsError);
          // Pokračujeme ve hře i když se statistiky nepodaří aktualizovat
        }
      } else {
        // Pokud odpověď není správná, resetujeme streak
        setGameState(prev => ({
          ...prev,
          streak: 0
        }));
      }

      // Nastavíme časovač pro zobrazení tlačítka další otázky
      timerRef.current = setTimeout(() => {
        setCanProceed(true);
      }, 2000);
      
    } catch (error) {
      console.error('Chyba při zpracování odpovědi:', error);
      setError('Došlo k chybě při zpracování odpovědi.');
    }
  };

  // Nová funkce pro přechod na další otázku po kliknutí na tlačítko
  const handleProceedToNextQuestion = () => {
    // Zruším jakýkoliv existující časovač
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    setFeedback({ isVisible: false, isCorrect: false, selectedIndex: -1 });
    setCanProceed(false);

    if (!feedback.isCorrect || gameState.currentQuestion === categoryQuestions.length - 1) {
      handleGameOver();
    } else {
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
      setTimeLeft(30);
    }
  };

  const handleGameOver = async () => {
    // Zruším jakýkoliv existující časovač
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    setGameState(prev => ({ ...prev, isGameOver: true }));
    
    try {
      const currentStats = await storageService.getUserStats();
      const updatedStats = {
        ...currentStats,
        highScore: Math.max(currentStats.highScore, gameState.score),
        gamesPlayed: currentStats.gamesPlayed + 1,
        totalScore: currentStats.totalScore + gameState.score,
        longestStreak: Math.max(currentStats.longestStreak, gameState.streak),
        questionsAnswered: (currentStats.questionsAnswered || 0) + gameState.currentQuestion + 1,
        correctAnswers: (currentStats.correctAnswers || 0) + gameState.streak
      };

      await storageService.updateUserStats(updatedStats);
      if (categoryId) {
        await storageService.updateCategoryStats(categoryId, gameState.score);
      }

      const endGameAchievements = await checkAchievements();
      if (endGameAchievements.length > 0) {
        setNewAchievement(endGameAchievements[0]);
      }
    } catch (error) {
      console.error('Chyba při aktualizaci statistik:', error);
    }
  };

  const handleRestart = () => {
    // Zruším jakýkoliv existující časovač
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    setGameState({
      score: 0,
      currentQuestion: 0,
      isGameOver: false,
      streak: 0
    });
    setTimeLeft(30);
    setFeedback({
      isVisible: false,
      isCorrect: false,
      selectedIndex: -1
    });
    setCanProceed(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <BackToMenu />
        <div className="rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-white">Načítání...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <BackToMenu />
        <div className="rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-white">{error}</p>
        </div>
      </div>
    );
  }

  if (!category || !currentQuestion || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <BackToMenu />
        <div className="rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-white">Kategorie nebo otázka nenalezena</p>
        </div>
      </div>
    );
  }

  if (gameState.isGameOver) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <BackToMenu />
        <GameOver 
          score={gameState.score} 
          totalQuestions={categoryQuestions.length}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4"
      >
        <BackToMenu />
        <div className="w-full max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <GameHeader 
            score={gameState.score}
            streak={gameState.streak}
            questionNumber={gameState.currentQuestion + 1}
            totalQuestions={categoryQuestions.length}
            timeLeft={timeLeft}
            category={category.name}
          />
          
          <QuestionDisplay 
            currentQuestion={currentQuestion}
            questionNumber={gameState.currentQuestion + 1}
            totalQuestions={categoryQuestions.length}
            category={category}
          />
          
          <AnswerOptions 
            options={currentQuestion.options}
            feedback={feedback}
            onAnswer={handleAnswer}
            correctAnswer={currentQuestion.correctAnswer}
          />
          
          <FeedbackDisplay 
            feedback={feedback}
            correctAnswer={currentQuestion.options[currentQuestion.correctAnswer]}
          />
          
          {/* Přidáme tlačítko pro přechod na další otázku s výraznějším designem */}
          {feedback.isVisible && canProceed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProceedToNextQuestion}
                className="rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-indigo-700"
              >
                {feedback.isCorrect && gameState.currentQuestion < categoryQuestions.length - 1 
                  ? "Další otázka →" 
                  : "Ukončit hru"}
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {newAchievement ? (
        <AchievementPopup 
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      ) : null}
    </>
  );
};

export default GameContainer;