import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GameState, Question } from "../shared/types";
import { questions } from "../data/questions";
import { storageService } from "../services/storageService";

const AllCategories = () => {
 const navigate = useNavigate();
 const [gameState, setGameState] = useState<GameState>({
   score: 0,
   currentQuestion: 0,
   isGameOver: false,
   streak: 0
 });

 const [timeLeft, setTimeLeft] = useState(30);
 const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
 
 useEffect(() => {
   // Náhodně zamícháme všechny otázky při prvním načtení
   setShuffledQuestions(questions.sort(() => Math.random() - 0.5));
 }, []);

 const currentQuestion = shuffledQuestions[gameState.currentQuestion];

 useEffect(() => {
   if (timeLeft > 0 && !gameState.isGameOver) {
     const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
     return () => clearTimeout(timer);
   }
   if (timeLeft === 0 && !gameState.isGameOver) {
     handleGameOver();
   }
 }, [timeLeft, gameState.isGameOver]);

 const handleAnswer = (answerIndex: number) => {
   const isCorrect = answerIndex === currentQuestion.correctAnswer;
   
   if (isCorrect) {
     setGameState(prev => ({
       ...prev,
       score: prev.score + currentQuestion.points,
       streak: prev.streak + 1
     }));
   } else {
     handleGameOver();
   }

   if (gameState.currentQuestion === shuffledQuestions.length - 1) {
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
   setGameState(prev => ({ ...prev, isGameOver: true }));
   
   const currentStats = await storageService.getUserStats();
   await storageService.updateUserStats({
     highScore: Math.max(currentStats.highScore, gameState.score),
     gamesPlayed: currentStats.gamesPlayed + 1,
     totalScore: currentStats.totalScore + gameState.score,
     longestStreak: Math.max(currentStats.longestStreak, gameState.streak)
   });
 };

 if (!currentQuestion) {
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
             onClick={() => navigate("/")}
             className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl transition-all duration-200"
           >
             Zpět na menu
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
   <motion.div 
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4"
   >
     <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl">
       <div className="flex justify-between items-center mb-6">
         <span className="text-xl font-bold text-white">Skóre: {gameState.score}</span>
         <span className="text-xl font-bold text-white">{timeLeft}s</span>
       </div>
       
       <div className="mb-4">
         <span className="text-sm font-medium text-white/80">
           Kategorie: {currentQuestion.category}
         </span>
         <div className="w-full bg-white/10 h-2 rounded-full mt-1">
           <div 
             className="bg-white h-full rounded-full transition-all duration-300"
             style={{ width: `${(gameState.currentQuestion / shuffledQuestions.length) * 100}%` }}
           />
         </div>
       </div>
       
       <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>
       
       <div className="grid grid-cols-1 gap-4">
         {currentQuestion.options.map((option: string, index: number) => (
           <motion.button
             key={index}
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => handleAnswer(index)}
             className="bg-white/10 hover:bg-white/20 p-4 rounded-xl text-left text-white transition-all duration-200"
           >
             {option}
           </motion.button>
         ))}
       </div>
     </div>
   </motion.div>
 );
};

export default AllCategories;