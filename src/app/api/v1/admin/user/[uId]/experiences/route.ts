import { NextRequest, NextResponse } from 'next/server';

import { isAuthError, requireAdminAuth } from '@/lib/admin-auth';
import { connectDB } from '@/lib/mongodb';
import { withTransaction } from '@/lib/transaction';
import { Experience, Image, Position, User } from '@/models';
import { IMAGE_USAGE_MODEL, IMAGE_USAGE_TYPE } from '@/types';

interface RouteParams {
  params: Promise<{ uId: string }>;
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
    const { uId } = await params;

    const user = await User.findById(uId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '找不到使用者' },
        { status: 404 },
      );
    }

    const experiences = await Experience.find({ userId: uId })
      .populate('companyIcon', '_id url')
      .sort({ sn: -1 })
      .lean();

    const experienceIds = experiences.map((experience) => experience._id);
    const positions = await Position.find({
      experienceId: { $in: experienceIds },
    })
      .sort({ sn: 1 })
      .lean();

    const positionsByExperience = positions.reduce<Record<string, unknown[]>>(
      (acc, position) => {
        const experienceId = position.experienceId.toString();
        if (!acc[experienceId]) {
          acc[experienceId] = [];
        }

        const { _id, experienceId: posExperienceId, ...rest } = position;
        acc[experienceId].push({
          id: _id.toString(),
          experienceId: posExperienceId.toString(),
          ...rest,
        });

        return acc;
      },
      {},
    );

    const data = experiences.map((experience) => {
      const { _id, companyIcon, ...rest } = experience;

      return {
        id: _id.toString(),
        companyIcon: transformImage(
          companyIcon as { _id: unknown; url: string } | null,
        ),
        ...rest,
        positions: positionsByExperience[_id.toString()] || [],
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get experiences error:', error);
    return NextResponse.json(
      { success: false, message: '取得工作經歷列表失敗' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAdminAuth();
    if (isAuthError(authResult)) {
      return authResult;
    }

    await connectDB();
    const { uId } = await params;

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

    const body = await request.json();
    const { company, companyIcon, sn, positions } = body;

    if (!company) {
      return NextResponse.json(
        { success: false, message: '公司名稱為必填欄位' },
        { status: 400 },
      );
    }

    if (!positions || !Array.isArray(positions) || positions.length === 0) {
      return NextResponse.json(
        { success: false, message: '至少需要一個職位' },
        { status: 400 },
      );
    }

    await withTransaction(async (session) => {
      const [experience] = await Experience.create(
        [
          {
            userId: uId,
            company,
            companyIcon: companyIcon || null,
            sn: sn || 0,
          },
        ],
        { session },
      );

      if (companyIcon) {
        await Image.findByIdAndUpdate(
          companyIcon,
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

      for (let index = 0; index < positions.length; index += 1) {
        const position = positions[index];
        await Position.create(
          [
            {
              experienceId: experience._id,
              title: position.title,
              startAt: position.startAt,
              endAt: position.endAt || null,
              isCurrent: position.isCurrent || false,
              description: position.description || '',
              sn: position.sn !== undefined ? position.sn : index,
            },
          ],
          { session },
        );
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create experience error:', error);
    return NextResponse.json(
      { success: false, message: '建立工作經歷失敗' },
      { status: 500 },
    );
  }
}
