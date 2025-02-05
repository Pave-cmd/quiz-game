import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";
import Menu from "./components/Menu";
import Categories from "./components/Categories";
import Game from "./components/game/Game";
import Leaderboard from "./components/Leaderboard";
import AllCategories from "./components/AllCategories";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Menu />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/game/all" element={<AllCategories />} />
      <Route path="/game/:categoryId" element={<Game />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;