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

// Odstraněna speciální funkce getRandomTechQuestions

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
  // Přidáme nový stav pro seznam otázek
  const [categoryQuestions, setCategoryQuestions] = useState<Question[]>([]);
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

  // Funkce pro zamíchání otázek pro všechny kategorie
  const shuffleQuestions = (questions: Question[]): Question[] => {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const category = categories.find(c => c.id === categoryId);
  
  // ODSTRANÍME tento kód, který způsobuje problém:
  // const categoryQuestions = shuffleQuestions(
  //   questions.filter(q => q.category.toLowerCase() === categoryId)
  // );
  
  // Získáme aktuální otázku z našeho pole uloženého ve stavu
  const currentQuestion = categoryQuestions[gameState.currentQuestion];

  // Načítáme a mícháme otázky pouze jednou při počátečním načtení
  useEffect(() => {
    if (categoryId) {
      const filteredQuestions = questions.filter(q => q.category.toLowerCase() === categoryId);
      setCategoryQuestions(shuffleQuestions(filteredQuestions));
    }
  }, [categoryId]); // Závislost pouze na ID kategorie

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

  // Oprava časovače - pouze jeden aktivní časovač v jednom okamžiku
  useEffect(() => {
    // Vždy zrušíme předchozí časovač
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Pokud je viditelná zpětná vazba nebo je hra ukončená, nepokračujeme s časovačem
    if (feedback.isVisible || gameState.isGameOver) {
      return;
    }

    if (timeLeft > 0) {
      // Vytvoříme nový časovač
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      // Uložíme referenci na časovač
      timerRef.current = timer;
    } 
    else if (timeLeft === 0) {
      // Pouze pokud není zpětná vazba viditelná a hra není ukončená
      handleGameOver();
    }
    
    // Důležité: Vyčistit časovač při odmontování komponenty nebo změně závislostí
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLeft, feedback.isVisible, gameState.isGameOver]);

  // Oprava kontroly achievementů, aby nezpůsobovala zaseknutí
  useEffect(() => {
    const checkForAchievements = async () => {
      try {
        if (feedback.isVisible && feedback.isCorrect) {
          await trackAnswerForAchievements({ timeLeft, isCorrect: true });
          const newAchievements = await checkAchievements();
          if (newAchievements && newAchievements.length > 0) {
            setNewAchievement(newAchievements[0]);
          }
        }
      } catch (error) {
        console.error("Chyba při kontrole achievementů:", error);
        // Zachytíme chyby a nebudeme je propagovat dál
      }
    };
    
    checkForAchievements();
  }, [feedback, timeLeft]);

  const handleAnswer = async (answerIndex: number) => {
    try {
      // Zrušíme jakýkoliv existující časovač
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      // Přidáme ochranu proti chybějícím datům
      if (!currentQuestion) {
        console.error("Nelze zpracovat odpověď: žádná otázka není k dispozici");
        return;
      }
      
      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      setFeedback({ isVisible: true, isCorrect, selectedIndex: answerIndex });
      
      // Výpočet XP pouze pokud máme platnou otázku
      const earnedXP = calculateXPForAnswer(
        isCorrect,
        timeLeft,
        currentQuestion.difficulty,
        gameState.streak
      );
      
      if (isCorrect) {
        setGameState(prev => ({
          ...prev,
          score: prev.score + (currentQuestion?.points || 0),
          streak: prev.streak + 1
        }));
        
        try {
          const currentStats = await storageService.getUserStats();
          if (currentStats) {
            const updatedStats = updateLevelProgress(currentStats, earnedXP);
            await storageService.updateUserStats(updatedStats);
          }
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
        
        // Sledujeme i špatnou odpověď pro achievementy
        try {
          await trackAnswerForAchievements({ timeLeft, isCorrect: false });
        } catch (error) {
          console.error('Chyba při sledování odpovědi:', error);
        }
      }

      // Nastavíme časovač pro zobrazení tlačítka další otázky - VŽDY, bez ohledu na správnost odpovědi
      timerRef.current = setTimeout(() => {
        setCanProceed(true);
      }, 2000);
      
    } catch (error) {
      console.error('Chyba při zpracování odpovědi:', error);
      setError('Došlo k chybě při zpracování odpovědi.');
    }
  };

  // Upravená funkce pro přechod na další otázku
  const handleProceedToNextQuestion = () => {
    // Vždy zrušíme všechny časovače
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    setFeedback({ isVisible: false, isCorrect: false, selectedIndex: -1 });
    setCanProceed(false);

    // Přidáme ochranu proti prázdnému poli otázek a ověření indexu
    if (!feedback.isCorrect || !categoryQuestions || 
        gameState.currentQuestion >= categoryQuestions.length - 1) {
      handleGameOver();
    } else {
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
      // Resetujeme časovač pro novou otázku
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

  // Úplný konec komponenty - ujistíme se, že máme validní JSX

  // Zajistíme správné renderování komponenty GameOver
  if (gameState.isGameOver) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <BackToMenu />
        <div className="rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <GameOver 
            score={gameState.score}
            totalQuestions={categoryQuestions.length} // Přidáno
            onRestart={handleRestart}
          />
        </div>
        {newAchievement && (
          <AchievementPopup
            achievement={newAchievement}
            onClose={() => setNewAchievement(null)}
          />
        )}
      </div>
    );
  }

  // Hlavní render - upravíme rendering problémových komponent
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <BackToMenu />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
      >
        <GameHeader
          category={category.name} 
          score={gameState.score}
          questionNumber={gameState.currentQuestion + 1} // Změněno z currentQuestion
          totalQuestions={categoryQuestions.length}     // Změněno z questionsCount
          timeLeft={timeLeft}
          streak={gameState.streak}
        />
        
        {currentQuestion ? (
          <>
            <QuestionDisplay 
              currentQuestion={currentQuestion}         // Změněno z questionText
              questionNumber={gameState.currentQuestion + 1}
              totalQuestions={categoryQuestions.length}
              category={category}                      // Přidáme celý objekt kategorie
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
            
            {/* Tlačítko pro pokračování na další otázku */}
            {feedback.isVisible && canProceed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleProceedToNextQuestion}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 font-bold text-white shadow-lg transition hover:from-blue-600 hover:to-indigo-700"
                >
                  {feedback.isCorrect && gameState.currentQuestion < categoryQuestions.length - 1
                    ? "Další otázka"
                    : "Dokončit hru"
                  }
                </motion.button>
              </motion.div>
            )}
          </>
        ) : (
          <div className="flex justify-center p-4">
            <p className="text-center text-white">Načítání otázky...</p>
          </div>
        )}
      </motion.div>

      {newAchievement && (
        <AchievementPopup
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}
    </div>
  );
};

export default GameContainer;