export interface GameState {
  id: string;
  board: (string | null)[];
  currentPlayer: 'X' | 'O';
  winner: string | null;
  movesCount: number;
  isFinished: boolean;
}
