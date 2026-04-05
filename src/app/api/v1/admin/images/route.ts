import { NextRequest, NextResponse } from "next/server";

import { isAuthError, requireAdminAuth } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Image } from "@/models";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (isAuthError(authResult)) {
      return authResult;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const isPending = searchParams.get("isPending");
    const model = searchParams.get("model");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const query: Record<string, unknown> = {};

    if (isPending !== null) {
      query.isPending = isPending === "true";
    }

    if (model) {
      query["usage.model"] = model.toUpperCase();
    }

    const skip = (page - 1) * limit;
    const [images, total] = await Promise.all([
      Image.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Image.countDocuments(query),
    ]);

    const data = images.map((image) => {
      const { _id, usage, ...rest } = image;

      return {
        id: _id.toString(),
        usage: usage
          ? {
              type: usage.type,
              refId: usage.refId.toString(),
              model: usage.model,
            }
          : null,
        ...rest,
      };
    });

    return NextResponse.json({ success: true, data, page, limit, total });
  } catch (error) {
    console.error("Get images error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get images" },
      { status: 500 },
    );
  }
}
