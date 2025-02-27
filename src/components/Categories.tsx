import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { categories } from '../data/categories';
import BackToMenu from './BackToMenu';

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
      <BackToMenu />
      
      <div className="mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-xl">
            <div className="min-w-[300px] flex-1">
              <input
                type="text"
                placeholder="Hledat kategorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            
            <div className="flex gap-2">
              {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setDifficultyFilter(difficulty)}
                  className={`rounded-xl px-4 py-2 transition-all ${
                    difficultyFilter === difficulty
                      ? 'bg-white font-bold text-purple-600'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {difficulty === 'all' ? 'Vše' : difficulty}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <div className={`bg-gradient-to-r ${category.color} h-full rounded-2xl border border-white/10 bg-opacity-90 p-6 shadow-xl backdrop-blur-sm`}>
                  <div className="flex items-start justify-between">
                    <category.icon className="size-8 text-white/90" strokeWidth={1.5} />
                    <span className={`rounded-full px-3 py-1 text-sm ${
                      category.difficulty === 'easy' ? 'bg-green-500/20' :
                      category.difficulty === 'medium' ? 'bg-yellow-500/20' :
                      'bg-red-500/20'
                    } text-white`}>
                      {category.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="mb-2 mt-4 text-2xl font-bold text-white">{category.name}</h3>
                  <p className="mb-4 text-sm text-white/80">{category.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm text-white/90">
                      {category.questionsCount} otázek
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/90">
                        Úspěšnost: 75%
                      </span>
                      <div className="h-2 w-20 rounded-full bg-white/20">
                        <div className="h-full w-3/4 rounded-full bg-white"/>
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
            className="mt-12 text-center text-xl text-white"
          >
            Žádné kategorie neodpovídají vašemu vyhledávání
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Categories;