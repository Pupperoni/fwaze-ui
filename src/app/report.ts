export class Report {
  id: number;
  type: number;
  position: Position;
  user_id: number;
  name: string;
  votes: number;
}

interface Position {
  x: number;
  y: number;
}
