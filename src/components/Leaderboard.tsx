import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { categories } from '../data/categories';
import { getCategoryStats, getUserStats } from '../utils/storage';

const Leaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const userStats = getUserStats();

  const getCategoryData = () => {
    return categories.map(category => ({
      ...category,
      stats: getCategoryStats(category.id)
    })).sort((a, b) => b.stats.bestScore - a.stats.bestScore);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20"
        >
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Žebříček</h1>
          
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
              {getCategoryData().map(category => (
                <div 
                  key={category.id}
                  className="bg-white/10 p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <category.icon className="w-6 h-6 text-white/90" />
                    <div>
                      <p className="text-white font-bold">{category.name}</p>
                      <p className="text-white/80 text-sm">
                        {category.stats.gamesPlayed} her • Průměr: {category.stats.averageScore}
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{category.stats.bestScore}</p>
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
