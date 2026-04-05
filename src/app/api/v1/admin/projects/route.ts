import { NextRequest, NextResponse } from "next/server";

import { isAuthError, requireAdminAuth } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { withTransaction } from "@/lib/transaction";
import { Image, Project, Stack, Tag } from "@/models";
import { PROJECT_TYPES } from "@/models/Project";
import { IMAGE_USAGE_MODEL, IMAGE_USAGE_TYPE } from "@/types";

function transformImage(image: { _id: unknown; url: string } | null) {
  if (!image) {
    return null;
  }

  return {
    id: String(image._id),
    url: image.url,
  };
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (isAuthError(authResult)) {
      return authResult;
    }

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
        .populate("cover", "_id url")
        .populate("gallery", "_id url")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(page_size)
        .lean(),
      Project.countDocuments(query),
    ]);

    const data = projects.map((project) => {
      const { _id, userId, tags, stacks, cover, gallery, ...rest } = project;

      return {
        id: _id.toString(),
        userId: userId.toString(),
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
        cover: transformImage(
          cover as unknown as { _id: unknown; url: string } | null,
        ),
        gallery: (
          (gallery || []) as unknown as Array<{ _id: unknown; url: string }>
        ).map((item) => transformImage(item)!),
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
    console.error("Get projects error:", error);
    return NextResponse.json(
      { success: false, message: "取得專案列表失敗" },
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

    const userId = authResult.user.id;
    const body = await request.json();
    const {
      title,
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
    } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, message: "標題為必填欄位" },
        { status: 400 },
      );
    }

    if (!description) {
      return NextResponse.json(
        { success: false, message: "描述為必填欄位" },
        { status: 400 },
      );
    }

    if (!type || !PROJECT_TYPES.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          message: "請提供有效的專案類型（WEB、APP、HYBRID）",
        },
        { status: 400 },
      );
    }

    if (tags && tags.length > 0) {
      const tagCount = await Tag.countDocuments({ _id: { $in: tags } });
      if (tagCount !== tags.length) {
        return NextResponse.json(
          { success: false, message: "部分標籤不存在" },
          { status: 400 },
        );
      }
    }

    if (stacks && stacks.length > 0) {
      const stackCount = await Stack.countDocuments({ _id: { $in: stacks } });
      if (stackCount !== stacks.length) {
        return NextResponse.json(
          { success: false, message: "部分技術棧不存在" },
          { status: 400 },
        );
      }
    }

    let project;

    await withTransaction(async (session) => {
      [project] = await Project.create(
        [
          {
            userId,
            title,
            description,
            type,
            tags: tags || [],
            stacks: stacks || [],
            isFeatured: isFeatured || false,
            isVisible: isVisible !== false,
            link: link || null,
            partner: partner || null,
            cover: cover || null,
            gallery: gallery || [],
          },
        ],
        { session },
      );

      if (cover) {
        await Image.findByIdAndUpdate(
          cover,
          {
            isPending: false,
            usage: {
              type: IMAGE_USAGE_TYPE.PROJECT_COVER,
              refId: project._id,
              model: IMAGE_USAGE_MODEL.PROJECT,
            },
          },
          { session },
        );
      }

      if (gallery && gallery.length > 0) {
        for (const imageId of gallery) {
          if (imageId) {
            await Image.findByIdAndUpdate(
              imageId,
              {
                isPending: false,
                usage: {
                  type: IMAGE_USAGE_TYPE.PROJECT_GALLERY,
                  refId: project._id,
                  model: IMAGE_USAGE_MODEL.PROJECT,
                },
              },
              { session },
            );
          }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { success: false, message: "建立專案失敗" },
      { status: 500 },
    );
  }
}
