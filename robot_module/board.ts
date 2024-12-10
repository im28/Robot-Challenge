export type Position = { x: number; y: number };
export type Dimensions = { height: number; width: number };

export interface Board {
  getDimensions(): Dimensions;
  canPlace(position: Position): boolean;
}

export class BasicBoard implements Board {
  getDimensions(): Dimensions {
    return { height: 5, width: 5 };
  }
  
  canPlace(position: Position): boolean {
    // check if position is within bounds
    return position.x >= 0 && position.x < 5 && position.y >= 0 && position.y < 5;
  }
}
