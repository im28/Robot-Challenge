import { assertEquals } from "jsr:@std/assert";
import { stubInterface } from "npm:ts-sinon";
import { RobotCliSystem } from "./main.ts";

const robot = stubInterface<RobotCliSystem>();

Deno.test("Robot System", async (t) => {
  await t.step("Example Test Cases", () => {
    assertEquals(
      robot.executeCommands(["PLACE 0,0,NORTH", "MOVE", "REPORT"]),
      { errors: [], outputs: ["0,1,NORTH"] },
    );
    assertEquals(
      robot.executeCommands(["PLACE 0,0,NORTH", "LEFT", "REPORT"]),
      { errors: [], outputs: ["0,0,WEST"] },
    );
    assertEquals(
      robot.executeCommands([
        "PLACE 1,2,EAST",
        "MOVE",
        "MOVE",
        "LEFT",
        "MOVE",
        "REPORT",
      ]),
      { errors: [], outputs: ["3,3,NORTH"] },
    );
  });

  await t.step("Edge Cases", async (t) => {
    await t.step("placing the robot outside the table", () => {
      assertEquals(
        robot.executeCommands(["PLACE 6,6,NORTH", "MOVE", "REPORT"]),
        { errors: ["Invalid placement: 6,6,NORTH"], outputs: [] },
      );
    });

    await t.step("moving the robot off the table", () => {
      assertEquals(
        robot.executeCommands([
          "PLACE 0,0,SOUTH",
          "MOVE",
          "REPORT",
        ]),
        { errors: [], outputs: ["0,0,SOUTH"] },
      );
      assertEquals(
        robot.executeCommands([
          "PLACE 0,0,WEST",
          "MOVE",
          "REPORT",
        ]),
        { errors: [], outputs: ["0,0,WEST"] },
      );
      assertEquals(
        robot.executeCommands([
          "PLACE 4,4,NORTH",
          "MOVE",
          "REPORT",
        ]),
        { errors: [], outputs: ["4,4,NORTH"] },
      );
      assertEquals(
        robot.executeCommands([
          "PLACE 4,4,EAST",
          "MOVE",
          "REPORT",
        ]),
        { errors: [], outputs: ["4,4,EAST"] },
      );
    });

    await t.step("multiple PLACE commands", () => {
      assertEquals(
        robot.executeCommands([
          "PLACE 0,0,NORTH",
          "MOVE",
          "PLACE 2,2,EAST",
          "MOVE",
          "REPORT",
        ]),
        { errors: [], outputs: ["3,2,EAST"] },
      );
    });
  });

  await t.step("Invalid Commands", async (t) => {
    await t.step("invalid PLACE format", () => {
      assertEquals(
        robot.executeCommands(["PLACE A,0,NORTH", "REPORT"]),
        { errors: ["Invalid command: PLACE A,0,NORTH"], outputs: [] },
      );
    });

    await t.step("unknown command", () => {
      assertEquals(
        robot.executeCommands(["PLACE 0,0,NORTH", "JUMP", "REPORT"]),
        { errors: ["Invalid command: JUMP"], outputs: ["0,0,NORTH"] },
      );
    });
  });

  await t.step("Multiple REPORT Commands", () => {
    assertEquals(
      robot.executeCommands([
        "PLACE 1,1,NORTH",
        "REPORT",
        "MOVE",
        "REPORT",
        "LEFT",
        "REPORT",
      ]),
      {
        errors: [],
        outputs: ["1,1,NORTH", "1,2,NORTH", "1,2,WEST"],
      },
    );
  });

  await t.step("Commands Before Initial PLACE", () => {
    assertEquals(
      robot.executeCommands([
        "MOVE",
        "LEFT",
        "REPORT",
        "PLACE 0,0,NORTH",
        "REPORT",
      ]),
      { errors: [], outputs: ["0,0,NORTH"] },
    );
  });

  await t.step(
    "Invalid PLACE Commands (Missing Parameters)",
    async (t) => {
      await t.step("missing facing direction", () => {
        assertEquals(
          robot.executeCommands(["PLACE 0,0", "REPORT"]),
          {
            errors: ["Invalid command: PLACE 0,0"],
            outputs: [],
          },
        );
      });

      await t.step("missing y coordinate and facing direction", () => {
        assertEquals(
          robot.executeCommands(["PLACE 0,NORTH", "REPORT"]),
          {
            errors: ["Invalid command: PLACE 0,NORTH"],
            outputs: [],
          },
        );
      });
    },
  );

  await t.step(
    "Invalid PLACE Commands (Invalid Facing Direction)",
    () => {
      assertEquals(
        robot.executeCommands(["PLACE 0,0,UP", "REPORT"]),
        { errors: ["Invalid command: PLACE 0,0,UP"], outputs: [] },
      );
    },
  );

  await t.step("Case Sensitivity", () => {
    assertEquals(
      robot.executeCommands(["place 0,0,north", "move", "report"]),
      { errors: [], outputs: ["0,1,NORTH"] },
    );
  });

  await t.step("Empty Input", () => {
    assertEquals(
      robot.executeCommands([]),
      { errors: [], outputs: [] },
    );
  });

  await t.step("Consecutive PLACE Commands", async (t) => {
    await t.step("multiple valid PLACE commands in a row", () => {
      assertEquals(
        robot.executeCommands([
          "PLACE 1,1,NORTH",
          "PLACE 2,2,SOUTH",
          "PLACE 3,3,EAST",
          "REPORT",
        ]),
        { errors: [], outputs: ["3,3,EAST"] },
      );
    });

    await t.step("a valid PLACE followed by an invalid PLACE", () => {
      assertEquals(
        robot.executeCommands([
          "PLACE 1,1,NORTH",
          "PLACE 6,6,WEST", // Invalid placement
          "REPORT",
        ]),
        { errors: ["Invalid placement: 6,6,WEST"], outputs: ["1,1,NORTH"] },
      );
    });

    await t.step("an invalid PLACE followed by a valid PLACE", () => {
      assertEquals(
        robot.executeCommands([
          "PLACE -1,-1,SOUTH", // Invalid placement
          "PLACE 2,2,WEST",
          "REPORT",
        ]),
        { errors: ["Invalid placement: -1,-1,SOUTH"], outputs: ["2,2,WEST"] },
      );
    });
  });
});
