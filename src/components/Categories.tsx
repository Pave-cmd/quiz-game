import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../data/categories';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || category.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between bg-white/10 backdrop-blur-xl p-4 rounded-2xl">
            <div className="flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="Hledat kategorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            
            <div className="flex gap-2">
              {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setDifficultyFilter(difficulty)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    difficultyFilter === difficulty
                      ? 'bg-white text-purple-600 font-bold'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {difficulty === 'all' ? 'Vše' : difficulty}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => navigate(`/game/${category.id}`)}
              >
                <div className={`bg-gradient-to-r ${category.color} rounded-2xl p-6 h-full backdrop-blur-sm bg-opacity-90 border border-white/10 shadow-xl`}>
                  <div className="flex items-start justify-between">
                    <category.icon className="w-8 h-8 text-white/90" strokeWidth={1.5} />
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      category.difficulty === 'easy' ? 'bg-green-500/20' :
                      category.difficulty === 'medium' ? 'bg-yellow-500/20' :
                      'bg-red-500/20'
                    } text-white`}>
                      {category.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 mt-4">{category.name}</h3>
                  <p className="text-white/80 mb-4 text-sm">{category.description}</p>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-white/90 text-sm">
                      {category.questionsCount} otázek
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/90 text-sm">
                        Úspěšnost: 75%
                      </span>
                      <div className="w-20 h-2 bg-white/20 rounded-full">
                        <div className="w-3/4 h-full bg-white rounded-full"/>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white text-xl mt-12"
          >
            Žádné kategorie neodpovídají vašemu vyhledávání
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Categories;