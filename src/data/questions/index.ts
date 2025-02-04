import { Question } from "../../types";
import { techQuestions } from "./tech";
import { gamingQuestions } from "./gaming";
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
