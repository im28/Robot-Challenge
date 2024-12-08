// Type definitions to support our tests
export type Direction = "NORTH" | "SOUTH" | "EAST" | "WEST";
export type Position = { x: number; y: number };
export type Dimensions = { height: number; width: number };
export type OrientedPosition = { x: number; y: number; facing: Direction };

interface CoordinateSystemConfig {
  originX: number;
  originY: number;
  yAxisDirection: "UP" | "DOWN";
}
interface Board {
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

interface RobotReporter {
  report(position: OrientedPosition): void;
}

export class CommandLineRobotReporter implements RobotReporter {
  report(position: OrientedPosition): void {
    console.log(`${position.x},${position.y},${position.facing}`);
  }
}

interface Robot {
  place(x: number, y: number, facing: Direction): void;
  move(): void;
  left(): void;
  right(): void;
  report(): OrientedPosition;
  processCommand(command: string): void;
}

export class ToyRobot implements Robot {
  private orientedPosition: OrientedPosition = { x: NaN, y: NaN, facing: "NORTH" };
  constructor(private reporter: RobotReporter, private board: Board) {}

  place(x: number, y: number, facing: Direction): void {
    if (this.board.canPlace({ x, y })) {
      this.orientedPosition = { x, y, facing };
    } else {
      throw new Error("Cannot place robot outside of table");
    }
  }
  move(): void {
    throw new Error("Not implemented");
  }
  left(): void {
    throw new Error("Not implemented");
  }
  right(): void {
    throw new Error("Not implemented");
  }
  report(): OrientedPosition {
    return this.orientedPosition;
  }
  processCommand(command: string): void {
    throw new Error("Not implemented");
  }
}
