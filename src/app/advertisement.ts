export class Advertisement {
  id: number;
  caption: string;
  user_id: number;
  name: string;
  position: Position;
}

interface Position {
  x: number;
  y: number;
}
