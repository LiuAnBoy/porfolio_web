import { NextResponse } from "next/server";

import { isAuthError, requireAdminAuth } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Image, Project, Stack, Tag } from "@/models";
import type { DashboardInitData } from "@/types";

/**
 * GET /api/v1/admin/init
 * Dashboard initialization data.
 */
export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (isAuthError(authResult)) {
      return authResult;
    }

    await connectDB();

    const [projectCount, tagCount, stackCount, imageCount] = await Promise.all([
      Project.countDocuments(),
      Tag.countDocuments(),
      Stack.countDocuments(),
      Image.countDocuments(),
    ]);

    const [recentProjects, recentImages, recentTags, recentStacks] =
      await Promise.all([
        Project.find({ updatedAt: { $ne: null } })
          .select("title updatedAt")
          .sort({ updatedAt: -1 })
          .limit(5)
          .lean(),
        Image.find({ updatedAt: { $ne: null } })
          .select("url updatedAt")
          .sort({ updatedAt: -1 })
          .limit(5)
          .lean(),
        Tag.find({ updatedAt: { $ne: null } })
          .select("label slug updatedAt")
          .sort({ updatedAt: -1 })
          .limit(5)
          .lean(),
        Stack.find({ updatedAt: { $ne: null } })
          .select("label slug updatedAt")
          .sort({ updatedAt: -1 })
          .limit(5)
          .lean(),
      ]);

    const data: DashboardInitData = {
      counts: {
        projects: projectCount,
        tags: tagCount,
        stacks: stackCount,
        images: imageCount,
      },
      recentProjects: recentProjects.map((project) => ({
        id: project._id.toString(),
        name: project.title,
        updatedAt: project.updatedAt as number,
      })),
      recentImages: recentImages.map((image) => ({
        id: image._id.toString(),
        url: image.url,
        updatedAt: image.updatedAt as number,
      })),
      recentTags: recentTags.map((tag) => ({
        id: tag._id.toString(),
        label: tag.label,
        slug: tag.slug,
        updatedAt: tag.updatedAt as number,
      })),
      recentStacks: recentStacks.map((stack) => ({
        id: stack._id.toString(),
        label: stack.label,
        slug: stack.slug,
        updatedAt: stack.updatedAt as number,
      })),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get init data error:", error);
    return NextResponse.json(
      { success: false, message: "初始化資料取得失敗" },
      { status: 500 },
    );
  }
}
