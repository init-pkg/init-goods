import { describe, test, expect } from "vitest";

describe("Test for test", () => {
  test("should increment", async () => {
    let count = 0;

    count++;

    expect(count).toBe(1);
  });
});
