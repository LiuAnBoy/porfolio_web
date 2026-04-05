import { NextRequest, NextResponse } from "next/server";

import { isAuthError, requireAdminAuth } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Tag } from "@/models";

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (isAuthError(authResult)) {
      return authResult;
    }

    await connectDB();

    const tags = await Tag.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      tags.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest })),
    );
  } catch (error) {
    console.error("Get tags error:", error);
    return NextResponse.json(
      { success: false, message: "取得標籤列表失敗" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (isAuthError(authResult)) {
      return authResult;
    }

    await connectDB();
    const body = await request.json();
    const { label } = body;

    if (!label) {
      return NextResponse.json(
        { success: false, message: "標籤名稱為必填欄位" },
        { status: 400 },
      );
    }

    const existingTag = await Tag.findOne({
      label: { $regex: new RegExp(`^${label}$`, "i") },
    });

    if (existingTag) {
      return NextResponse.json(
        { success: false, message: "標籤已存在" },
        { status: 409 },
      );
    }

    await Tag.create({ label });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create tag error:", error);
    return NextResponse.json(
      { success: false, message: "建立標籤失敗" },
      { status: 500 },
    );
  }
}
