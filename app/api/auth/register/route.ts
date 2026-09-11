import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/college";
import {
  hashPassword,
  setAuthCookie,
} from "@/lib/auth";
import {
  checkRateLimit,
  getClientIp,
} from "@/lib/rate-limit";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const REGISTER_LIMIT = 5;
const REGISTER_WINDOW_MS = 60 * 60 * 1000; // 5 signups per IP per hour

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfter } = checkRateLimit(
      `register:${ip}`,
      REGISTER_LIMIT,
      REGISTER_WINDOW_MS
    );
    if (!allowed) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          message: `Too many signup attempts. Please try again in ${retryAfter} seconds.`,
        },
      };
      return NextResponse.json(response, {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      });
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: "Please enter your full name" },
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: "Please enter a valid email address" },
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: "Password must be at least 6 characters" },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (existing) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: "An account with this email already exists" },
      };
      return NextResponse.json(response, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashPassword(password),
      },
    });

    await setAuthCookie(user.id);

    const response: ApiResponse<{ id: string; name: string; email: string }> = {
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error in register:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: { message: "Something went wrong while creating your account" },
    };
    return NextResponse.json(response, { status: 500 });
  }
}