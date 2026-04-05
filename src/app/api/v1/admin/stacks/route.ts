import { NextRequest, NextResponse } from "next/server";

import { isAuthError, requireAdminAuth } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Stack } from "@/models";

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (isAuthError(authResult)) {
      return authResult;
    }

    await connectDB();

    const stacks = await Stack.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      stacks.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest })),
    );
  } catch (error) {
    console.error("Get stacks error:", error);
    return NextResponse.json(
      { success: false, message: "取得技術棧列表失敗" },
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
        { success: false, message: "技術棧名稱為必填欄位" },
        { status: 400 },
      );
    }

    const existingStack = await Stack.findOne({
      label: { $regex: new RegExp(`^${label}$`, "i") },
    });

    if (existingStack) {
      return NextResponse.json(
        { success: false, message: "技術棧已存在" },
        { status: 409 },
      );
    }

    await Stack.create({ label });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create stack error:", error);
    return NextResponse.json(
      { success: false, message: "建立技術棧失敗" },
      { status: 500 },
    );
  }
}
