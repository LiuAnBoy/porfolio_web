import { NextRequest, NextResponse } from 'next/server';

import { isAuthError, requireAdminAuth } from '@/lib/admin-auth';
import { deleteImage } from '@/lib/cloudinary';
import { connectDB } from '@/lib/mongodb';
import { withTransaction } from '@/lib/transaction';
import { Image, Project, Stack, Tag } from '@/models';
import { PROJECT_TYPES } from '@/models/Project';
import { IMAGE_USAGE_MODEL, IMAGE_USAGE_TYPE } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

function transformImage(image: { _id: unknown; url: string } | null) {
  if (!image) {
    return null;
  }

  return {
    id: String(image._id),
    url: image.url,
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAdminAuth();
    if (isAuthError(authResult)) {
      return authResult;
    }

    await connectDB();
    const { id } = await params;

    const project = await Project.findById(id)
      .populate('tags', 'label slug')
      .populate('stacks', 'label slug')
      .populate('cover', '_id url')
      .populate('gallery', '_id url')
      .lean();

    if (!project) {
      return NextResponse.json(
        { success: false, message: '找不到專案' },
        { status: 404 },
      );
    }

    const { _id, userId, tags, stacks, cover, gallery, ...rest } = project;

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { success: false, message: '取得專案失敗' },
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
    const userId = authResult.user.id;

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, message: '找不到專案' },
        { status: 404 },
      );
    }

    if (project.userId.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: '無權限' },
        { status: 403 },
      );
    }

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

    if (type !== undefined && !PROJECT_TYPES.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          message: '請提供有效的專案類型（WEB、APP、HYBRID）',
        },
        { status: 400 },
      );
    }

    if (tags && tags.length > 0) {
      const tagCount = await Tag.countDocuments({ _id: { $in: tags } });
      if (tagCount !== tags.length) {
        return NextResponse.json(
          { success: false, message: '部分標籤不存在' },
          { status: 400 },
        );
      }
    }

    if (stacks && stacks.length > 0) {
      const stackCount = await Stack.countDocuments({ _id: { $in: stacks } });
      if (stackCount !== stacks.length) {
        return NextResponse.json(
          { success: false, message: '部分技術棧不存在' },
          { status: 400 },
        );
      }
    }

    const oldCoverId = project.cover?.toString();
    const newCoverId = cover;
    const isCoverChanging = cover !== undefined && oldCoverId !== newCoverId;

    const oldGalleryIds = new Set<string>(
      (project.gallery || [])
        .map((imageId) => imageId?.toString())
        .filter((imageId): imageId is string => Boolean(imageId)),
    );
    const newGalleryIds = new Set<string>(
      (gallery || []).filter((imageId: string | undefined): imageId is string =>
        Boolean(imageId),
      ),
    );

    const galleryIdsToDelete: string[] = [];
    if (gallery !== undefined) {
      for (const oldId of oldGalleryIds) {
        if (!newGalleryIds.has(oldId)) {
          galleryIdsToDelete.push(oldId);
        }
      }
    }

    const galleryIdsToAdd: string[] = [];
    if (gallery !== undefined) {
      for (const newId of newGalleryIds) {
        if (!oldGalleryIds.has(newId)) {
          galleryIdsToAdd.push(newId);
        }
      }
    }

    if (isCoverChanging && oldCoverId) {
      const oldImage = await Image.findById(oldCoverId);
      if (oldImage) {
        await deleteImage(oldImage.publicId);
      }
    }

    for (const imageId of galleryIdsToDelete) {
      const oldImage = await Image.findById(imageId);
      if (oldImage) {
        await deleteImage(oldImage.publicId);
      }
    }

    await withTransaction(async (session) => {
      if (isCoverChanging && oldCoverId) {
        await Image.findByIdAndDelete(oldCoverId, { session });
      }

      if (isCoverChanging && newCoverId) {
        await Image.findByIdAndUpdate(
          newCoverId,
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

      for (const imageId of galleryIdsToDelete) {
        await Image.findByIdAndDelete(imageId, { session });
      }

      for (const imageId of galleryIdsToAdd) {
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

      if (title !== undefined) {
        project.title = title;
      }
      if (description !== undefined) {
        project.description = description;
      }
      if (type !== undefined) {
        project.type = type;
      }
      if (tags !== undefined) {
        project.tags = tags;
      }
      if (stacks !== undefined) {
        project.stacks = stacks;
      }
      if (isFeatured !== undefined) {
        project.isFeatured = isFeatured;
      }
      if (isVisible !== undefined) {
        project.isVisible = isVisible;
      }
      if (link !== undefined) {
        project.link = link;
      }
      if (partner !== undefined) {
        project.partner = partner;
      }
      if (cover !== undefined) {
        project.cover = cover;
      }
      if (gallery !== undefined) {
        project.gallery = gallery;
      }

      await project.save({ session });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { success: false, message: '更新專案失敗' },
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
    const userId = authResult.user.id;

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, message: '找不到專案' },
        { status: 404 },
      );
    }

    if (project.userId.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: '無權限' },
        { status: 403 },
      );
    }

    const imageIdsToDelete: string[] = [];
    if (project.cover) {
      imageIdsToDelete.push(project.cover.toString());
    }
    if (project.gallery && project.gallery.length > 0) {
      for (const imageId of project.gallery) {
        if (imageId) {
          imageIdsToDelete.push(imageId.toString());
        }
      }
    }

    for (const imageId of imageIdsToDelete) {
      const image = await Image.findById(imageId);
      if (image) {
        await deleteImage(image.publicId);
      }
    }

    await withTransaction(async (session) => {
      for (const imageId of imageIdsToDelete) {
        await Image.findByIdAndDelete(imageId, { session });
      }

      await Project.findByIdAndDelete(id, { session });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { success: false, message: '刪除專案失敗' },
      { status: 500 },
    );
  }
}
