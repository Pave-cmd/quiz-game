import { Category } from '../shared/types';
import {
  // Tech & Gaming
  RocketLaunchOutlined,
  SportsEsportsOutlined,
  
  // Kultura & Umění
  TheaterComedyOutlined,
  MusicNoteOutlined,
  BrushOutlined,
  PhotoCameraOutlined,
  
  // Sport & Zdraví
  SportsSoccerOutlined,
  FitnessCenterOutlined,
  RestaurantOutlined,
  
  // Věda & Vzdělání
  ScienceOutlined,
  CalculateOutlined,
  
  // Zábava & Lifestyle
  MovieOutlined,
  PetsOutlined,
  DirectionsCarOutlined,
  TravelExploreOutlined,
  
  // Příroda & Ekologie
  ParkOutlined,
  
  // Historie & Společnost
  AccountBalanceOutlined,
  PublicOutlined,
} from '@mui/icons-material';

export const categories: Category[] = [
  // Tech & Gaming
  {
    id: 'tech',
    name: 'Technologie',
    icon: RocketLaunchOutlined,
    description: 'Moderní technologie a inovace',
    difficulty: 'medium',
    questionsCount: 20,
    color: 'from-cyan-400 to-blue-600'
  },
  {
    id: 'gaming',
    name: 'Hry',
    icon: SportsEsportsOutlined,
    description: 'Videohry a herní kultura',
    difficulty: 'easy',
    questionsCount: 15,
    color: 'from-indigo-400 to-purple-600'
  },

  // Kultura & Umění
  {
    id: 'movies',
    name: 'Film a Seriály',
    icon: MovieOutlined,
    description: 'Filmový a seriálový svět',
    difficulty: 'easy',
    questionsCount: 20,
    color: 'from-red-400 to-pink-600'
  },
  {
    id: 'music',
    name: 'Hudba',
    icon: MusicNoteOutlined,
    description: 'Hudební žánry a interpreti',
    difficulty: 'medium',
    questionsCount: 20,
    color: 'from-purple-400 to-pink-600'
  },
  
  // Sport & Zdraví
  {
    id: 'sports',
    name: 'Sport',
    icon: SportsSoccerOutlined,
    description: 'Sporty a sportovní události',
    difficulty: 'medium',
    questionsCount: 15,
    color: 'from-green-400 to-emerald-600'
  },
  {
    id: 'health',
    name: 'Zdraví a Fitness',
    icon: FitnessCenterOutlined,
    description: 'Zdravý životní styl a cvičení',
    difficulty: 'easy',
    questionsCount: 18,
    color: 'from-teal-400 to-green-600'
  },

  // Věda & Vzdělání
  {
    id: 'science',
    name: 'Věda',
    icon: ScienceOutlined,
    description: 'Vědecké objevy a zajímavosti',
    difficulty: 'medium',
    questionsCount: 18,
    color: 'from-yellow-400 to-orange-600'
  },
  {
    id: 'math',
    name: 'Matematika',
    icon: CalculateOutlined,
    description: 'Matematické hádanky a problémy',
    difficulty: 'hard',
    questionsCount: 15,
    color: 'from-blue-400 to-indigo-600'
  },

  // Příroda & Zvířata
  {
    id: 'nature',
    name: 'Příroda',
    icon: ParkOutlined,
    description: 'Příroda a ekosystémy',
    difficulty: 'easy',
    questionsCount: 20,
    color: 'from-green-400 to-lime-600'
  },
  {
    id: 'animals',
    name: 'Zvířata',
    icon: PetsOutlined,
    description: 'Zvířecí říše a zajímavosti',
    difficulty: 'easy',
    questionsCount: 20,
    color: 'from-amber-400 to-orange-600'
  },

  // Historie & Geografie
  {
    id: 'history',
    name: 'Historie',
    icon: AccountBalanceOutlined,
    description: 'Historické události a osobnosti',
    difficulty: 'medium',
    questionsCount: 20,
    color: 'from-stone-400 to-slate-600'
  },
  {
    id: 'geography',
    name: 'Geografie',
    icon: PublicOutlined,
    description: 'Země a místa světa',
    difficulty: 'medium',
    questionsCount: 20,
    color: 'from-sky-400 to-blue-600'
  },

  // Lifestyle & Volný čas
  {
    id: 'food',
    name: 'Jídlo a Vaření',
    icon: RestaurantOutlined,
    description: 'Gastronomie a kulinářství',
    difficulty: 'easy',
    questionsCount: 15,
    color: 'from-orange-400 to-red-600'
  },
  {
    id: 'travel',
    name: 'Cestování',
    icon: TravelExploreOutlined,
    description: 'Cestování a světové kultury',
    difficulty: 'easy',
    questionsCount: 20,
    color: 'from-emerald-400 to-teal-600'
  },

  // Umění & Kreativita
  {
    id: 'art',
    name: 'Umění',
    icon: BrushOutlined,
    description: 'Výtvarné umění a architektura',
    difficulty: 'medium',
    questionsCount: 18,
    color: 'from-violet-400 to-purple-600'
  },
  {
    id: 'photography',
    name: 'Fotografie',
    icon: PhotoCameraOutlined,
    description: 'Fotografie a obrazové umění',
    difficulty: 'medium',
    questionsCount: 15,
    color: 'from-neutral-400 to-gray-600'
  },

  // Zábava & Pop kultura
  {
    id: 'entertainment',
    name: 'Zábava',
    icon: TheaterComedyOutlined,
    description: 'Zábava a pop kultura',
    difficulty: 'easy',
    questionsCount: 20,
    color: 'from-fuchsia-400 to-pink-600'
  },
  {
    id: 'cars',
    name: 'Auta a Doprava',
    icon: DirectionsCarOutlined,
    description: 'Automobily a dopravní prostředky',
    difficulty: 'medium',
    questionsCount: 15,
    color: 'from-rose-400 to-red-600'
  }
];