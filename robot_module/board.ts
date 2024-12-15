export type Position = { x: number; y: number };
export type Dimensions = { height: number; width: number };

export interface Board {
  getDimensions(): Dimensions;
  canPlace(position: Position): boolean;
}

export class BasicBoard implements Board {
  constructor(private height: number = 5, private width: number = 5) {}

  getDimensions(): Dimensions {
    return { height: this.height, width: this.width };
  }

  canPlace(position: Position): boolean {
    // check if position is within bounds
    return (
      position.x >= 0 &&
      position.x < this.width &&
      position.y >= 0 &&
      position.y < this.height
    );
  }
}
