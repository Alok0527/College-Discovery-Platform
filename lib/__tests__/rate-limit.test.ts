import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("allows requests within the limit", () => {
    expect(checkRateLimit("test-allow", 3, 60000).allowed).toBe(true);
    expect(checkRateLimit("test-allow", 3, 60000).allowed).toBe(true);
    expect(checkRateLimit("test-allow", 3, 60000).allowed).toBe(true);
  });

  it("blocks requests that exceed the limit", () => {
    checkRateLimit("test-block", 2, 60000);
    checkRateLimit("test-block", 2, 60000);
    const result = checkRateLimit("test-block", 2, 60000);
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
    expect(result.retryAfter).toBeLessThanOrEqual(60);
  });

  it("resets the window after it expires", () => {
    checkRateLimit("test-reset", 1, -1);
    const result = checkRateLimit("test-reset", 1, 60000);
    expect(result.allowed).toBe(true);
  });

  it("tracks independent keys separately", () => {
    checkRateLimit("test-key-a", 1, 60000);
    expect(checkRateLimit("test-key-b", 1, 60000).allowed).toBe(true);
  });
});