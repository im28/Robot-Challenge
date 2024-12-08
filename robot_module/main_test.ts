import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import { BasicBoard, CommandLineRobotReporter, ToyRobot } from "./main.ts";

// Test Suite
Deno.test("Robot Placement", async (t) => {
  const reporter = new CommandLineRobotReporter();
  const board = new BasicBoard();
  // Valid placement tests
  await t.step("should place robot at valid position", () => {
    const robot = new ToyRobot(reporter, board);
    robot.place(0, 0, "NORTH");
    assertEquals(robot.report(), { x: 0, y: 0, facing: "NORTH" });
  });

  await t.step("should place robot at maximum valid position", () => {
    const robot = new ToyRobot(reporter, board);
    robot.place(4, 4, "SOUTH");
    assertEquals(robot.report(), { x: 4, y: 4, facing: "SOUTH" });
  });

  // Invalid placement tests
  await t.step("should reject placement with negative coordinates", () => {
    const robot = new ToyRobot(reporter, board);
    assertThrows(() => robot.place(-1, 0, "NORTH"));
    assertThrows(() => robot.place(0, -1, "NORTH"));
  });

  await t.step("should reject placement beyond table boundaries", () => {
    const robot = new ToyRobot(reporter, board);
    assertThrows(() => robot.place(5, 0, "NORTH"));
    assertThrows(() => robot.place(0, 5, "NORTH"));
  });
});
