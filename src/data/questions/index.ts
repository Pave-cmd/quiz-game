import { gamingQuestions } from "./gaming";
import { techQuestions } from "./tech";
import { Question } from "../../shared/types";
// Import dalších kategorií...

export const allQuestions: Question[] = [
  ...techQuestions,
  ...gamingQuestions,
  // Přidání dalších kategorií...
];

// Export jednotlivých kategorií pro možnost přímého použití
export { techQuestions } from "./tech";
export { gamingQuestions } from "./gaming";
// Export dalších kategorií...
