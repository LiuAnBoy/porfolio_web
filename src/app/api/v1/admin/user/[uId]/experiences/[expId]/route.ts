import dayjs from 'dayjs';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { isAuthError, requireAdminAuth } from '@/lib/admin-auth';
import { deleteImage } from '@/lib/cloudinary';
import { connectDB } from '@/lib/mongodb';
import { withTransaction } from '@/lib/transaction';
import { Experience, Image, Position, User } from '@/models';
import { IMAGE_USAGE_MODEL, IMAGE_USAGE_TYPE } from '@/types';

interface RouteParams {
  params: Promise<{ uId: string; expId: string }>;
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
    const { uId, expId } = await params;

    const user = await User.findById(uId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '找不到使用者' },
        { status: 404 },
      );
    }

    const experience = await Experience.findOne({ _id: expId, userId: uId })
      .populate('companyIcon', '_id url')
      .lean();

    if (!experience) {
      return NextResponse.json(
        { success: false, message: '找不到工作經歷' },
        { status: 404 },
      );
    }

    const positions = await Position.find({ experienceId: expId })
      .sort({ sn: 1 })
      .lean();

    const transformedPositions = positions.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));

    const { _id, companyIcon, ...rest } = experience;

    return NextResponse.json({
      id: _id.toString(),
      companyIcon: transformImage(
        companyIcon as { _id: unknown; url: string } | null,
      ),
      ...rest,
      positions: transformedPositions,
    });
  } catch (error) {
    console.error('Get experience error:', error);
    return NextResponse.json(
      { success: false, message: '取得工作經歷失敗' },
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
    const { uId, expId } = await params;

    if (authResult.user.id !== uId) {
      return NextResponse.json(
        { success: false, message: '無權限' },
        { status: 403 },
      );
    }

    const user = await User.findById(uId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '找不到使用者' },
        { status: 404 },
      );
    }

    const experience = await Experience.findOne({ _id: expId, userId: uId });
    if (!experience) {
      return NextResponse.json(
        { success: false, message: '找不到工作經歷' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { company, companyIcon, sn, positions } = body;

    const oldIconId = experience.companyIcon?.toString();
    const newIconId = companyIcon;
    const isIconChanging = companyIcon !== undefined && oldIconId !== newIconId;

    if (isIconChanging && oldIconId) {
      const oldImage = await Image.findById(oldIconId);
      if (oldImage) {
        await deleteImage(oldImage.publicId);
      }
    }

    const existingPositions = await Position.find({ experienceId: expId });
    const existingIds = new Set(
      existingPositions.map((position) => position._id.toString()),
    );
    const sentIds = new Set(
      positions
        ?.filter((position: { id?: string }) => position.id)
        .map((position: { id: string }) => position.id.toString()) || [],
    );

    await withTransaction(async (session) => {
      if (isIconChanging && oldIconId) {
        await Image.findByIdAndDelete(oldIconId, { session });
      }

      if (isIconChanging && newIconId) {
        await Image.findByIdAndUpdate(
          newIconId,
          {
            isPending: false,
            usage: {
              type: IMAGE_USAGE_TYPE.EXPERIENCE,
              refId: experience._id,
              model: IMAGE_USAGE_MODEL.EXPERIENCE,
            },
          },
          { session },
        );
      }

      if (companyIcon !== undefined) {
        experience.companyIcon = companyIcon;
      }
      if (company !== undefined) {
        experience.company = company;
      }
      if (sn !== undefined) {
        experience.sn = sn;
      }

      await experience.save({ session });

      if (positions && Array.isArray(positions)) {
        for (const existing of existingPositions) {
          if (!sentIds.has(existing._id.toString())) {
            await Position.findByIdAndDelete(existing._id, { session });
          }
        }

        const now = dayjs().unix();
        for (const position of positions) {
          if (!position.id) {
            await Position.create(
              [
                {
                  experienceId: expId,
                  title: position.title,
                  startAt: position.startAt,
                  endAt: position.endAt || null,
                  isCurrent: position.isCurrent || false,
                  description: position.description || '',
                  sn: position.sn || 0,
                },
              ],
              { session },
            );
          } else if (existingIds.has(position.id.toString())) {
            await Position.findByIdAndUpdate(
              position.id,
              {
                title: position.title,
                startAt: position.startAt,
                endAt: position.endAt || null,
                isCurrent: position.isCurrent || false,
                description: position.description || '',
                sn: position.sn || 0,
                updatedAt: now,
              },
              { session },
            );
          }
        }
      }
    });

    revalidateTag('user-profile');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update experience error:', error);
    return NextResponse.json(
      { success: false, message: '更新工作經歷失敗' },
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
    const { uId, expId } = await params;

    if (authResult.user.id !== uId) {
      return NextResponse.json(
        { success: false, message: '無權限' },
        { status: 403 },
      );
    }

    const user = await User.findById(uId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '找不到使用者' },
        { status: 404 },
      );
    }

    const experience = await Experience.findOne({ _id: expId, userId: uId });
    if (!experience) {
      return NextResponse.json(
        { success: false, message: '找不到工作經歷' },
        { status: 404 },
      );
    }

    if (experience.companyIcon) {
      const image = await Image.findById(experience.companyIcon);
      if (image) {
        await deleteImage(image.publicId);
      }
    }

    await withTransaction(async (session) => {
      if (experience.companyIcon) {
        await Image.findByIdAndDelete(experience.companyIcon, { session });
      }

      await Position.deleteMany({ experienceId: expId }, { session });
      await Experience.findByIdAndDelete(expId, { session });

      const remainingExperiences = await Experience.find({ userId: uId })
        .sort({ sn: -1 })
        .session(session);

      for (let index = 0; index < remainingExperiences.length; index += 1) {
        const newSn = remainingExperiences.length - 1 - index;
        if (remainingExperiences[index].sn !== newSn) {
          remainingExperiences[index].sn = newSn;
          await remainingExperiences[index].save({ session });
        }
      }
    });

    revalidateTag('user-profile');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete experience error:', error);
    return NextResponse.json(
      { success: false, message: '刪除工作經歷失敗' },
      { status: 500 },
    );
  }
}
