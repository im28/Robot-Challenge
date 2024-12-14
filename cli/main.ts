export type robotSystemOutput = {
  errors: string[];
  outputs: string[];
};

export interface RobotCliSystem {
  executeCommands(command: string[]): robotSystemOutput;
}
