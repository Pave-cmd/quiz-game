import { gamingQuestions } from "./gaming";
import { techQuestions } from "./tech";
import { Question } from "../../shared/types";
import { moviesSeriesQuestions } from "./moviesSeries";
import { travelQuestions } from "./travel";
import { musicQuestions } from "./music";
import { artQuestions } from "./art";
import { sportsQuestions } from "./sports"; // Změneno ze "sport" na "sports"
import { healthQuestions } from "./health";
import { scienceQuestions } from "./science";
import { mathQuestions } from "./math";
// Import dalších kategorií...

export const allQuestions: Question[] = [
  ...techQuestions,
  ...gamingQuestions,
  ...moviesSeriesQuestions,
  ...travelQuestions,
  ...musicQuestions,
  ...artQuestions,
  ...sportsQuestions,
  ...healthQuestions,
  ...scienceQuestions,
  ...mathQuestions,
  // Přidání dalších kategorií...
];

// Export jednotlivých kategorií pro možnost přímého použití
export { techQuestions } from "./tech";
export { gamingQuestions } from "./gaming";
// Export dalších kategorií...
