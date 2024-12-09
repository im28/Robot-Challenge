import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import { Board, RobotError, ToyRobot, Position } from "./main.ts";
import { stubInterface } from "npm:ts-sinon";

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

Deno.test("Robot Movement", async (t) => {
  const board = stubInterface<Board>();

  // Valid movement tests
  await t.step("should move robot forward", () => {
    board.canPlace.returns(true);
    const robot = new ToyRobot(board);
    robot.place(0, 0, "NORTH");
    robot.move();
    assertEquals(robot.report(), { x: 0, y: 1, facing: "NORTH" });
  });

  // Invalid movement tests
  await t.step("should not move robot off table", () => {
    const robot = new ToyRobot(board);
    
    // Setup canPlace to return true for (0,0) and false for (0,1)
    board.canPlace.withArgs({ x: 0, y: 0 }).returns(true);
    board.canPlace.withArgs({ x: 0, y: 1 }).returns(false);
    
    robot.place(0, 0, "NORTH");

    assertThrows(
      () => robot.move(),
      RobotError,
      "Invalid position: (0, 1) is outside the table boundaries",
    );
    
    assertEquals(robot.report(), { x: 0, y: 0, facing: "NORTH" });
  });
});


Deno.test("Robot turn", async (t) => {
  const board = stubInterface<Board>();
  board.canPlace.returns(true);

  // Valid Left turn tests
  await t.step("should turn robot left", () => {
    const robot = new ToyRobot(board);
    robot.place(0, 0, "NORTH");
    robot.left();
    assertEquals(robot.report(), { x: 0, y: 0, facing: "WEST" });
    robot.left();
    assertEquals(robot.report(), { x: 0, y: 0, facing: "SOUTH" });
    robot.left();
    assertEquals(robot.report(), { x: 0, y: 0, facing: "EAST" });
    robot.left();
    assertEquals(robot.report(), { x: 0, y: 0, facing: "NORTH" });

  });

  // Valid Right turn tests
  await t.step("should turn robot right", () => {
    const robot = new ToyRobot(board);
    robot.place(0, 0, "NORTH");
    robot.right();
    assertEquals(robot.report(), { x: 0, y: 0, facing: "EAST" });
    robot.right();
    assertEquals(robot.report(), { x: 0, y: 0, facing: "SOUTH" });
    robot.right();
    assertEquals(robot.report(), { x: 0, y: 0, facing: "WEST" });
    robot.right();
    assertEquals(robot.report(), { x: 0, y: 0, facing: "NORTH" });
  });
  
});

