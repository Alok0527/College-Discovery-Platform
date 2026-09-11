import { describe, it, expect, afterEach, vi } from "vitest";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
} from "@/lib/auth";

describe("password hashing", () => {
  it("hashes a password and verifies it", () => {
    const hash = hashPassword("secret123");
    expect(hash).not.toBe("secret123");
    expect(hash).toContain(":");
    expect(verifyPassword("secret123", hash)).toBe(true);
  });

  it("rejects an incorrect password", () => {
    const hash = hashPassword("secret123");
    expect(verifyPassword("wrong", hash)).toBe(false);
  });

  it("rejects a malformed stored hash", () => {
    expect(verifyPassword("secret123", "")).toBe(false);
    expect(verifyPassword("secret123", "justsalthash")).toBe(false);
  });

  it("uses a unique salt for each hash", () => {
    expect(hashPassword("same")).not.toBe(hashPassword("same"));
  });
});

describe("session tokens", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("signs and verifies a token for the same user", () => {
    const token = createSessionToken("user-1");
    expect(token).toContain(".");
    expect(verifySessionToken(token)).toBe("user-1");
  });

  it("rejects a tampered payload", () => {
    const token = createSessionToken("user-1");
    const [, sig] = token.split(".");
    const fakePayload = Buffer.from(
      JSON.stringify({ sub: "user-2", exp: Date.now() + 100000 })
    ).toString("base64url");
    expect(verifySessionToken(`${fakePayload}.${sig}`)).toBeNull();
  });

  it("rejects malformed tokens", () => {
    expect(verifySessionToken("")).toBeNull();
    expect(verifySessionToken("not-a-token")).toBeNull();
    expect(verifySessionToken("payloadonly")).toBeNull();
  });

  it("rejects expired tokens", () => {
    const now = new Date(2024, 0, 1).getTime();
    vi.useFakeTimers();
    vi.setSystemTime(now);

    const token = createSessionToken("user-1");
    expect(verifySessionToken(token)).toBe("user-1");

    vi.setSystemTime(now + 8 * 24 * 60 * 60 * 1000);
    expect(verifySessionToken(token)).toBeNull();
  });
});