// src/components/game/Game.tsx
import GameContainer from './GameContainer';
import BackToMenu from '../BackToMenu';

const Game = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
    <BackToMenu />
    <GameContainer />
  </div>
);

export default Game;