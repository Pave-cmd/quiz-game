import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";

import AllCategories from "./components/AllCategories";
import Auth from "./components/Auth";
import Categories from "./components/Categories";
import Game from "./components/game/Game";
import Leaderboard from "./components/Leaderboard";
import Menu from "./components/Menu";
import UserInfo from "./components/UserInfo";

// Poznámka: Odstraněna nepoužívaná komponenta ProtectedRoute, protože přihlášení je nyní volitelné

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Auth />} />
      <Route path="/" element={<Menu />} /> 
      <Route path="/categories" element={<Categories />} />
      <Route path="/game/all" element={<AllCategories />} />
      <Route path="/game/:categoryId" element={<Game />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </>
  )
);

const App = (): JSX.Element => {
  return (
    <>
      <UserInfo />
      <RouterProvider router={router} />
    </>
  );
};

export default App;