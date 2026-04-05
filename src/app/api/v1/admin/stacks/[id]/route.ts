import { NextRequest, NextResponse } from "next/server";

import { isAuthError, requireAdminAuth } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Stack } from "@/models";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAdminAuth();
    if (isAuthError(authResult)) {
      return authResult;
    }

    await connectDB();
    const { id } = await params;

    const stack = await Stack.findById(id).lean();

    if (!stack) {
      return NextResponse.json(
        { success: false, message: "找不到技術棧" },
        { status: 404 },
      );
    }

    const { _id, ...rest } = stack;
    return NextResponse.json({ id: _id.toString(), ...rest });
  } catch (error) {
    console.error("Get stack error:", error);
    return NextResponse.json(
      { success: false, message: "取得技術棧失敗" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAdminAuth();
    if (isAuthError(authResult)) {
      return authResult;
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const stack = await Stack.findById(id);
    if (!stack) {
      return NextResponse.json(
        { success: false, message: "找不到技術棧" },
        { status: 404 },
      );
    }

    const { label } = body;

    if (label !== undefined) {
      const existingStack = await Stack.findOne({
        _id: { $ne: id },
        label: { $regex: new RegExp(`^${label}$`, "i") },
      });

      if (existingStack) {
        return NextResponse.json(
          { success: false, message: "相同名稱的技術棧已存在" },
          { status: 409 },
        );
      }

      stack.label = label;
    }

    await stack.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update stack error:", error);
    return NextResponse.json(
      { success: false, message: "更新技術棧失敗" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAdminAuth();
    if (isAuthError(authResult)) {
      return authResult;
    }

    await connectDB();
    const { id } = await params;

    const stack = await Stack.findById(id);
    if (!stack) {
      return NextResponse.json(
        { success: false, message: "找不到技術棧" },
        { status: 404 },
      );
    }

    await Stack.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete stack error:", error);
    return NextResponse.json(
      { success: false, message: "刪除技術棧失敗" },
      { status: 500 },
    );
  }
}
