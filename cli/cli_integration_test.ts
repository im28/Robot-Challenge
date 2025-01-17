import { assertEquals } from "jsr:@std/assert";
import { RobotSystem } from "./index.ts";
import { BasicBoard } from "../robot_module/board.ts";

Deno.test("Robot System", async (t) => {
  await t.step("Example Test Cases", () => {
    const robot = new RobotSystem();
    assertEquals(robot.executeCommands(["PLACE 0,0,NORTH", "MOVE", "REPORT"]), {
      errors: [],
      outputs: ["0,1,NORTH"],
    });
    assertEquals(robot.executeCommands(["PLACE 0,0,NORTH", "LEFT", "REPORT"]), {
      errors: [],
      outputs: ["0,0,WEST"],
    });
    assertEquals(
      robot.executeCommands([
        "PLACE 1,2,EAST",
        "MOVE",
        "MOVE",
        "LEFT",
        "MOVE",
        "REPORT",
      ]),
      { errors: [], outputs: ["3,3,NORTH"] }
    );
  });

  await t.step("Edge Cases", async (t) => {
    await t.step("placing the robot outside the table", () => {
      const robot = new RobotSystem();
      assertEquals(
        robot.executeCommands(["PLACE 6,6,NORTH", "MOVE", "REPORT"]),
        {
          errors: [
            "Invalid position: (6, 6) is outside the table boundaries or occupied by an obstacle",
          ],
          outputs: [],
        }
      );
    });

    await t.step("placing the robot outside the custom sized table", () => {
      const customBoard = new BasicBoard(3, 3);
      const robot = new RobotSystem(customBoard);
      assertEquals(robot.executeCommands(["PLACE 3,3,NORTH", "REPORT"]), {
        errors: [
          "Invalid position: (3, 3) is outside the table boundaries or occupied by an obstacle",
        ],
        outputs: [],
      });
    });

    await t.step("moving the robot off the table", () => {
      const robot = new RobotSystem();
      assertEquals(
        robot.executeCommands(["PLACE 0,0,SOUTH", "MOVE", "REPORT"]),
        {
          errors: [
            "Invalid position: (0, -1) is outside the table boundaries or occupied by an obstacle",
          ],
          outputs: ["0,0,SOUTH"],
        }
      );
      assertEquals(
        robot.executeCommands(["PLACE 0,0,WEST", "MOVE", "REPORT"]),
        {
          errors: [
            "Invalid position: (-1, 0) is outside the table boundaries or occupied by an obstacle",
          ],
          outputs: ["0,0,WEST"],
        }
      );
      assertEquals(
        robot.executeCommands(["PLACE 4,4,NORTH", "MOVE", "REPORT"]),
        {
          errors: [
            "Invalid position: (4, 5) is outside the table boundaries or occupied by an obstacle",
          ],
          outputs: ["4,4,NORTH"],
        }
      );
      assertEquals(
        robot.executeCommands(["PLACE 4,4,EAST", "MOVE", "REPORT"]),
        {
          errors: [
            "Invalid position: (5, 4) is outside the table boundaries or occupied by an obstacle",
          ],
          outputs: ["4,4,EAST"],
        }
      );
    });

    await t.step("multiple PLACE commands", () => {
      const robot = new RobotSystem();
      assertEquals(
        robot.executeCommands([
          "PLACE 0,0,NORTH",
          "MOVE",
          "PLACE 2,2,EAST",
          "MOVE",
          "REPORT",
        ]),
        { errors: [], outputs: ["3,2,EAST"] }
      );
    });
  });

  await t.step("Invalid Commands", async (t) => {
    await t.step("invalid PLACE format", () => {
      const robot = new RobotSystem();
      assertEquals(robot.executeCommands(["PLACE A,0,NORTH", "REPORT"]), {
        errors: ["Invalid PLACE command: PLACE A,0,NORTH"],
        outputs: [],
      });
    });

    await t.step("unknown command", () => {
      const robot = new RobotSystem();
      assertEquals(
        robot.executeCommands(["PLACE 0,0,NORTH", "JUMP", "REPORT"]),
        { errors: ["Invalid command: JUMP"], outputs: ["0,0,NORTH"] }
      );
    });
  });

  await t.step("Multiple REPORT Commands", () => {
    const robot = new RobotSystem();
    assertEquals(
      robot.executeCommands([
        "PLACE 1,1,NORTH",
        "REPORT",
        "MOVE",
        "REPORT",
        "RIGHT",
        "REPORT",
      ]),
      {
        errors: [],
        outputs: ["1,1,NORTH", "1,2,NORTH", "1,2,EAST"],
      }
    );
  });

  await t.step("Commands Before Initial PLACE", () => {
    const robot = new RobotSystem();
    assertEquals(
      robot.executeCommands([
        "MOVE",
        "LEFT",
        "REPORT",
        "PLACE 0,0,NORTH",
        "REPORT",
      ]),
      { errors: [], outputs: ["0,0,NORTH"] }
    );
  });

  await t.step("Invalid PLACE Commands (Missing Parameters)", async (t) => {
    await t.step("missing facing direction", () => {
      const robot = new RobotSystem();
      assertEquals(robot.executeCommands(["PLACE 0,0", "REPORT"]), {
        errors: ["Invalid PLACE command: PLACE 0,0"],
        outputs: [],
      });
    });

    await t.step("missing y coordinate and facing direction", () => {
      const robot = new RobotSystem();
      assertEquals(robot.executeCommands(["PLACE 0,NORTH", "REPORT"]), {
        errors: ["Invalid PLACE command: PLACE 0,NORTH"],
        outputs: [],
      });
    });
  });

  await t.step("Invalid PLACE Commands (Invalid Facing Direction)", () => {
    const robot = new RobotSystem();
    assertEquals(robot.executeCommands(["PLACE 0,0,UP", "REPORT"]), {
      errors: ["Invalid PLACE command: PLACE 0,0,UP"],
      outputs: [],
    });
  });

  await t.step("Case Sensitivity", () => {
    const robot = new RobotSystem();
    assertEquals(robot.executeCommands(["place 0,0,north", "move", "report"]), {
      errors: [],
      outputs: ["0,1,NORTH"],
    });
  });

  await t.step("Empty Input", () => {
    const robot = new RobotSystem();
    assertEquals(robot.executeCommands([]), { errors: [], outputs: [] });
  });

  await t.step("Consecutive PLACE Commands", async (t) => {
    await t.step("multiple valid PLACE commands in a row", () => {
      const robot = new RobotSystem();
      assertEquals(
        robot.executeCommands([
          "PLACE 1,1,NORTH",
          "PLACE 2,2,SOUTH",
          "PLACE 3,3,EAST",
          "REPORT",
        ]),
        { errors: [], outputs: ["3,3,EAST"] }
      );
    });

    await t.step("a valid PLACE followed by an invalid PLACE", () => {
      const robot = new RobotSystem();
      assertEquals(
        robot.executeCommands([
          "PLACE 1,1,NORTH",
          "PLACE 6,6,WEST", // Invalid placement
          "REPORT",
        ]),
        {
          errors: [
            "Invalid position: (6, 6) is outside the table boundaries or occupied by an obstacle",
          ],
          outputs: ["1,1,NORTH"],
        }
      );
    });

    await t.step("an invalid PLACE followed by a valid PLACE", () => {
      const robot = new RobotSystem();
      assertEquals(
        robot.executeCommands([
          "PLACE -1,-1,SOUTH", // Invalid placement
          "PLACE 2,2,WEST",
          "REPORT",
        ]),
        {
          errors: ["Invalid PLACE command: PLACE -1,-1,SOUTH"],
          outputs: ["2,2,WEST"],
        }
      );
    });
  });

  await t.step("Command Spacing Variations", async (t) => {
    await t.step("place command with standard spacing", () => {
      const robot = new RobotSystem();
      assertEquals(robot.executeCommands(["PLACE 0,0,NORTH", "REPORT"]), {
        errors: [],
        outputs: ["0,0,NORTH"],
      });
    });

    await t.step("place command with multiple spaces after PLACE", () => {
      const robot = new RobotSystem();
      assertEquals(robot.executeCommands(["PLACE    0,0,NORTH", "REPORT"]), {
        errors: [],
        outputs: ["0,0,NORTH"],
      });
    });

    await t.step("place command with multiple spaces around parameters", () => {
      const robot = new RobotSystem();
      assertEquals(
        robot.executeCommands(["PLACE 0   ,   0   ,   NORTH", "REPORT"]),
        { errors: [], outputs: ["0,0,NORTH"] }
      );
    });

    await t.step("invalid place command with no space after PLACE", () => {
      const robot = new RobotSystem();
      assertEquals(robot.executeCommands(["PLACE0,0,NORTH", "REPORT"]), {
        errors: ["Invalid PLACE command: PLACE0,0,NORTH"],
        outputs: [],
      });
    });

    await t.step("Other Command Spacing", () => {
      const robot = new RobotSystem();
      assertEquals(
        robot.executeCommands(["PLACE 0,0,NORTH", "   MOVE  ", "  REPORT  "]),
        { errors: [], outputs: ["0,1,NORTH"] }
      );
    });
  });

  await t.step("OBSTACLE Command", async (t) => {
    await t.step("Obstacle cannot be placed where the robot is", () => {
      const robot = new RobotSystem();
      assertEquals(
        robot.executeCommands(["PLACE 0,0,NORTH", "OBSTACLE 0,0", "REPORT"]),
        {
          errors: ["Invalid OBSTACLE command: OBSTACLE 0,0"],
          outputs: ["0,0,NORTH"],
        }
      );
    });

    await t.step(
      "Obstacle can be placed before and robot cannot be placed there",
      () => {
        const robot = new RobotSystem();
        assertEquals(
          robot.executeCommands(["OBSTACLE 0,0", "PLACE 0,0,NORTH", "REPORT"]),
          {
            errors: [
              "Invalid position: (0, 0) is outside the table boundaries or occupied by an obstacle",
            ],
            outputs: [],
          }
        );
      }
    );

    await t.step(
      "Obstacle can be placed after the robot and it cannot move there",
      () => {
        const robot = new RobotSystem();
        assertEquals(
          robot.executeCommands([
            "PLACE 0,0,NORTH",
            "OBSTACLE 0,1",
            "MOVE",
            "REPORT",
          ]),
          {
            errors: [
              "Invalid position: (0, 1) is outside the table boundaries or occupied by an obstacle",
            ],
            outputs: ["0,0,NORTH"],
          }
        );
      }
    );
  });

  await t.step("FIND Command", async (t) => {
    await t.step("Finding a simple path with no obstacles", () => {
      /* 
      0 0 0 0 0
      0 0 0 0 0
      0 0 G 0 0
      0 0 0 0 0
      S 0 0 0 0
      */
      const robot = new RobotSystem();
      assertEquals(robot.executeCommands(["PLACE 0,0,NORTH", "FIND 2,2"]), {
        errors: [],
        outputs: ["(1,0)", "(2,0)", "(2,1)", "(2,2)"],
      });
    });

    await t.step("Finding a path around obstacles", () => {
      /* 
      0 0 0 X G 
      0 X 0 X 0 
      0 X 0 X 0 
      0 X 0 X 0 
      S X 0 0 0 
      */
      const robot = new RobotSystem();
      assertEquals(
        robot.executeCommands([
          "PLACE 0,0,NORTH",
          "OBSTACLE 1,0",
          "OBSTACLE 1,1",
          "OBSTACLE 1,2",
          "OBSTACLE 1,3",
          "OBSTACLE 3,1",
          "OBSTACLE 3,2",
          "OBSTACLE 3,3",
          "OBSTACLE 3,3",
          "OBSTACLE 3,4",
          "FIND 4,4",
        ]),
        {
          errors: [],
          outputs: [
            "(0,1)",
            "(0,2)",
            "(0,3)",
            "(0,4)",
            "(1,4)",
            "(2,4)",
            "(2,3)",
            "(2,2)",
            "(2,1)",
            "(2,0)",
            "(3,0)",
            "(4,0)",
            "(4,1)",
            "(4,2)",
            "(4,3)",
            "(4,4)",
          ],
        }
      );
    });

    await t.step("Finding a path when destination is unreachable", () => {
      /*
      0 0 G 0 0
      0 0 0 0 0
      0 0 0 0 0
      X X 0 0 0
      S X 0 0 0
      */
      const robot = new RobotSystem();
      assertEquals(
        robot.executeCommands([
          "PLACE 0,0,NORTH",
          "OBSTACLE 1,0",
          "OBSTACLE 1,1",
          "OBSTACLE 0,1",
          "FIND 2,2",
        ]),
        {
          errors: ["No path found"],
          outputs: [],
        }
      );
    });

    await t.step("Finding a path to current position returns error", () => {
      const robot = new RobotSystem();
      assertEquals(robot.executeCommands(["PLACE 2,2,NORTH", "FIND 2,2"]), {
        errors: ["Robot is already at the destination"],
        outputs: [],
      });
    });

    await t.step("Finding a path before PLACE command does nothing", () => {
      const robot = new RobotSystem();
      assertEquals(robot.executeCommands(["FIND 2,2"]), {
        errors: [],
        outputs: [],
      });
    });

    await t.step("Finding a path with invalid coordinates", () => {
      const robot = new RobotSystem();
      assertEquals(robot.executeCommands(["PLACE 0,0,NORTH", "FIND 5,5"]), {
        errors: [
          "Invalid position: (5,5) is outside the table boundaries or occupied by an obstacle",
        ],
        outputs: [],
      });
    });
  });
});
