import { describe, it, expect } from "vitest";
import { calculateChance, VALID_EXAMS, VALID_BRANCHES } from "@/lib/predictor";

describe("calculateChance", () => {
  it("returns High within 70% of the closing rank", () => {
    expect(calculateChance(700, 1000)).toBe("High");
  });

  it("returns Medium between 70% and 100% of the closing rank", () => {
    expect(calculateChance(800, 1000)).toBe("Medium");
    expect(calculateChance(1000, 1000)).toBe("Medium");
  });

  it("returns Low between 100% and 115% of the closing rank", () => {
    expect(calculateChance(1001, 1000)).toBe("Low");
    expect(calculateChance(1150, 1000)).toBe("Low");
  });

  it("returns Not Recommended beyond 115% of the closing rank", () => {
    expect(calculateChance(1151, 1000)).toBe("Not Recommended");
  });
});

describe("valid options", () => {
  it("supports the two main engineering exams", () => {
    expect(VALID_EXAMS).toContain("JEE Main");
    expect(VALID_EXAMS).toContain("JEE Advanced");
  });

  it("includes core engineering branches", () => {
    expect(VALID_BRANCHES).toContain("Computer Science and Engineering");
    expect(VALID_BRANCHES.length).toBeGreaterThan(5);
  });
});