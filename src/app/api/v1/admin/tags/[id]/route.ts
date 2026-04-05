import { NextRequest, NextResponse } from "next/server";

import { isAuthError, requireAdminAuth } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Tag } from "@/models";

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

    const tag = await Tag.findById(id).lean();

    if (!tag) {
      return NextResponse.json(
        { success: false, message: "Tag not found" },
        { status: 404 },
      );
    }

    const { _id, ...rest } = tag;
    return NextResponse.json({
      success: true,
      data: { id: _id.toString(), ...rest },
    });
  } catch (error) {
    console.error("Get tag error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get tag" },
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

    const tag = await Tag.findById(id);
    if (!tag) {
      return NextResponse.json(
        { success: false, message: "Tag not found" },
        { status: 404 },
      );
    }

    const { label } = body;

    if (label !== undefined) {
      const existingTag = await Tag.findOne({
        _id: { $ne: id },
        label: { $regex: new RegExp(`^${label}$`, "i") },
      });

      if (existingTag) {
        return NextResponse.json(
          { success: false, message: "Tag with this label already exists" },
          { status: 409 },
        );
      }

      tag.label = label;
    }

    await tag.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update tag error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update tag" },
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

    const tag = await Tag.findById(id);
    if (!tag) {
      return NextResponse.json(
        { success: false, message: "Tag not found" },
        { status: 404 },
      );
    }

    await Tag.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete tag error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete tag" },
      { status: 500 },
    );
  }
}
