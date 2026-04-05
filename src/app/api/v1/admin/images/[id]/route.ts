import crypto from 'crypto';
import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';

import { isAuthError, requireAdminAuth } from '@/lib/admin-auth';
import { deleteImage, uploadImage } from '@/lib/cloudinary';
import { connectDB } from '@/lib/mongodb';
import { Image } from '@/models';

interface RouteParams {
  params: Promise<{ id: string }>;
}

function generateHash(buffer: Buffer): string {
  return crypto.createHash('md5').update(buffer).digest('hex');
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireAdminAuth();
    if (isAuthError(authResult)) {
      return authResult;
    }

    await connectDB();
    const { id } = await params;

    const image = await Image.findById(id).lean();
    if (!image) {
      return NextResponse.json(
        { success: false, message: '找不到圖片' },
        { status: 404 },
      );
    }

    const { _id, usage, ...rest } = image;

    return NextResponse.json({
      id: _id.toString(),
      usage: usage
        ? {
            type: usage.type,
            refId: usage.refId.toString(),
            model: usage.model,
          }
        : null,
      ...rest,
    });
  } catch (error) {
    console.error('Get image error:', error);
    return NextResponse.json(
      { success: false, message: '取得圖片失敗' },
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

    const image = await Image.findById(id);
    if (!image) {
      return NextResponse.json(
        { success: false, message: '找不到圖片' },
        { status: 404 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: '未提供檔案' },
        { status: 400 },
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: '檔案必須是圖片格式' },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const newHash = generateHash(buffer);

    if (newHash === image.hash) {
      return NextResponse.json({ success: true });
    }

    await deleteImage(image.publicId);

    const cloudinaryResult = await uploadImage(buffer);

    image.publicId = cloudinaryResult.publicId;
    image.url = cloudinaryResult.secureUrl;
    image.hash = newHash;
    image.updatedAt = dayjs().unix();

    await image.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update image error:', error);
    return NextResponse.json(
      { success: false, message: '更新圖片失敗' },
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

    const image = await Image.findById(id);
    if (!image) {
      return NextResponse.json(
        { success: false, message: '找不到圖片' },
        { status: 404 },
      );
    }

    await deleteImage(image.publicId);
    await Image.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { success: false, message: '刪除圖片失敗' },
      { status: 500 },
    );
  }
}
