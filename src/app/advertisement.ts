export class Advertisement {
  id: string;
  caption: string;
  userId: number;
  name: string;
  position: Position;
}

interface Position {
  x: number;
  y: number;
}
