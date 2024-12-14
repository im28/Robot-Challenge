import { assertEquals, assertThrows } from "jsr:@std/assert";
import { BasicBoard, PlacedRobot, RobotError } from "./index.ts";

Deno.test("Robot Movement with BasicBoard", async (t) => {
  const board = new BasicBoard();
  const initialPosition = { x: 0, y: 0, facing: "NORTH" as const };

  // Valid movement tests
  await t.step(
    "PlacedRobot.move should correctly update position when facing NORTH",
    () => {
      const robot = new PlacedRobot(board, initialPosition);
      robot.move();
      assertEquals(robot.report(), { x: 0, y: 1, facing: "NORTH" });
    },
  );

  await t.step(
    "PlacedRobot.move should correctly update position when facing SOUTH",
    () => {
      const robot = new PlacedRobot(board, initialPosition);
      robot.place(0, 1, "SOUTH");
      robot.move();
      assertEquals(robot.report(), { x: 0, y: 0, facing: "SOUTH" });
    },
  );

  await t.step(
    "PlacedRobot.move should correctly update position when facing WEST",
    () => {
      const robot = new PlacedRobot(board, initialPosition);
      robot.place(1, 0, "WEST");
      robot.move();
      assertEquals(robot.report(), { x: 0, y: 0, facing: "WEST" });
    },
  );

  await t.step(
    "PlacedRobot.move should correctly update position when facing EAST",
    () => {
      const robot = new PlacedRobot(board, initialPosition);
      robot.place(0, 0, "EAST");
      robot.move();
      assertEquals(robot.report(), { x: 1, y: 0, facing: "EAST" });
    },
  );
});

Deno.test("Robot Placement - Edge Cases", async (t) => {
  const board = new BasicBoard();
  const initialPosition = { x: 0, y: 0, facing: "NORTH" as const };

  await t.step("should reject placement at negative coordinates", () => {
    const robot = new PlacedRobot(board, initialPosition);
    assertThrows(
      () => robot.place(-1, 0, "NORTH"),
      RobotError,
      "Invalid position: (-1, 0) is outside the table boundaries",
    );
    assertThrows(
      () => robot.place(0, -1, "NORTH"),
      RobotError,
      "Invalid position: (0, -1) is outside the table boundaries",
    );
  });

  await t.step("should reject placement just beyond table boundaries", () => {
    const robot = new PlacedRobot(board, initialPosition);
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

Deno.test("Robot Movement - Edge Cases", async (t) => {
  const board = new BasicBoard();
  const initialPosition = { x: 0, y: 0, facing: "NORTH" as const };

  await t.step("should not move robot off table from NORTH edge", () => {
    const robot = new PlacedRobot(board, initialPosition);
    robot.place(0, 4, "NORTH"); // Top edge
    assertThrows(
      () => robot.move(),
      RobotError,
      "Invalid position: (0, 5) is outside the table boundaries",
    );
    assertEquals(robot.report(), { x: 0, y: 4, facing: "NORTH" });
  });

  await t.step("should not move robot off table from SOUTH edge", () => {
    const robot = new PlacedRobot(board, initialPosition);
    robot.place(0, 0, "SOUTH"); // Bottom edge
    assertThrows(
      () => robot.move(),
      RobotError,
      "Invalid position: (0, -1) is outside the table boundaries",
    );
    assertEquals(robot.report(), { x: 0, y: 0, facing: "SOUTH" });
  });

  await t.step("should not move robot off table from EAST edge", () => {
    const robot = new PlacedRobot(board, initialPosition);
    robot.place(4, 0, "EAST"); // Right edge
    assertThrows(
      () => robot.move(),
      RobotError,
      "Invalid position: (5, 0) is outside the table boundaries",
    );
    assertEquals(robot.report(), { x: 4, y: 0, facing: "EAST" });
  });

  await t.step("should not move robot off table from WEST edge", () => {
    const robot = new PlacedRobot(board, initialPosition);
    robot.place(0, 0, "WEST"); // Left edge
    assertThrows(
      () => robot.move(),
      RobotError,
      "Invalid position: (-1, 0) is outside the table boundaries",
    );
    assertEquals(robot.report(), { x: 0, y: 0, facing: "WEST" });
  });
});