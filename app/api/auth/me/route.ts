import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/college";
import { getCurrentUserId } from "@/lib/auth";

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: "User not found" },
      };
      return NextResponse.json(response, { status: 401 });
    }

    const response: ApiResponse<{ id: string; name: string; email: string }> = {
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in me:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: { message: "Something went wrong" },
    };
    return NextResponse.json(response, { status: 500 });
  }
}