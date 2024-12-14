import type { OrientedPosition } from "@robot/core";

export interface RobotReportFormatter {
  format(position: OrientedPosition): string;
}

export class CommandLineReportFormatter implements RobotReportFormatter {
  format(position: OrientedPosition): string {
    return `${position.x},${position.y},${position.facing}`;
  }
}
