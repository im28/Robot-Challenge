import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import { Board, RobotError, ToyRobot } from "./main.ts";
import { stubInterface } from "npm:ts-sinon";

// Test Suite
Deno.test("Robot Placement", async (t) => {
  const board = stubInterface<Board>();

  // Valid placement tests
  await t.step("should place robot at valid position", () => {
    board.canPlace.returns(true);
    const robot = new ToyRobot(board);
    robot.place(0, 0, "WEST");
    assertEquals(robot.report(), { x: 0, y: 0, facing: "WEST" });
  });

  // Invalid placement tests
  await t.step("should reject non-integer coordinates", () => {
    const robot = new ToyRobot(board);
    assertThrows(
      () => robot.place(1.5, 0, "NORTH"),
      RobotError,
      "Coordinates must be integers",
    );
    assertThrows(
      () => robot.place(0, 2.7, "NORTH"),
      RobotError,
      "Coordinates must be integers",
    );
  });

  await t.step("should reject placement beyond table boundaries", () => {
    board.canPlace.returns(false);
    const robot = new ToyRobot(board);
    assertThrows(
      () => robot.place(5, 0, "NORTH"),
      RobotError,
      "Invalid position: (5, 0) is outside the table boundaries",
    );
    assertThrows(
      () => robot.place(0, 5, "NORTH"),
      RobotError,
      "Invalid position: (0, 5) is outside the table boundaries",
    );
  });
});
