import { motion } from 'framer-motion';
import { categories } from '../data/categories';
import { storageService } from '../services/storageService';
import LevelDisplay from './LevelDisplay';
import { useState, useEffect } from 'react';
import { UserStats, CategoryStats, Category } from '../shared/types';

// Rozšíříme typ Category o stats
type CategoryWithStats = Category & { stats: CategoryStats };

const Leaderboard = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryWithStats[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const stats = await storageService.getUserStats();
      setUserStats(stats);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategoryData = async () => {
      const data = await Promise.all(
        categories.map(async (category) => ({
          ...category,
          stats: await storageService.getCategoryStats(category.id)
        }))
      );
      setCategoryData(data.sort((a, b) => b.stats.bestScore - a.stats.bestScore));
    };
    fetchCategoryData();
  }, []);

  if (!userStats) {
    return null; // nebo nějaký loading stav
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20"
        >
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Žebříček</h1>
          
          {/* Level Progress Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Úroveň hráče</h2>
            <LevelDisplay levelInfo={userStats.levelInfo} className="mb-4" />
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <p className="text-white/80">Celkové XP</p>
                <p className="text-xl font-bold text-white">{userStats.levelInfo.totalXP} XP</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Celkové statistiky</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-white/80 text-sm">Nejvyšší skóre</p>
                <p className="text-2xl font-bold text-white">{userStats.highScore}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-white/80 text-sm">Odehrané hry</p>
                <p className="text-2xl font-bold text-white">{userStats.gamesPlayed}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-white/80 text-sm">Celkové skóre</p>
                <p className="text-2xl font-bold text-white">{userStats.totalScore}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-white/80 text-sm">Nejdelší série</p>
                <p className="text-2xl font-bold text-white">{userStats.longestStreak}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Statistiky kategorií</h2>
            <div className="grid gap-4">
              {categoryData.map((category) => (
                <div 
                  key={category.id}
                  className="bg-white/10 p-4 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <category.icon className="w-6 h-6 text-white/90" />
                      <div>
                        <p className="text-white font-bold">{category.name}</p>
                        <p className="text-white/80 text-sm">
                          {category.stats.gamesPlayed} her • Průměr: {category.stats.averageScore}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{category.stats.bestScore}</p>
                      <p className="text-white/80 text-sm">Nejlepší skóre</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;