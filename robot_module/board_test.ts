import { assertEquals } from "jsr:@std/assert";
import { BasicBoard, type Position } from "./index.ts";

Deno.test("BasicBoard", async (t) => {
  await t.step(
    "getDimensions returns correct dimensions with default values",
    () => {
      const board = new BasicBoard();
      const dimensions = board.getDimensions();
      assertEquals(dimensions, { height: 5, width: 5 });
    }
  );

  await t.step(
    "getDimensions returns correct dimensions with custom values",
    () => {
      const board = new BasicBoard(10, 10);
      const dimensions = board.getDimensions();
      assertEquals(dimensions, { height: 10, width: 10 });
    }
  );

  await t.step("canPlace returns true for valid positions", () => {
    const board = new BasicBoard();
    const validPositions: Position[] = [
      { x: 0, y: 0 },
      { x: 2, y: 3 },
      { x: 4, y: 4 },
    ];
    for (const position of validPositions) {
      assertEquals(board.canPlace(position), true);
    }
  });

  await t.step("canPlace returns false for invalid positions", () => {
    const board = new BasicBoard();
    const invalidPositions: Position[] = [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 5, y: 0 },
      { x: 0, y: 5 },
      { x: 5, y: 5 },
    ];
    for (const position of invalidPositions) {
      assertEquals(board.canPlace(position), false);
    }
  });

  await t.step("addObstacle returns false for obstacle positions", () => {
    const board = new BasicBoard(3, 3);
    board.addObstacle({ x: 2, y: 2 });
    board.addObstacle({ x: 3, y: 4 });

    assertEquals(board.canPlace({ x: 2, y: 2 }), false);
    assertEquals(board.canPlace({ x: 3, y: 4 }), false);
    assertEquals(board.canPlace({ x: 0, y: 0 }), true);
  });

  await t.step(
    "canPlace returns false for positions outside custom dimensions",
    () => {
      const board = new BasicBoard(3, 3);
      const invalidPositions: Position[] = [
        { x: 3, y: 0 },
        { x: 0, y: 3 },
        { x: 3, y: 3 },
      ];
      for (const position of invalidPositions) {
        assertEquals(board.canPlace(position), false);
      }
    }
  );

  await t.step("findPath can find a path from start to goal", () => {
    /*/
    0 1 G 1 0
    0 1 0 1 0
    0 1 0 1 0
    0 1 0 1 0
    0 1 X 1 0
    */

    const board = new BasicBoard(5, 5);
    board.addObstacle({ x: 1, y: 0 });
    board.addObstacle({ x: 1, y: 1 });
    board.addObstacle({ x: 1, y: 2 });
    board.addObstacle({ x: 1, y: 3 });
    board.addObstacle({ x: 1, y: 4 });
    board.addObstacle({ x: 3, y: 0 });
    board.addObstacle({ x: 3, y: 1 });
    board.addObstacle({ x: 3, y: 2 });
    board.addObstacle({ x: 3, y: 3 });
    board.addObstacle({ x: 3, y: 4 });

    const path = board.findPath({ x: 2, y: 0 }, { x: 2, y: 4 });
    assertEquals(path, [
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 2, y: 4 },
    ]);
  });

  await t.step("findPath cannot find a path when it is blocked by obstacles", () => {
    /*/
    0 0 0 0 G
    0 0 0 0 0
    0 0 0 0 0
    1 1 0 0 0
    X 1 0 0 0
    */

    const board = new BasicBoard(5, 5);
    board.addObstacle({ x: 1, y: 1 });
    board.addObstacle({ x: 1, y: 0 });
    board.addObstacle({ x: 0, y: 1 });
    const path = board.findPath({ x: 0, y: 0 }, { x: 4, y: 4 });
    assertEquals(path, []);
  });

  await t.step("findPath cannot find a path when it is blocked by obstacles", () => {
    /*/
    0 0 0 0 0
    X 1 0 0 0
    0 1 0 0 0
    0 0 0 0 0
    0 0 0 0 G
    */

    const board = new BasicBoard(5, 5);
    board.addObstacle({ x: 1, y: 2 });
    board.addObstacle({ x: 1, y: 3 });
    const path = board.findPath({ x: 0, y: 3 }, { x: 4, y: 0 });
    assertEquals(path, [
      { x: 0, y: 2 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 4, y: 0 },
    ]);
  });
});
