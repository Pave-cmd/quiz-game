
import { Question } from "../../types";

const shuffleQuestions = (questions: Question[]): Question[] => {
 return [...questions].sort(() => Math.random() - 0.5);
};

// Lehké otázky (20)
const easyTechQuestions: Question[] = [
 {
   id: 1,
   question: "Co znamená zkratka PC?",
   options: ["Personal Computer", "Program Counter", "Primary Computer", "Processing Center"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 2,
   question: "Který z těchto není webový prohlížeč?",
   options: ["Chrome", "Firefox", "Excel", "Safari"],
   correctAnswer: 2,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 3,
   question: "Co je to myš?",
   options: ["Vstupní zařízení", "Výstupní zařízení", "Procesor", "Paměť"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 4,
   question: "K čemu slouží klávesnice?",
   options: ["Ke vkládání textu", "K tisku dokumentů", "K zobrazování obrazu", "K přehrávání zvuku"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 5,
   question: "Co je to monitor?",
   options: ["Výstupní zařízení", "Vstupní zařízení", "Úložiště dat", "Procesor"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 6,
   question: "Který z těchto formátů je obrazový?",
   options: ["JPG", "MP3", "DOC", "PDF"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 7,
   question: "Co je to Wi-Fi?",
   options: ["Bezdrátové připojení", "Typ kabelu", "Operační systém", "Procesor"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 8,
   question: "K čemu slouží USB port?",
   options: ["K připojení zařízení", "K napájení počítače", "K zobrazování obrazu", "K tisku"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 9,
   question: "Co je to soubor?",
   options: ["Uložená data", "Program", "Webová stránka", "Procesor"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 10,
   question: "K čemu slouží tiskárna?",
   options: ["K tisku dokumentů", "K připojení k internetu", "K ukládání dat", "K přehrávání hudby"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 11,
   question: "Co je to spam?",
   options: ["Nevyžádaná pošta", "Počítačový virus", "Internetový prohlížeč", "Sociální síť"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 12,
   question: "Co je to emotikon?",
   options: ["Smajlík", "Webová stránka", "Program", "Soubor"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 13,
   question: "K čemu slouží webkamera?",
   options: ["K video hovorům", "K tisku", "K přehrávání hudby", "K ukládání dat"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 14,
   question: "Co je to desktop?",
   options: ["Plocha počítače", "Internetový prohlížeč", "Typ souboru", "Email"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 15,
   question: "K čemu slouží heslo?",
   options: ["K ochraně dat", "K připojení k internetu", "K tisku", "K přehrávání hudby"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 16,
   question: "Co je to ikona?",
   options: ["Symbol programu", "Typ souboru", "Internetová stránka", "Procesor"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 17,
   question: "K čemu slouží reproduktory?",
   options: ["K přehrávání zvuku", "K tisku", "K ukládání dat", "K připojení k internetu"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 18,
   question: "Co je to Bluetooth?",
   options: ["Bezdrátová technologie", "Internetový prohlížeč", "Typ souboru", "Program"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 19,
   question: "K čemu slouží kalkulačka?",
   options: ["K počítání", "K psaní textu", "K prohlížení internetu", "K přehrávání hudby"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 },
 {
   id: 20,
   question: "Co je to aplikace?",
   options: ["Program", "Hardware", "Internetová stránka", "Typ souboru"],
   correctAnswer: 0,
   category: "tech",
   difficulty: "easy",
   points: 100
 }
];

// Středně těžké otázky (20)
const mediumTechQuestions: Question[] = [
 {
   id: 21,
   question: "Co je to cloud computing?",
   options: [
     "Poskytování služeb přes internet",
     "Typ procesoru",
     "Způsob ukládání dat na CD",
     "Software pro předpověď počasí"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 22,
   question: "Co je to firewall?",
   options: [
     "Bezpečnostní systém",
     "Typ procesoru",
     "Grafická karta",
     "Internetový prohlížeč"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 23,
   question: "Co znamená zkratka VPN?",
   options: [
     "Virtual Private Network",
     "Visual Processing Node",
     "Virtual Program Network",
     "Video Processing Network"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 24,
   question: "Co je to malware?",
   options: [
     "Škodlivý software",
     "Typ hardwaru",
     "Operační systém",
     "Internetový protokol"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 25,
   question: "Co je to algoritmus?",
   options: [
     "Postup řešení problému",
     "Typ počítače",
     "Programovací jazyk",
     "Hardware"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 26,
   question: "Co je to databáze?",
   options: [
     "Organizovaná sbírka dat",
     "Typ procesoru",
     "Grafická karta",
     "Operační systém"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 27,
   question: "Co znamená zkratka SQL?",
   options: [
     "Structured Query Language",
     "System Quality Language",
     "Simple Question Language",
     "System Query Logic"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 28,
   question: "Co je to cache?",
   options: [
     "Vyrovnávací paměť",
     "Typ procesoru",
     "Internetový protokol",
     "Operační systém"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 29,
   question: "Co je to server?",
   options: [
     "Počítač poskytující služby",
     "Typ monitoru",
     "Programovací jazyk",
     "Grafická karta"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 30,
   question: "Co je to router?",
   options: [
     "Směrovač dat",
     "Typ procesoru",
     "Program pro psaní",
     "Grafická karta"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 31,
   question: "Co je to backup?",
   options: [
     "Záloha dat",
     "Typ procesoru",
     "Internetový protokol",
     "Operační systém"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 32,
   question: "Co znamená zkratka LAN?",
   options: [
     "Local Area Network",
     "Large Area Network",
     "Local Access Node",
     "Linear Array Network"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 33,
   question: "Co je to pixel?",
   options: [
     "Obrazový bod",
     "Typ procesoru",
     "Programovací jazyk",
     "Internetový protokol"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 34,
   question: "Co je to hosting?",
   options: [
     "Poskytování prostoru na serveru",
     "Typ procesoru",
     "Program pro psaní",
     "Grafická karta"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 35,
   question: "Co je to domain?",
   options: [
     "Internetová doména",
     "Typ procesoru",
     "Program pro psaní",
     "Grafická karta"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 36,
   question: "Co je to encryption?",
   options: [
     "Šifrování dat",
     "Typ procesoru",
     "Internetový protokol",
     "Operační systém"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 37,
   question: "Co je to bandwidth?",
   options: [
     "Šířka pásma",
     "Typ procesoru",
     "Program pro psaní",
     "Grafická karta"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 38,
   question: "Co je to browser?",
   options: [
     "Internetový prohlížeč",
     "Typ procesoru",
     "Program pro psaní",
     "Grafická karta"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 39,
   question: "Co je to software?",
   options: [
     "Programové vybavení",
     "Fyzické vybavení",
     "Internetový protokol",
     "Typ procesoru"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 },
 {
   id: 40,
   question: "Co je to hardware?",
   options: [
     "Fyzické vybavení",
     "Programové vybavení",
     "Internetový protokol",
     "Operační systém"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "medium",
   points: 200
 }
];

// Těžké otázky (10)
const hardTechQuestions: Question[] = [
 {
   id: 41,
   question: "Co je to kvantové počítání?",
   options: [
     "Výpočty založené na kvantových stavech",
     "Velmi rychlý klasický počítač",
     "Nový programovací jazyk",
     "Metoda šifrování dat"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "hard",
   points: 300
 },
 {
   id: 42,
   question: "Co je to blockchain?",
   options: [
     "Decentralizovaný systém záznamů",
     "Typ procesoru",
     "Nový programovací jazyk",
     "Metoda komprese dat"
   ],
   correctAnswer: 0,
   category: "tech",
   difficulty: "hard",
   points: 300
 },
 {
   id: 43,
   question: "Co je to machine learning?",
   options: [
    "Strojové učení",
    "Typ procesoru",
    "Operační systém",
    "Hardware pro výuku"
  ],
  correctAnswer: 0,
  category: "tech",
  difficulty: "hard",
  points: 300
},
{
  id: 44,
  question: "Co je to virtualizace?",
  options: [
    "Vytvoření virtuálního prostředí",
    "3D grafika",
    "Typ procesoru",
    "Způsob ukládání dat"
  ],
  correctAnswer: 0,
  category: "tech",
  difficulty: "hard",
  points: 300
},
{
  id: 45,
  question: "Co je to kryptografie?",
  options: [
    "Věda o šifrování",
    "Typ procesoru",
    "Programovací jazyk",
    "Metoda komprese dat"
  ],
  correctAnswer: 0,
  category: "tech",
  difficulty: "hard",
  points: 300
},
{
  id: 46,
  question: "Co je to neuronová síť?",
  options: [
    "Model inspirovaný mozkem",
    "Typ počítačové sítě",
    "Hardware pro AI",
    "Nový internet"
  ],
  correctAnswer: 0,
  category: "tech",
  difficulty: "hard",
  points: 300
},
{
  id: 47,
  question: "Co je to DevOps?",
  options: [
    "Spojení vývoje a provozu",
    "Nový programovací jazyk",
    "Typ databáze",
    "Operační systém"
  ],
  correctAnswer: 0,
  category: "tech",
  difficulty: "hard",
  points: 300
},
{
  id: 48,
  question: "Co je to mikroservisní architektura?",
  options: [
    "Styl návrhu softwaru",
    "Typ procesoru",
    "Hardware pro servery",
    "Metoda komprese"
  ],
  correctAnswer: 0,
  category: "tech",
  difficulty: "hard",
  points: 300
},
{
  id: 49,
  question: "Co je to asymetrická kryptografie?",
  options: [
    "Šifrování s veřejným a soukromým klíčem",
    "Jednostranné šifrování",
    "Typ procesoru",
    "Metoda komprese"
  ],
  correctAnswer: 0,
  category: "tech",
  difficulty: "hard",
  points: 300
},
{
  id: 50,
  question: "Co je to quantum entanglement?",
  options: [
    "Kvantové provázání",
    "Typ procesoru",
    "Způsob ukládání dat",
    "Síťový protokol"
  ],
  correctAnswer: 0,
  category: "tech",
  difficulty: "hard",
  points: 300
}
];

// Spojení všech otázek do jednoho pole
const allTechQuestions = [
...easyTechQuestions,
...mediumTechQuestions,
...hardTechQuestions
];

// Export funkcí pro různé způsoby získání otázek
export const getTechQuestions = (count: number = 10, difficulty?: 'easy' | 'medium' | 'hard') => {
let questions = allTechQuestions;

if (difficulty) {
  questions = questions.filter(q => q.difficulty === difficulty);
}

return shuffleQuestions(questions).slice(0, count);
};

export const getProgressiveTechQuestions = (count: number = 10) => {
const easyCount = Math.floor(count * 0.4);  // 40% lehkých
const mediumCount = Math.floor(count * 0.4); // 40% středních
const hardCount = count - easyCount - mediumCount; // zbytek těžkých

return [
  ...shuffleQuestions(easyTechQuestions).slice(0, easyCount),
  ...shuffleQuestions(mediumTechQuestions).slice(0, mediumCount),
  ...shuffleQuestions(hardTechQuestions).slice(0, hardCount)
];
};

export const techQuestions = allTechQuestions;