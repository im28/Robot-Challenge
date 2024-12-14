import { assertEquals } from "jsr:@std/assert";
import { BasicBoard, type Position } from "./index.ts";

Deno.test("BasicBoard", async (t) => {
  const board = new BasicBoard();

  await t.step("getDimensions returns correct dimensions", () => {
    const dimensions = board.getDimensions();
    assertEquals(dimensions, { height: 5, width: 5 });
  });

  await t.step("canPlace returns true for valid positions", () => {
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
});
