import crypto from 'crypto';
import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';

import { isAuthError, requireAdminAuth } from '@/lib/admin-auth';
import { uploadImage } from '@/lib/cloudinary';
import { connectDB } from '@/lib/mongodb';
import { Image } from '@/models';

function generateHash(buffer: Buffer): string {
  return crypto.createHash('md5').update(buffer).digest('hex');
}

function getUploadFolder(moduleName?: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  const baseFolder = isDev ? 'portfolio-dev' : 'portfolio';

  return moduleName ? `${baseFolder}/${moduleName}` : baseFolder;
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (isAuthError(authResult)) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const moduleName = searchParams.get('module');

    if (!type || type !== 'image') {
      return NextResponse.json(
        { success: false, message: '請提供有效的上傳類型' },
        { status: 400 },
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
    const hash = generateHash(buffer);

    const folder = getUploadFolder(moduleName ?? undefined);
    const cloudinaryResult = await uploadImage(buffer, folder);

    await connectDB();
    const now = dayjs().unix();
    const image = await Image.create({
      publicId: cloudinaryResult.publicId,
      url: cloudinaryResult.secureUrl,
      hash,
      isPending: true,
      createdAt: now,
      uploadedAt: now,
    });

    return NextResponse.json({
      success: true,
      payload: {
        imageId: image._id.toString(),
        url: image.url,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: '上傳失敗' },
      { status: 500 },
    );
  }
}
