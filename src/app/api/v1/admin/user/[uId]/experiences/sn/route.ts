import { NextRequest, NextResponse } from "next/server";

import { isAuthError, requireAdminAuth } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { withTransaction } from "@/lib/transaction";
import { Experience, User } from "@/models";

interface RouteParams {
  params: Promise<{ uId: string }>;
}

interface SnItem {
  id: string;
  sn: number;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAdminAuth();
    if (isAuthError(authResult)) {
      return authResult;
    }

    await connectDB();
    const { uId } = await params;

    if (authResult.user.id !== uId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const body: SnItem[] = await request.json();

    const user = await User.findById(uId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 },
      );
    }

    await withTransaction(async (session) => {
      for (const item of body) {
        await Experience.findByIdAndUpdate(
          item.id,
          { sn: item.sn },
          { session },
        );
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update experience order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update experience order" },
      { status: 500 },
    );
  }
}
