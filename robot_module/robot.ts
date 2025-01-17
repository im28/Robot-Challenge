import type { Board, Position } from "./board.ts";

export type Orientation = "NORTH" | "SOUTH" | "EAST" | "WEST";
export type OrientedPosition = Position & { facing: Orientation };

export interface Robot {
  place({ x, y, facing }: OrientedPosition): void;
  move(): void;
  left(): void;
  right(): void;
  report(): OrientedPosition;
}

export class RobotError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RobotError";
  }
}

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

export class PlacedRobot implements Robot {
  constructor(private board: Board, private orientedPosition: OrientedPosition) {
    this.place(orientedPosition);
  }

  place({ x, y, facing }: OrientedPosition): void {
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      throw new RobotError("Coordinates must be integers");
    }
    if (!this.board.canPlace({ x, y })) {
      throw new RobotError(
        `Invalid position: (${x}, ${y}) is outside the table boundaries or occupied by an obstacle`,
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
        `Invalid position: (${x}, ${y}) is outside the table boundaries or occupied by an obstacle`,
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
}
