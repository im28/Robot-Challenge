import { assertEquals, assertThrows } from "jsr:@std/assert";
import { type Board, PlacedRobot, RobotError } from "./index.ts";
import { stubInterface } from "npm:ts-sinon";

Deno.test(
  "PlacedRobot.report should return the current position and orientation",
  () => {
    const board = stubInterface<Board>();
    board.canPlace.returns(true);

    const robot = new PlacedRobot(board, { x: 0, y: 0, facing: "NORTH" });
    assertEquals(robot.report(), { x: 0, y: 0, facing: "NORTH" });
  },
);

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
        "Invalid position: (5, 5) is outside the table boundaries or occupied by an obstacle",
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
    robot.place({ x: 0, y: 0, facing: "WEST" });
    assertEquals(robot.report(), { x: 0, y: 0, facing: "WEST" });
  });

  // Invalid placement tests
  await t.step("should reject non-integer coordinates", () => {
    board.canPlace.returns(true);
    const robot = new PlacedRobot(board, initialPosition);
    assertThrows(
      () => robot.place({ x: 1.5, y: 0, facing: "NORTH" }),
      RobotError,
      "Coordinates must be integers",
    );
    assertThrows(
      () => robot.place({ x: 0, y: 2.7, facing: "NORTH" }),
      RobotError,
      "Coordinates must be integers",
    );
  });

  await t.step("should reject placement beyond table boundaries", () => {
    const robot = new PlacedRobot(board, initialPosition);
    board.canPlace.returns(false);
    assertThrows(
      () => robot.place({ x: 5, y: 0, facing: "NORTH" }),
      RobotError,
      "Invalid position: (5, 0) is outside the table boundaries or occupied by an obstacle",
    );
    assertThrows(
      () => robot.place({ x: 0, y: 5, facing: "NORTH" }),
      RobotError,
      "Invalid position: (0, 5) is outside the table boundaries or occupied by an obstacle",
    );
  });
});

Deno.test("PlacedRobot Movement", async (t) => {
  const board = stubInterface<Board>();
  const initialPosition = { x: 0, y: 0, facing: "NORTH" as const };

  // Valid movement tests
  await t.step(
    "PlacedRobot.move should correctly update position when facing NORTH",
    () => {
      board.canPlace.returns(true);
      const robot = new PlacedRobot(board, initialPosition);
      robot.place({ x: 0, y: 0, facing: "NORTH" });
      robot.move();
      assertEquals(robot.report(), { x: 0, y: 1, facing: "NORTH" });
    },
  );

  await t.step(
    "PlacedRobot.move should correctly update position when facing SOUTH",
    () => {
      board.canPlace.returns(true);
      const robot = new PlacedRobot(board, initialPosition);
      robot.place({ x: 0, y: 1, facing: "SOUTH" });
      robot.move();
      assertEquals(robot.report(), { x: 0, y: 0, facing: "SOUTH" });
    },
  );

  await t.step(
    "PlacedRobot.move should correctly update position when facing WEST",
    () => {
      board.canPlace.returns(true);
      const robot = new PlacedRobot(board, initialPosition);
      robot.place({ x: 1, y: 0, facing: "WEST" });
      robot.move();
      assertEquals(robot.report(), { x: 0, y: 0, facing: "WEST" });
    },
  );

  await t.step(
    "PlacedRobot.move should correctly update position when facing EAST",
    () => {
      board.canPlace.returns(true);
      const robot = new PlacedRobot(board, initialPosition);
      robot.place({ x: 0, y: 0, facing: "EAST" });
      robot.move();
      assertEquals(robot.report(), { x: 1, y: 0, facing: "EAST" });
    },
  );

  // Invalid movement tests
  await t.step("should not move robot off table", () => {
    const robot = new PlacedRobot(board, initialPosition);

    // Setup canPlace to return true for (0,0) and false for (0,1)
    board.canPlace.withArgs({ x: 0, y: 0 }).returns(true);
    board.canPlace.withArgs({ x: 0, y: 1 }).returns(false);

    robot.place({ x: 0, y: 0, facing: "NORTH" });

    assertThrows(
      () => robot.move(),
      RobotError,
      "Invalid position: (0, 1) is outside the table boundaries or occupied by an obstacle",
    );

    assertEquals(robot.report(), { x: 0, y: 0, facing: "NORTH" });
  });
});

Deno.test("PlacedRobot turning", async (t) => {
  const board = stubInterface<Board>();
  const initialPosition = { x: 0, y: 0, facing: "NORTH" as const };
  board.canPlace.returns(true);

  const leftTurns = [
    { start: "NORTH", end: "WEST" },
    { start: "WEST", end: "SOUTH" },
    { start: "SOUTH", end: "EAST" },
    { start: "EAST", end: "NORTH" },
  ] as const;

  for (const { start, end } of leftTurns) {
    await t.step(`should turn robot left from ${start} to ${end}`, () => {
      const robot = new PlacedRobot(board, initialPosition);
      robot.place({ x: 0, y: 0, facing: start });
      robot.left();
      assertEquals(robot.report(), { x: 0, y: 0, facing: end });
    });
  }

  const rightTurns = [
    { start: "NORTH", end: "EAST" },
    { start: "EAST", end: "SOUTH" },
    { start: "SOUTH", end: "WEST" },
    { start: "WEST", end: "NORTH" },
  ] as const;

  for (const { start, end } of rightTurns) {
    await t.step(`should turn robot right from ${start} to ${end}`, () => {
      const robot = new PlacedRobot(board, initialPosition);
      robot.place({ x: 0, y: 0, facing: start });
      robot.right();
      assertEquals(robot.report(), { x: 0, y: 0, facing: end });
    });
  }
});
