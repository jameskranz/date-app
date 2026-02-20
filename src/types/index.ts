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

export interface GameRepository {
  save(game: Game): Promise<Game>;
  get(id: string): Promise<Game | undefined>;
  list(filter?: { status?: string }): Promise<Game[]>;
  subscribe?(listener: () => void): () => void;
}

export interface LibraryItem {
  id: string;
  category: string;
  text: string;
  createdAt: string;
}

export interface LibraryRepository {
  getAllItems(): Promise<LibraryItem[]>;
  getLibrary(category: string): Promise<LibraryItem[]>;
  addItem(category: string, text: string): Promise<LibraryItem>;
  removeItem(id: string): Promise<void>;
  updateItem(id: string, changes: Partial<LibraryItem>): Promise<LibraryItem | undefined>;
}
