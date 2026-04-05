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

    return NextResponse.json({
      success: true,
      data: stacks.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest })),
    });
  } catch (error) {
    console.error("Get stacks error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get stacks" },
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
        { success: false, message: "Label is required" },
        { status: 400 },
      );
    }

    const existingStack = await Stack.findOne({
      label: { $regex: new RegExp(`^${label}$`, "i") },
    });

    if (existingStack) {
      return NextResponse.json(
        { success: false, message: "Stack already exists" },
        { status: 409 },
      );
    }

    const stack = await Stack.create({ label });
    const { _id, ...rest } = stack.toObject();

    return NextResponse.json({
      success: true,
      data: { id: _id.toString(), ...rest },
    });
  } catch (error) {
    console.error("Create stack error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create stack" },
      { status: 500 },
    );
  }
}
