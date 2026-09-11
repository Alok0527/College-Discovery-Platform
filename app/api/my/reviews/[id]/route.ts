import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/college";
import { getCurrentUserId } from "@/lib/auth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getCurrentUserId();
    if (!userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: "Not authenticated" },
      };
      return NextResponse.json(response, { status: 401 });
    }

    const review = await prisma.review.findUnique({
      where: { id },
    });
    if (!review || review.userId !== userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: "Review not found" },
      };
      return NextResponse.json(response, { status: 404 });
    }

    await prisma.review.delete({ where: { id } });

    const response: ApiResponse<null> = { success: true, data: null };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting review:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: { message: "Something went wrong while deleting the review" },
    };
    return NextResponse.json(response, { status: 500 });
  }
}