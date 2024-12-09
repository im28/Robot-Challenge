// Type definitions to support our tests
export type Orientation = "NORTH" | "SOUTH" | "EAST" | "WEST";
export type Position = { x: number; y: number };
export type Dimensions = { height: number; width: number };
export type OrientedPosition = { x: number; y: number; facing: Orientation };

const rotateLeftMap: Record<Orientation, Orientation> = {
  ["NORTH"]: "WEST",
  ["WEST"]: "SOUTH",
  ["SOUTH"]: "EAST",
  ["EAST"]: "NORTH",
};
const rotateRightMap: Record<Orientation, Orientation> = {
  ["NORTH"]: "EAST",
  ["EAST"]: "SOUTH",
  ["SOUTH"]: "WEST",
  ["WEST"]: "NORTH",
};

interface CoordinateSystemConfig {
  originX: number;
  originY: number;
  yAxisDirection: "UP" | "DOWN";
}
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
    return position.x >= 0 && position.x < 5 && position.y >= 0 &&
      position.y < 5;
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
  place(x: number, y: number, facing: Orientation): void;
  move(): void;
  left(): void;
  right(): void;
  report(): OrientedPosition;
  processCommand(command: string): void;
}

export class RobotError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RobotError";
  }
}

export class ToyRobot implements Robot {
  private orientedPosition: OrientedPosition = {
    x: NaN,
    y: NaN,
    facing: "NORTH",
  };
  constructor(private board: Board) {}

  place(x: number, y: number, facing: Orientation): void {
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      throw new RobotError("Coordinates must be integers");
    }
    if (!this.board.canPlace({ x, y })) {
      throw new RobotError(
        `Invalid position: (${x}, ${y}) is outside the table boundaries`,
      );
    }

    this.orientedPosition = { x, y, facing };
  }
  move(): void {
    let { x, y, facing } = this.orientedPosition;
    switch (facing) {
      case "NORTH":
        y += 1;
        break;
      case "SOUTH":
        y -= 1;
        break;
      case "EAST":
        x += 1;
        break;
      case "WEST":
        x -= 1;
        break;
    }

    if (!this.board.canPlace({ x, y })) {
      throw new RobotError(
        `Invalid position: (${x}, ${y}) is outside the table boundaries`,
      );
    }

    this.orientedPosition = { x, y, facing };
  }
  left(): void {
    this.orientedPosition = {
      ...this.orientedPosition,
      facing: rotateLeftMap[this.orientedPosition.facing],
    };
  }
  right(): void {
    this.orientedPosition = {
      ...this.orientedPosition,
      facing: rotateRightMap[this.orientedPosition.facing],
    };
  }
  report(): OrientedPosition {
    return this.orientedPosition;
  }
  processCommand(command: string): void {
    throw new Error("Not implemented");
  }
}
