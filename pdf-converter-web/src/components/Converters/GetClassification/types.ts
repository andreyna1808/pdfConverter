export interface ScoreData {
  [key: string]: number | undefined;
}

export interface RowData {
  position: number;
  name: string;
  registrationNumber: string;
  scores?: ScoreData;
  totalScore: number;
  isEliminated: boolean;
  status: string;
}
