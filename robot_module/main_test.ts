import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import { Board, PlacedRobot, Position, RobotError } from "./main.ts";
import { stubInterface } from "npm:ts-sinon";

Deno.test("Robot Constructor", async (t) => {
  const board = stubInterface<Board>();

  await t.step("should initialize with valid position", () => {
    board.canPlace.returns(true);
    const position = { x: 0, y: 0, facing: "NORTH" as const };
    const robot = new PlacedRobot(board, position);
    assertEquals(robot.report(), position);
  });

  await t.step(
    "should throw error when initialized with invalid position",
    () => {
      board.canPlace.returns(false);
      const position = { x: 5, y: 5, facing: "NORTH" as const };
      assertThrows(
        () => new PlacedRobot(board, position),
        RobotError,
        "Invalid position: (5, 5) is outside the table boundaries",
      );
    },
  );
});

Deno.test("Robot Placement", async (t) => {
  const board = stubInterface<Board>();
  const initialPosition = { x: 0, y: 0, facing: "NORTH" as const };

  // Valid placement tests
  await t.step("should place robot at valid position", () => {
    board.canPlace.returns(true);
    const robot = new PlacedRobot(board, initialPosition);
    robot.place(0, 0, "WEST");
    assertEquals(robot.report(), { x: 0, y: 0, facing: "WEST" });
  });

  // Invalid placement tests
  await t.step("should reject non-integer coordinates", () => {
    board.canPlace.returns(true);
    const robot = new PlacedRobot(board, initialPosition);
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
    const robot = new PlacedRobot(board, initialPosition);
    board.canPlace.returns(false);
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
  const initialPosition = { x: 0, y: 0, facing: "NORTH" as const };

  // Valid movement tests
  await t.step("should move robot forward", () => {
    board.canPlace.returns(true);
    const robot = new PlacedRobot(board, initialPosition);
    robot.place(0, 0, "NORTH");
    robot.move();
    assertEquals(robot.report(), { x: 0, y: 1, facing: "NORTH" });
  });

  // Invalid movement tests
  await t.step("should not move robot off table", () => {
    const robot = new PlacedRobot(board, initialPosition);

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
  const initialPosition = { x: 0, y: 0, facing: "NORTH" as const };
  board.canPlace.returns(true);

  // Valid Left turn tests
  await t.step("should turn robot left", () => {
    const robot = new PlacedRobot(board, initialPosition);
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
    const robot = new PlacedRobot(board, initialPosition);
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
