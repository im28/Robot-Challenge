import type { OrientedPosition, Position } from "@robot/core";

export interface RobotReportFormatter {
  formatOrientedPosition(position: OrientedPosition): string;
}

export class CommandLineReportFormatter implements RobotReportFormatter {
  formatOrientedPosition(position: OrientedPosition): string {
    return `${position.x},${position.y},${position.facing}`;
  }

  formatPosition(position: Position): string {
    return `(${position.x},${position.y})`;
  }
}
