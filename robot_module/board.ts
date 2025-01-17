export type Position = { x: number; y: number };
export type Dimensions = { height: number; width: number };

export interface Board {
  getDimensions(): Dimensions;
  canPlace(position: Position): boolean;
  addObstacle(position: Position): boolean;
  findPath(start: Position, goal: Position): Position[];
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

  findPath(start: Position, goal: Position): Position[] {
    const positions: Position[] = [];

    const matrix = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    this.obstacles.forEach((obstacle) => {
      const { x, y } = JSON.parse(obstacle);
      matrix[y][x] = 1;
    });

    const queue = [[start]];

    // while queue is not empty
    while (queue.length) {
      const current = queue.shift();
      if (!current) {
        break;
      }

      const { x, y } = current.at(-1)!;

      // check if current position is the goal
      if (x === goal.x && y === goal.y) {
        positions.push(...current);
        break;
      }

      // mark current position as visited
      matrix[y][x] = 1;

      // check if adjacent positions are valid
      const adjacentPositions = [
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
        { x, y: y + 1 },
      ];

      for (const position of adjacentPositions) {
        const { x, y } = position;
        if (
          x >= 0 &&
          x < this.width &&
          y >= 0 &&
          y < this.height &&
          matrix[y][x] !== 1
        ) {
          queue.push([...current, position]);
        }
      }
    }

    return positions.shift() ? positions : [];
  }
}
