import { OrientedPosition } from "./robot.ts";

export interface RobotReporter {
  report(position: OrientedPosition): void;
}

export class CommandLineRobotReporter implements RobotReporter {
  report(position: OrientedPosition): void {
    console.log(`${position.x},${position.y},${position.facing}`);
  }
}
