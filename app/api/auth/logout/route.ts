import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/college";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  await clearAuthCookie();
  const response: ApiResponse<null> = { success: true, data: null };
  return NextResponse.json(response);
}