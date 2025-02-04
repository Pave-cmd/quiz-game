import { Question } from "../../types";

export const gamingQuestions: Question[] = [
  {
    id: 1,
    question: "Která hra je nejprodávanější videohrou všech dob?",
    options: ["Minecraft", "Tetris", "GTA V", "Wii Sports"],
    correctAnswer: 0,
    category: "gaming",
    difficulty: "easy",
    points: 100
  },
  {
    id: 2,
    question: "Ve kterém roce vyšla první hra série The Legend of Zelda?",
    options: ["1981", "1983", "1986", "1989"],
    correctAnswer: 2,
    category: "gaming",
    difficulty: "medium",
    points: 200
  },
  {
    id: 3,
    question: "Která společnost vyvinula hru Fortnite?",
    options: ["Valve", "Epic Games", "EA", "Ubisoft"],
    correctAnswer: 1,
    category: "gaming",
    difficulty: "easy",
    points: 100
  },
  {
    id: 4,
    question: "Jak se jmenuje hlavní postava série Mario?",
    options: ["Mario Mario", "Super Mario", "Mario Bros", "Mario Nintendo"],
    correctAnswer: 0,
    category: "gaming",
    difficulty: "medium",
    points: 200
  },
  {
    id: 5,
    question: "Která herní konzole se prodávala nejlépe v historii?",
    options: ["Nintendo DS", "PlayStation 2", "Game Boy", "PlayStation 4"],
    correctAnswer: 1,
    category: "gaming",
    difficulty: "medium",
    points: 200
  }
];
