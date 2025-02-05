import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  stats: {
    highScore: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    questionsAnswered: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    achievements: [String],
    lastAchievementCheck: { type: Number, default: 0 },
    levelInfo: {
      currentLevel: { type: Number, default: 1 },
      currentXP: { type: Number, default: 0 },
      xpToNextLevel: { type: Number, default: 100 },
      totalXP: { type: Number, default: 0 }
    }
  },
  categoryStats: [{
    categoryId: String,
    gamesPlayed: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 }
  }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.model('User', userSchema);
