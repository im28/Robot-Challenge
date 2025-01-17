export type Position = { x: number; y: number };
export type Dimensions = { height: number; width: number };

export interface Board {
  getDimensions(): Dimensions;
  canPlace(position: Position): boolean;
  addObstacle(position: Position): boolean;
}

export class BasicBoard implements Board {
  constructor(private height: number = 5, private width: number = 5) {}

  obstacles = new Set<string>();

  getDimensions(): Dimensions {
    return { height: this.height, width: this.width };
  }

  canPlace(position: Position): boolean {
    // check if position is within bounds
    const isWithinBounds =
      position.x >= 0 &&
      position.x < this.width &&
      position.y >= 0 &&
      position.y < this.height;

    // check if position is not occupied by an obstacle
    const isNotOccupied = !this.obstacles.has(JSON.stringify(position));
    return isWithinBounds && isNotOccupied;
  }

  addObstacle(position: Position): boolean {
    const positionString = JSON.stringify(position);
    const isAlreadyOccupied = this.obstacles.has(positionString);
    this.obstacles.add(positionString);
    return isAlreadyOccupied;
  }
}
