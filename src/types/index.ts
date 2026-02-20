export interface Category {
  name: string;
  items: string[];
}

export interface Winner {
  category: string;
  item: string;
}

export type GameStatus = 'setup' | 'active' | 'completed';

export interface Game {
  id: string;
  status: GameStatus;
  createdAt: string;
  participants: string[];
  categories: Category[];
  winners: Winner[];
}

export interface LibraryItem {
  id: string;
  category: string;
  text: string;
  createdAt: string;
}
