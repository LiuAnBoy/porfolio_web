import { NextRequest } from "next/server";

import { handleOptions, jsonWithCors } from "@/lib/cors";
import { connectDB } from "@/lib/mongodb";
import { Project, Stack, Tag } from "@/models";

export const OPTIONS = handleOptions;

/**
 * GET /api/v1/projects
 * Public project list with pagination and filters.
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const isFeatured = searchParams.get("isFeatured");
    const isVisible = searchParams.get("isVisible");
    const tagsParam = searchParams.get("tags");
    const stacksParam = searchParams.get("stacks");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const page_size = Math.min(
      parseInt(searchParams.get("page_size") || "20", 10),
      100,
    );

    const query: Record<string, unknown> = {};

    if (type) {
      query.type = type;
    }
    if (isFeatured !== null) {
      query.isFeatured = isFeatured === "true";
    }
    if (isVisible !== null) {
      query.isVisible = isVisible === "true";
    }

    if (tagsParam) {
      const tagSlugs = tagsParam.split(",").filter(Boolean);
      if (tagSlugs.length > 0) {
        const tags = await Tag.find({ slug: { $in: tagSlugs } }).select("_id");
        query.tags = { $all: tags.map((tag) => tag._id) };
      }
    }

    if (stacksParam) {
      const stackSlugs = stacksParam.split(",").filter(Boolean);
      if (stackSlugs.length > 0) {
        const stacks = await Stack.find({ slug: { $in: stackSlugs } }).select(
          "_id",
        );
        query.stacks = { $all: stacks.map((stack) => stack._id) };
      }
    }

    const skip = (page - 1) * page_size;
    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate("tags", "label slug")
        .populate("stacks", "label slug")
        .populate("cover", "url")
        .populate("gallery", "url")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(page_size)
        .lean(),
      Project.countDocuments(query),
    ]);

    const data = projects.map((project) => {
      const {
        _id,
        title,
        slug,
        description,
        type,
        tags,
        stacks,
        isFeatured,
        isVisible,
        link,
        partner,
        cover,
        gallery,
      } = project;

      return {
        id: _id.toString(),
        title,
        slug,
        description,
        type,
        tags: (
          tags as unknown as Array<{
            _id: unknown;
            label: string;
            slug: string;
          }>
        ).map((tag) => ({
          id: String(tag._id),
          label: tag.label,
          slug: tag.slug,
        })),
        stacks: (
          stacks as unknown as Array<{
            _id: unknown;
            label: string;
            slug: string;
          }>
        ).map((stack) => ({
          id: String(stack._id),
          label: stack.label,
          slug: stack.slug,
        })),
        cover: (cover as unknown as { url: string } | null)?.url || null,
        gallery: ((gallery || []) as unknown as Array<{ url: string }>).map(
          (item) => item.url,
        ),
        isFeatured,
        isVisible,
        link,
        partner,
      };
    });

    return jsonWithCors({ payload: data, total_count: total, page_size, page });
  } catch (error) {
    console.error("Get public projects error:", error);
    return jsonWithCors(
      { success: false, message: "取得專案列表失敗" },
      { status: 500 },
    );
  }
}
