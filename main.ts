import { RobotSystem, robotSystemOutput } from "@robot/cli";
import { parseArgs } from "@std/cli";
import { TextLineStream } from "@std/streams";

const robot = new RobotSystem();

function processCommand(
  command: string,
  verbose: boolean,
): robotSystemOutput {
  const output = robot.executeCommands([command]);
  if (verbose) {
    output.errors.forEach((error) => console.error(error));
  }
  return output;
}

async function runInteractiveMode(verbose: boolean) {
  console.log("Entering interactive mode. Type 'EXIT' to quit.");
  while (true) {
    const command = prompt("Enter command:");
    if (command === null || command.toUpperCase() === "EXIT") {
      break;
    }

    const output = await processCommand(command, verbose);
    output.outputs.forEach((out) => console.log(out));
  }
}

async function runFileMode(
  filePath: string,
  verbose: boolean,
  outputFilePath?: string,
) {
  try {
    const file = await Deno.open(filePath, { read: true });
    const lineStream = file.readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());

    let allOutputs: string[] = [];
    let allErrors: string[] = [];

    for await (const command of lineStream) {
      if (command.trim() !== "") {
        const output = await processCommand(command, verbose);
        allOutputs = allOutputs.concat(output.outputs);
        if (verbose) {
          allErrors = allErrors.concat(output.errors);
        }
      }
    }

    if (outputFilePath) {
      await Deno.writeTextFile(
        outputFilePath,
        allOutputs.join("\n") +
          (verbose ? "\nErrors:\n" + allErrors.join("\n") : ""),
      );
      console.log(`Output written to ${outputFilePath}`);
    } else {
      allOutputs.forEach((out) => console.log(out));
      if (verbose) {
        allErrors.forEach((error) => console.error(error));
      }
    }
  } catch (error) {
    console.error(`Error reading or writing file: ${error}`);
  }
}

async function main() {
  const parsedArgs = parseArgs(Deno.args, {
    boolean: ["verbose", "help"],
    string: ["output", "input"],
    alias: {
      "verbose": ["v"],
      "help": ["h"],
      "output": ["o"],
      "input": ["i"],
    },
    default: {
      verbose: false,
    },
  });

  const filePath = parsedArgs.input;

  if (parsedArgs.help) {
    console.log(`
Usage: robot-cli [OPTIONS]

Options:
  -i, --input     Input file path (if not provided, runs in interactive mode)
  -v, --verbose   Print verbose error messages (default: false)
  -o, --output    Output file path
  -h, --help      Show this help message

Commands:
  PLACE X,Y,F     Place the robot on the table at position X,Y and facing F (NORTH, SOUTH, EAST, or WEST)
  MOVE            Move the robot one unit forward in the direction it is currently facing
  LEFT            Rotate the robot 90 degrees to the left
  RIGHT           Rotate the robot 90 degrees to the right
  REPORT          Report the current X,Y position and facing direction of the robot
    `);
    return;
  }

  if (filePath) {
    await runFileMode(filePath, parsedArgs.verbose, parsedArgs.output);
  } else {
    await runInteractiveMode(parsedArgs.verbose);
  }
}

if (import.meta.main) {
  main();
}