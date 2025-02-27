import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackToMenu from './BackToMenu';

interface LeaderboardEntry {
  username: string;
  score: number;
  gamesPlayed: number;
  rank: number;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulace načtení dat z API
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        // V reálné aplikaci by zde byl volání API
        // const response = await api.get('/leaderboard');
        // setLeaderboardData(response.data);
        
        // Simulovaná data
        setTimeout(() => {
          const dummyData: LeaderboardEntry[] = [
            { username: 'QuizMaster', score: 9850, gamesPlayed: 42, rank: 1 },
            { username: 'BrainGenius', score: 8720, gamesPlayed: 38, rank: 2 },
            { username: 'QuizQueen', score: 7690, gamesPlayed: 35, rank: 3 },
            { username: 'KnowledgeKing', score: 6540, gamesPlayed: 30, rank: 4 },
            { username: 'TriviaTitan', score: 5980, gamesPlayed: 28, rank: 5 },
            { username: 'QuizWizard', score: 5470, gamesPlayed: 25, rank: 6 },
            { username: 'BrainBox', score: 4930, gamesPlayed: 23, rank: 7 },
            { username: 'QuizChampion', score: 4250, gamesPlayed: 20, rank: 8 },
            { username: 'TriviaTracker', score: 3740, gamesPlayed: 18, rank: 9 },
            { username: 'KnowItAll', score: 3190, gamesPlayed: 15, rank: 10 },
          ];
          setLeaderboardData(dummyData);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        setError('Nepodařilo se načíst žebříček');
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <BackToMenu />
      
      <div className="mx-auto max-w-4xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center text-4xl font-bold text-white"
        >
          Žebříček nejlepších hráčů
        </motion.h1>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-500/20 p-4 text-center text-white">
            {error}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden rounded-xl bg-white/10 backdrop-blur-xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left text-sm uppercase text-white/70">
                    <th className="px-6 py-4">Pořadí</th>
                    <th className="px-6 py-4">Uživatel</th>
                    <th className="px-6 py-4 text-right">Skóre</th>
                    <th className="px-6 py-4 text-right">Odehráno her</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, index) => (
                    <motion.tr 
                      key={entry.username}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-white/5 text-white ${
                        index === 0 ? 'bg-yellow-500/20' : 
                        index === 1 ? 'bg-gray-400/20' : 
                        index === 2 ? 'bg-amber-600/20' : 
                        'hover:bg-white/5'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {index < 3 ? (
                            <span className="mr-2 text-xl">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </span>
                          ) : null}
                          {entry.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">{entry.username}</td>
                      <td className="px-6 py-4 text-right font-bold">{entry.score.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">{entry.gamesPlayed}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;