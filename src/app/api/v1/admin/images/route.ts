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
    const page_size = Math.min(
      parseInt(searchParams.get("page_size") || "20", 10),
      100,
    );

    const query: Record<string, unknown> = {};

    if (isPending !== null) {
      query.isPending = isPending === "true";
    }

    if (model) {
      query["usage.model"] = model.toUpperCase();
    }

    const skip = (page - 1) * page_size;
    const [images, total] = await Promise.all([
      Image.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(page_size)
        .lean(),
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

    return NextResponse.json({
      payload: data,
      total_count: total,
      page_size,
      page,
    });
  } catch (error) {
    console.error("Get images error:", error);
    return NextResponse.json(
      { success: false, message: "取得圖片列表失敗" },
      { status: 500 },
    );
  }
}
