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

    return NextResponse.json({
      success: true,
      data: tags.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest })),
    });
  } catch (error) {
    console.error("Get tags error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get tags" },
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

    const existingTag = await Tag.findOne({
      label: { $regex: new RegExp(`^${label}$`, "i") },
    });

    if (existingTag) {
      return NextResponse.json(
        { success: false, message: "Tag already exists" },
        { status: 409 },
      );
    }

    const tag = await Tag.create({ label });
    const { _id, ...rest } = tag.toObject();

    return NextResponse.json({
      success: true,
      data: { id: _id.toString(), ...rest },
    });
  } catch (error) {
    console.error("Create tag error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create tag" },
      { status: 500 },
    );
  }
}
