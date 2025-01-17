# Robot Challenge
[![CI Status](https://github.com/im28/Robot-Challenge/actions/workflows/ci.yml/badge.svg)](https://github.com/im28/Robot-Challenge/actions/workflows/ci.yml)
[![Test Coverage](https://api.codeclimate.com/v1/badges/14ee77514026f70c3e19/test_coverage)](https://codeclimate.com/github/im28/Robot-Challenge/test_coverage)
[![Latest Release](https://img.shields.io/github/v/release/im28/Robot-Challenge)]()

This project simulates a toy robot moving on a square tabletop. The robot can be
placed on the table, moved, rotated, and its position reported via a
command-line interface (CLI).

## Description

The application simulates a toy robot on a 5x5 unit square tabletop. The robot
can be placed at any valid position on the table and can face NORTH, SOUTH,
EAST, or WEST. The robot can move one unit forward in the direction it is facing
and can rotate 90 degrees to the left or right. The application prevents the
robot from falling off the table.

## CLI Usage

The CLI can be used in two modes: interactive mode and file input mode.

### Help

To see the help message, use the `--help` or `-h` flag:

```bash
Usage: robot-cli [OPTIONS]

Options:
  -i, --input     Input file path (if not provided, runs in interactive mode)
  -v, --verbose   Print verbose error messages (default: false)
  -o, --output    Output file path
  --height        Height of the table (default: 5)
  --width         Width of the table (default: 5)
  -h, --help      Show this help message

Commands:
  PLACE X,Y,F     Place the robot on the table at position X,Y and facing F (NORTH, SOUTH, EAST, or WEST)
  MOVE            Move the robot one unit forward in the direction it is currently facing
  LEFT            Rotate the robot 90 degrees to the left
  RIGHT           Rotate the robot 90 degrees to the right
  REPORT          Report the current X,Y position and facing direction of the robot
```


### Interactive Mode

To start the CLI in interactive mode, run the following command:

```bash
deno run start
```


You will be prompted to enter commands. Type `EXIT` to quit the interactive mode.

### File Input Mode

To run the CLI with commands from a file, use the `--input` or `-i` flag followed by the file path:

```bash
deno run start --input input.txt
```


### Output

You can specify an output file using the `--output` or `-o` flag. If no output file is specified, the output will be printed to the console.

```bash
deno run start -input input.txt --output output.txt
```

### Verbose Mode

To enable verbose error messages, use the `--verbose` or `-v` flag:
```bash
deno run start --verbose
```


## Commands

The following commands are supported:

*   **`PLACE X,Y,F`**: Places the robot on the table at position `X`, `Y` facing direction `F`.
    *   `X` and `Y` must be integers between 0 and 4 (inclusive).
    *   `F` must be one of `NORTH`, `SOUTH`, `EAST`, or `WEST`.
*   **`MOVE`**: Moves the robot one unit forward in the direction it is currently facing.
*   **`LEFT`**: Rotates the robot 90 degrees to the left.
*   **`RIGHT`**: Rotates the robot 90 degrees to the right.
*   **`REPORT`**: Reports the current `X`, `Y` position and facing direction of the robot.

## Development Environment

This project includes a pre-configured development environment using a devcontainer. This allows you to develop in a consistent and isolated environment with all the necessary tools and dependencies pre-installed.

### Prerequisites

To use the devcontainer, you will need the following:

*   [Docker](https://www.docker.com/) installed and running on your local machine.

Tools:
*   [Visual Studio Code](https://code.visualstudio.com/) installed on your local machine.
*   The [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension installed in VS Code.

    or

*   [Other tools that support dev containers](https://containers.dev/supporting) 
*   The [Dev Containers CLI](https://github.com/devcontainers/cli) dev container CLI.

    or
   * You can just run the docker file in .devcontainer directly



### Setting up the Dev Container

1. **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2. **Open the project in VS Code:**

    ```bash
    code .
    ```

3. **Reopen in Container:**

    *   VS Code should automatically detect the `.devcontainer` folder and prompt you to reopen the project in the container. Click the "Reopen in Container" button.
    *   Alternatively, you can open the Command Palette (Ctrl/Cmd + Shift + P) and run the command "Dev Containers: Reopen in Container".

### Using the Dev Container

Once the container is built and running, you can develop as you normally would within VS Code. The devcontainer is configured with the following:

*   **Deno:** The Deno runtime environment is installed and ready to use.
*   **Node.js:** Node.js is also available in the container.
*   **VS Code Extensions:** The following VS Code extensions are pre-installed:
    *   `justjavac.vscode-deno-extensionpack`
    *   `denoland.vscode-deno`
    *   `eamodio.gitlens`

You can now run Deno commands, execute tests, and use the CLI directly within the containerized environment.

### Stopping the Dev Container

When you are finished working in the devcontainer, you can close the VS Code window. This will automatically stop the container. You can also explicitly stop the container using the Docker Desktop application or the command line.

## System Architecture

The system is designed with a modular architecture, separating concerns into different modules:

*   **`@robot/core`**: Contains the core logic for the robot, board, and movement rules.
    *   [`robot.ts`](robot_module/robot.ts): Defines the `PlacedRobot` class, which handles the robot's position, orientation, and movement.
    *   [`board.ts`](robot_module/board.ts): Defines the `BasicBoard` class, which represents the tabletop and its boundaries.
*   **`@robot/cli`**: Handles the command-line interface, including command parsing and execution.
    *   [`index.ts`](cli/index.ts): Contains the `RobotSystem` class, which orchestrates the execution of commands and interacts with the core logic.
    *   [`reporter.ts`](cli/reporter.ts): Defines the `CommandLineReportFormatter` class, which formats the robot's report for console output.
    *   [`cli_integration_test.ts`](cli/cli_integration_test.ts): Contains integration tests for the CLI functionality.
*   **[`main.ts`](main.ts)**: The entry point of the application, responsible for parsing command-line arguments and running the appropriate mode (interactive or file input).



## Robustness

The system is designed to be robust and handle various error conditions:

*   **Invalid Commands:** The system gracefully handles invalid commands and provides informative error messages.
*   **Invalid Placement:** The system prevents the robot from being placed outside the table boundaries.
*   **Invalid Movement:** The system prevents the robot from moving off the table.
*   **Case Insensitivity:** The system handles commands in a case-insensitive manner.
*   **Command Spacing Variations:** The system handles variations in spacing within commands.
*   **Edge Cases:** The system handles various edge cases, such as commands before the initial `PLACE` and consecutive `PLACE` commands.

## Testing

The system includes unit and integration tests to ensure correctness and robustness:

*   **Unit Tests:** Unit tests for the core logic (`@robot/core`) are located in [`robot_test.ts`](robot_module/robot_test.ts) and [`robot_board_integration_test.ts`](robot_module/robot_board_integration_test.ts).
*   **Integration Tests:** Integration tests for the CLI functionality are located in [`main_test.ts`](cli/cli_integration_test.ts).


