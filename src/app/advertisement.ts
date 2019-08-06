export class Advertisement {
  id: string;
  caption: string;
  user_id: number;
  name: string;
  position: Position;
}

interface Position {
  x: number;
  y: number;
}
