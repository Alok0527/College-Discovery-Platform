import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/college";
import {
  setAuthCookie,
  verifyPassword,
} from "@/lib/auth";
import {
  checkRateLimit,
  getClientIp,
} from "@/lib/rate-limit";

const LOGIN_LIMIT = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 10 attempts per IP+email per 15 min

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || typeof email !== "string" || !password) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: "Email and password are required" },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const ip = getClientIp(request);
    const { allowed, retryAfter } = checkRateLimit(
      `login:${ip}:${email.toLowerCase().trim()}`,
      LOGIN_LIMIT,
      LOGIN_WINDOW_MS
    );
    if (!allowed) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          message: `Too many login attempts. Please try again in ${retryAfter} seconds.`,
        },
      };
      return NextResponse.json(response, {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !verifyPassword(password, user.password)) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: "Invalid email or password" },
      };
      return NextResponse.json(response, { status: 401 });
    }

    await setAuthCookie(user.id);

    const response: ApiResponse<{ id: string; name: string; email: string }> = {
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in login:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: { message: "Something went wrong while signing in" },
    };
    return NextResponse.json(response, { status: 500 });
  }
}