import { useState, useEffect } from 'react';

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

const GameContainer = () => {
 const { categoryId } = useParams<{ categoryId: string }>();
 const navigate = useNavigate();
 const [error, setError] = useState<string | null>(null);
 const [loading, setLoading] = useState(true);
 // Odstraněná nepoužívaná proměnná xpGained
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

 const category = categories.find(c => c.id === categoryId);
 const categoryQuestions: Question[] = questions.filter(q => q.category.toLowerCase() === categoryId);
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
   if (timeLeft > 0 && !gameState.isGameOver && !feedback.isVisible) {
     const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
     return () => clearTimeout(timer);
   }
   if (timeLeft === 0 && !gameState.isGameOver) {
     handleGameOver();
   }
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
  } catch (error) {
    console.error('Chyba při zpracování odpovědi:', error);
    setError('Došlo k chybě při zpracování odpovědi.');
  }
};

 const handleGameOver = async () => {
   setGameState(prev => ({ ...prev, isGameOver: true }));
   
   const currentStats = await storageService.getUserStats();
   const updatedStats = {
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
 };

 const handleRestart = () => {
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
       </div>
     </motion.div>

     {newAchievement ? <AchievementPopup 
         achievement={newAchievement}
         onClose={() => setNewAchievement(null)}
       /> : null}
   </>
 );
};

export default GameContainer;