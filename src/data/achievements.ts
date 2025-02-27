import {
    WorkspacePremium,
    LocalFireDepartment,
    EmojiEvents,
    Psychology,
    School,
    Explore,
    Star,
    Public,
    Speed,
    Timer
  } from '@mui/icons-material';

  import { Achievement, AchievementCategory, UserStats, CategoryStats } from '../shared/types';
  
  export const achievementCategories: AchievementCategory[] = [
    {
      id: 'milestones',
      name: 'Milníky',
      icon: WorkspacePremium,
      color: 'from-yellow-400 to-amber-600'
    },
    {
      id: 'streaks',
      name: 'Série',
      icon: LocalFireDepartment,
      color: 'from-orange-400 to-red-600'
    },
    {
      id: 'categories',
      name: 'Kategorie',
      icon: Explore,
      color: 'from-blue-400 to-indigo-600'
    },
    {
      id: 'special',
      name: 'Speciální',
      icon: Star,
      color: 'from-purple-400 to-pink-600'
    }
  ];
  
  export const achievements: Achievement[] = [
    // Milníky
    {
      id: 'first_game',
      name: 'První krok',
      description: 'Dokončete svou první hru',
      category: 'milestones',
      icon: EmojiEvents,
      condition: (stats: UserStats) => stats.gamesPlayed >= 1,
      rarity: 'common'
    },
    {
      id: 'score_100',
      name: 'Stovkař',
      description: 'Získejte celkové skóre 100 bodů',
      category: 'milestones',
      icon: EmojiEvents,
      condition: (stats: UserStats) => stats.totalScore >= 100,
      rarity: 'common'
    },
    {
      id: 'score_1000',
      name: 'Tisícovkář',
      description: 'Získejte celkové skóre 1000 bodů',
      category: 'milestones',
      icon: EmojiEvents,
      condition: (stats: UserStats) => stats.totalScore >= 1000,
      rarity: 'rare'
    },
  
    // Série
    {
      id: 'streak_5',
      name: 'Malá série',
      description: 'Dosáhněte série 5 správných odpovědí',
      category: 'streaks',
      icon: LocalFireDepartment,
      condition: (stats: UserStats) => stats.longestStreak >= 5,
      rarity: 'common'
    },
    {
      id: 'streak_10',
      name: 'Velká série',
      description: 'Dosáhněte série 10 správných odpovědí',
      category: 'streaks',
      icon: LocalFireDepartment,
      condition: (stats: UserStats) => stats.longestStreak >= 10,
      rarity: 'rare'
    },
    {
      id: 'streak_20',
      name: 'Neporazitelný',
      description: 'Dosáhněte série 20 správných odpovědí',
      category: 'streaks',
      icon: LocalFireDepartment,
      condition: (stats: UserStats) => stats.longestStreak >= 20,
      rarity: 'epic'
    },
  
    // Kategorie
    {
      id: 'category_master',
      name: 'Mistr kategorie',
      description: 'Získejte perfektní skóre v jedné kategorii',
      category: 'categories',
      icon: School,
      condition: (_stats: UserStats, categoryStats?: Record<string, CategoryStats>) => 
        categoryStats ? Object.values(categoryStats).some(cat => cat?.bestScore >= 100) : false,
      rarity: 'rare'
    },
    {
      id: 'explorer',
      name: 'Průzkumník',
      description: 'Zahrajte si všechny kategorie',
      category: 'categories',
      icon: Public,
      condition: (_stats: UserStats, categoryStats?: Record<string, CategoryStats>) => 
        categoryStats ? Object.keys(categoryStats).length >= 5 : false,
      rarity: 'epic'
    },
  
    // Speciální
    {
      id: 'speed_demon',
      name: 'Rychlík',
      description: 'Odpovězte správně pod 3 sekundy',
      category: 'special',
      icon: Speed,
      condition: () => false, // Speciální podmínka kontrolovaná v Game komponentě
      rarity: 'rare'
    },
    {
      id: 'perfect_timing',
      name: 'Perfektní načasování',
      description: 'Odpovězte správně v poslední sekundě',
      category: 'special',
      icon: Timer,
      condition: () => false, // Speciální podmínka kontrolovaná v Game komponentě
      rarity: 'epic'
    },
    {
      id: 'genius',
      name: 'Génius',
      description: 'Získejte perfektní skóre v těžké kategorii',
      category: 'special',
      icon: Psychology,
      condition: (_stats: UserStats, categoryStats?: Record<string, CategoryStats>) => 
        categoryStats ? Object.entries(categoryStats).some(([_, cat]) => 
          cat?.bestScore >= 100 && cat?.difficulty === 'hard') : false,
      rarity: 'legendary'
    }
  ];