// Game Constants
export const GAME_CONSTANTS = {
    QUESTION_TIME: 30,         // Čas na odpověď v sekundách
    MAX_QUESTIONS: 20,         // Maximální počet otázek v jedné hře
    MIN_PASS_SCORE: 70,       // Minimální skóre pro úspěšné dokončení (%)
    STREAK_BONUS: 0.5,        // Bonus za streak (50%)
    TIME_BONUS_MULTIPLIER: 0.5 // Násobič bonusu za zbývající čas
  };
  
  // Achievement Constants
  export const ACHIEVEMENT_CONSTANTS = {
    CHECK_COOLDOWN: 1000,     // Cooldown pro kontrolu achievementů (ms)
    SPEED_DEMON_TIME: 3,      // Čas pro "Speed Demon" achievement (sekundy)
    PERFECT_TIMING_TIME: 1    // Čas pro "Perfect Timing" achievement (sekundy)
  };
  
  // Level Constants
  export const LEVEL_CONSTANTS = {
    BASE_XP: 10,              // Základní XP za správnou odpověď
    DIFFICULTY_MULTIPLIERS: {
      easy: 1,
      medium: 1.5,
      hard: 2
    }
  };
  
  // Storage Keys
  export const STORAGE_KEYS = {
    USER_STATS: 'quiz_user_stats',
    CATEGORY_STATS: 'quiz_category_stats',
    AUTH_TOKEN: 'quiz_auth_token',
    OFFLINE_QUEUE: 'quiz_offline_queue'
  };
  
  // API Routes
  export const API_ROUTES = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VERIFY: '/auth/verify'
    },
    STATS: {
      USER: '/stats/user',
      CATEGORY: '/stats/category'
    },
    LEADERBOARD: {
      GLOBAL: '/leaderboard',
      CATEGORY: '/leaderboard/category'
    }
  };
  
  // Error Messages
  export const ERROR_MESSAGES = {
    AUTH: {
      INVALID_CREDENTIALS: 'Nesprávné přihlašovací údaje',
      USER_EXISTS: 'Uživatel již existuje',
      REQUIRED_FIELDS: 'Všechna pole jsou povinná',
      NETWORK_ERROR: 'Chyba připojení k serveru'
    },
    GAME: {
      LOAD_ERROR: 'Nepodařilo se načíst hru',
      SAVE_ERROR: 'Nepodařilo se uložit výsledky',
      NO_QUESTIONS: 'Pro tuto kategorii nejsou k dispozici žádné otázky'
    }
  };
  
  // Animation Constants
  export const ANIMATION_CONSTANTS = {
    POPUP_DURATION: 3000,     // Doba zobrazení popup notifikací (ms)
    FEEDBACK_DURATION: 2000,  // Doba zobrazení feedback zpráv (ms)
    TRANSITION_DURATION: 300  // Doba trvání přechodových animací (ms)
  };