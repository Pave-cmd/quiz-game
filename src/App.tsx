import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Categories from "./components/Categories";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";
import AllCategories from "./components/AllCategories";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/game/all" element={<AllCategories />} />
        <Route path="/game/:categoryId" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
