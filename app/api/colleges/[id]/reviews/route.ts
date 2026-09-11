import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/college";
import { getCurrentUserId } from "@/lib/auth";
import {
  checkRateLimit,
  getClientIp,
} from "@/lib/rate-limit";

const REVIEW_LIMIT = 5;
const REVIEW_WINDOW_MS = 15 * 60 * 1000; // 5 reviews per IP per 15 min

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ip = getClientIp(request);
    const { allowed, retryAfter } = checkRateLimit(
      `reviews:${ip}`,
      REVIEW_LIMIT,
      REVIEW_WINDOW_MS
    );
    if (!allowed) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          message: `Too many review submissions. Please try again in ${retryAfter} seconds.`,
        },
      };
      return NextResponse.json(response, {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      });
    }

    const body = await request.json();
    const { rating, comment } = body;

    if (!id) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: "College ID is required" },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const college = await prisma.college.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });
    if (!college) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: "College not found" },
      };
      return NextResponse.json(response, { status: 404 });
    }

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: "Rating must be a number between 1 and 5" },
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (
      !comment ||
      typeof comment !== "string" ||
      comment.trim().length < 10
    ) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: "Comment must be at least 10 characters" },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const userId = await getCurrentUserId();
    const review = await prisma.review.create({
      data: {
        collegeId: college.id,
        rating: Math.round(rating),
        comment: comment.trim(),
        userId: userId ?? undefined,
      },
    });

    const response: ApiResponse<typeof review> = {
      success: true,
      data: review,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: { message: "Something went wrong while submitting the review" },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
