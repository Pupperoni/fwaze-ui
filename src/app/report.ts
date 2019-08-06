export class Report {
  id: string;
  type: number;
  position: Position;
  latitude: number;
  longitude: number;
  user_id: number;
  name: string;
  votes: number;
}

interface Position {
  x: number;
  y: number;
}
