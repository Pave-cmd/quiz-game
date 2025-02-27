// src/services/storageService.ts
import { api } from '../config/mongodb';
import { UserStats, CategoryStats } from '../shared/types';

// Pomocná třída pro offline cache
class OfflineCache {
  private readonly CACHE_PREFIX = 'quiz_offline_';

  async set(key: string, data: any): Promise<void> {
    try {
      localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Cache save error:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.CACHE_PREFIX + key);
      if (!item) return null;
      
      const { data, timestamp } = JSON.parse(item);
      // Data starší než 24 hodin považujeme za neplatná
      if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(this.CACHE_PREFIX + key);
        return null;
      }
      
      return data as T;
    } catch {
      return null;
    }
  }
}

const offlineCache = new OfflineCache();

class StorageService {
  async getUserStats(): Promise<UserStats> {
    const token = localStorage.getItem('quiz_auth_token');
    if (!token) {
      throw new Error('Uživatel není přihlášen');
    }
  
    try {
      const response = await api.get<UserStats>('/stats/user');
      await offlineCache.set('user_stats', response.data);
      return response.data;
    } catch (error) {
      const cachedStats = await offlineCache.get<UserStats>('user_stats');
      if (cachedStats) return cachedStats;
      throw error;
    }
  }

  async updateUserStats(newStats: Partial<UserStats>): Promise<void> {
    const token = localStorage.getItem('quiz_auth_token');
    if (!token) {
      throw new Error('Uživatel není přihlášen');
    }

    try {
      await api.patch('/stats/user', newStats);
      // Aktualizujeme i offline cache
      const currentStats = await offlineCache.get<UserStats>('user_stats');
      if (currentStats) {
        await offlineCache.set('user_stats', { ...currentStats, ...newStats });
      }
    } catch (error) {
      // Pokud jsme offline, uložíme změny do fronty pro pozdější synchronizaci
      await this.queueOfflineChange('user_stats', newStats);
      throw error;
    }
  }

  // Statistiky kategorií
  async getCategoryStats(categoryId: string): Promise<CategoryStats> {
    const token = localStorage.getItem('quiz_auth_token');
    if (!token) {
      throw new Error('Uživatel není přihlášen');
    }

    try {
      const response = await api.get<CategoryStats>(`/stats/category/${categoryId}`);
      await offlineCache.set(`category_stats_${categoryId}`, response.data);
      return response.data;
    } catch (error) {
      const cachedStats = await offlineCache.get<CategoryStats>(`category_stats_${categoryId}`);
      if (cachedStats) return cachedStats;
      throw error;
    }
  }

  async updateCategoryStats(categoryId: string, score: number): Promise<void> {
    const token = localStorage.getItem('quiz_auth_token');
    if (!token) {
      throw new Error('Uživatel není přihlášen');
    }

    try {
      await api.patch(`/stats/category/${categoryId}`, { score });
      // Aktualizujeme cache
      const currentStats = await offlineCache.get<CategoryStats>(`category_stats_${categoryId}`);
      if (currentStats) {
        const newStats = {
          gamesPlayed: currentStats.gamesPlayed + 1,
          bestScore: Math.max(currentStats.bestScore, score),
          averageScore: Math.round(
            (currentStats.averageScore * currentStats.gamesPlayed + score) /
            (currentStats.gamesPlayed + 1)
          )
        };
        await offlineCache.set(`category_stats_${categoryId}`, newStats);
      }
    } catch (error) {
      await this.queueOfflineChange(`category_stats_${categoryId}`, { score });
      throw error;
    }
  }

  // Nová metoda pro sledování odpovědí pro achievementy
  async trackAnswerForAchievements(data: { timeLeft: number; isCorrect: boolean }): Promise<void> {
    try {
      // Nejprve zkontrolujeme, zda je uživatel přihlášen
      const token = localStorage.getItem('quiz_auth_token');
      if (!token) {
        console.log('Uživatel není přihlášen, nelze sledovat odpovědi');
        return; // Místo vyhození chyby
      }
      
      const currentStats = await this.getUserStats();
      const updatedStats = {
        ...currentStats,
        questionsAnswered: (currentStats.questionsAnswered || 0) + 1,
        correctAnswers: (currentStats.correctAnswers || 0) + (data.isCorrect ? 1 : 0)
      };
      await this.updateUserStats(updatedStats);
    } catch (error) {
      console.error('Error tracking answer:', error);
      // Zachyťte chybu, ale nevyhazujte ji dál
    }
  }

  // Žebříčky
  async getLeaderboard(limit: number = 10): Promise<any[]> {
    try {
      const response = await api.get(`/leaderboard?limit=${limit}`);
      return response.data;
    } catch (error) {
      const cachedLeaderboard = await offlineCache.get<any[]>('leaderboard');
      if (cachedLeaderboard) return cachedLeaderboard;
      throw error;
    }
  }

  // Pro případ, kdy uživatel není přihlášen - vrátí výchozí statistiky
  getDefaultUserStats(): UserStats {
    return {
      highScore: 0,
      gamesPlayed: 0,
      totalScore: 0,
      longestStreak: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      achievements: [],
      lastAchievementCheck: 0,
      levelInfo: {
        currentLevel: 1,
        currentXP: 0,
        xpToNextLevel: 100,
        totalXP: 0
      }
    };
  }

  // Kontrola, zda je uživatel přihlášen
  isLoggedIn(): boolean {
    return !!localStorage.getItem('quiz_auth_token');
  }

  // Správa offline změn
  private async queueOfflineChange(key: string, data: any): Promise<void> {
    const offlineQueue = await this.getOfflineQueue();
    offlineQueue.push({ key, data, timestamp: Date.now() });
    localStorage.setItem('quiz_offline_queue', JSON.stringify(offlineQueue));
  }

  private async getOfflineQueue(): Promise<Array<{ key: string; data: any; timestamp: number }>> {
    try {
      const queue = localStorage.getItem('quiz_offline_queue');
      return queue ? JSON.parse(queue) : [];
    } catch {
      return [];
    }
  }

  // Synchronizace offline změn
  async syncOfflineChanges(): Promise<void> {
    // Kontrola, zda je uživatel přihlášen
    if (!this.isLoggedIn()) {
      return;
    }
    
    const queue = await this.getOfflineQueue();
    if (queue.length === 0) return;

    for (const change of queue) {
      try {
        if (change.key === 'user_stats') {
          await this.updateUserStats(change.data);
        } else if (change.key.startsWith('category_stats_')) {
          const categoryId = change.key.replace('category_stats_', '');
          await this.updateCategoryStats(categoryId, change.data.score);
        }
      } catch (error) {
        console.error('Sync error:', error);
      }
    }

    // Vyčistíme frontu po úspěšné synchronizaci
    localStorage.removeItem('quiz_offline_queue');
  }
}

export const storageService = new StorageService();