import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/college";
import { getCurrentUserId } from "@/lib/auth";

export interface MyReview {
  id: string;
  collegeId: string;
  collegeName: string;
  collegeSlug: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: "Not authenticated" },
      };
      return NextResponse.json(response, { status: 401 });
    }

    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        college: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const data: MyReview[] = reviews.map(
      (r: Record<string, unknown>) => ({
        id: String(r.id),
        collegeId: String(r.collegeId),
        collegeName: String(
          (r.college as { name: string }).name
        ),
        collegeSlug: String(
          (r.college as { slug: string }).slug
        ),
        rating: Number(r.rating),
        comment: String(r.comment),
        createdAt: String(r.createdAt),
      })
    );

    const response: ApiResponse<MyReview[]> = {
      success: true,
      data,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching my reviews:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: { message: "Something went wrong while loading your reviews" },
    };
    return NextResponse.json(response, { status: 500 });
  }
}