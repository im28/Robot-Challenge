import {
  BasicBoard,
  type Board,
  type Orientation,
  type OrientedPosition,
  PlacedRobot,
  type Position,
} from "@robot/core";
import { CommandLineReportFormatter } from "./reporter.ts";

export type robotSystemOutput = {
  errors: string[];
  outputs: string[];
};

export interface RobotCliSystem {
  executeCommands(command: string[]): robotSystemOutput;
}

export class RobotSystem implements RobotCliSystem {
  private isPlaced = false;
  private placedRobot: PlacedRobot | undefined;
  private reportFormatter = new CommandLineReportFormatter();

  constructor(private board: Board = new BasicBoard()) {}

  executeCommands(commands: string[]) {
    const result: robotSystemOutput = { errors: [], outputs: [] };

    for (let command of commands) {
      command = command.toUpperCase().trim();
      if (command.startsWith("PLACE")) {
        try {
          if (this.isPlaced && this.placedRobot) {
            this.placedRobot.place(this.parsePlaceCommand(command));
            continue;
          }
          this.placedRobot = new PlacedRobot(
            this.board,
            this.parsePlaceCommand(command)
          );
          this.isPlaced = true;
        } catch (e) {
          result.errors.push((e as Error).message);
        }
      } else if (["MOVE", "LEFT", "RIGHT", "REPORT"].includes(command)) {
        try {
          if (this.isPlaced && this.placedRobot) {
            if (command === "MOVE") {
              this.placedRobot.move();
            } else if (command === "LEFT") {
              this.placedRobot.left();
            } else if (command === "RIGHT") {
              this.placedRobot.right();
            } else if (command === "REPORT") {
              result.outputs.push(
                this.reportFormatter.formatOrientedPosition(
                  this.placedRobot.report()
                )
              );
            }
          }
        } catch (error) {
          result.errors.push((error as Error).message);
        }
      } else if (command.startsWith("FIND")) {
        if (this.isPlaced && this.placedRobot) {
          const position = this.parseFindCommand(command);
          if (
            this.placedRobot.report().x === position.x &&
            this.placedRobot.report().y === position.y
          ) {
            result.errors.push("Robot is already at the destination");
            continue;
          }

          if (!this.board.canPlace(position)) {
            result.errors.push(
              `Invalid position: (${position.x},${position.y}) is outside the table boundaries or occupied by an obstacle`
            );
            continue;
          }

          const positions = this.board.findPath(
            this.placedRobot.report(),
            position
          );
          if (positions.length === 0) {
            result.errors.push("No path found");
          }
          positions.forEach((position) => {
            result.outputs.push(this.reportFormatter.formatPosition(position));
          });
        }
      } else if (command.startsWith("OBSTACLE")) {
        const position = this.parseObstacleCommand(command);
        if (this.isPlaced && this.placedRobot) {
          if (
            this.placedRobot.report().x === position.x &&
            this.placedRobot.report().y === position.y
          ) {
            result.errors.push(`Invalid OBSTACLE command: ${command}`);
            continue;
          }
        }
        this.board.addObstacle(position);
      } else {
        result.errors.push(`Invalid command: ${command}`);
      }
    }

    result.errors.push();
    result.outputs.push();

    return result;
  }

  private isOrientation(string: string): string is Orientation {
    return ["NORTH", "SOUTH", "EAST", "WEST"].includes(string);
  }

  private parsePlaceCommand(command: string): OrientedPosition {
    const match = command.match(/PLACE\s+(\d+)\s*,\s*(\d+)\s*,\s*([A-Z]+)/i);
    if (match) {
      const orientation = match[3];
      if (!this.isOrientation(orientation)) {
        throw new Error(`Invalid PLACE command: ${command}`);
      }

      return {
        x: parseInt(match[1]),
        y: parseInt(match[2]),
        facing: orientation,
      };
    } else {
      throw new Error(`Invalid PLACE command: ${command}`);
    }
  }

  private parseObstacleCommand(command: string): Position {
    const match = command.match(/OBSTACLE\s+(\d+)\s*,\s*(\d+)\s*/i);
    if (match) {
      return {
        x: parseInt(match[1]),
        y: parseInt(match[2]),
      };
    } else {
      throw new Error(`Invalid OBSTACLE command: ${command}`);
    }
  }

  private parseFindCommand(command: string): Position {
    const match = command.match(/FIND\s+(\d+)\s*,\s*(\d+)\s*/i);
    if (match) {
      return {
        x: parseInt(match[1]),
        y: parseInt(match[2]),
      };
    } else {
      throw new Error(`Invalid FIND command: ${command}`);
    }
  }
}
