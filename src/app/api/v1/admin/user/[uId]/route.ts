import { NextRequest, NextResponse } from "next/server";

import { isAuthError, requireAdminAuth } from "@/lib/admin-auth";
import { deleteImage } from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import { withTransaction } from "@/lib/transaction";
import { Image, User } from "@/models";
import { IMAGE_USAGE_MODEL, IMAGE_USAGE_TYPE, SOCIAL_PLATFORM } from "@/types";

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

    const user = await User.findById(uId).populate("avatar", "_id url").lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const { _id, avatar, ...rest } = user;

    return NextResponse.json({
      success: true,
      data: {
        id: _id.toString(),
        avatar: transformImage(avatar as { _id: unknown; url: string } | null),
        ...rest,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get user" },
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
    const { uId } = await params;

    if (authResult.user.id !== uId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const user = await User.findById(uId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const { name, title, bio, socials, avatar } = body;

    if (socials && Array.isArray(socials)) {
      for (const social of socials) {
        if (!Object.values(SOCIAL_PLATFORM).includes(social.platform)) {
          return NextResponse.json(
            { success: false, message: `Invalid platform: ${social.platform}` },
            { status: 400 },
          );
        }
      }
    }

    const oldAvatarId = user.avatar?.toString();
    const newAvatarId = avatar;
    const isAvatarChanging =
      avatar !== undefined && oldAvatarId !== newAvatarId;

    if (isAvatarChanging && oldAvatarId) {
      const oldImage = await Image.findById(oldAvatarId);
      if (oldImage) {
        await deleteImage(oldImage.publicId);
      }
    }

    await withTransaction(async (session) => {
      if (isAvatarChanging && oldAvatarId) {
        await Image.findByIdAndDelete(oldAvatarId, { session });
      }

      if (isAvatarChanging && newAvatarId) {
        await Image.findByIdAndUpdate(
          newAvatarId,
          {
            isPending: false,
            usage: {
              type: IMAGE_USAGE_TYPE.AVATAR,
              refId: user._id,
              model: IMAGE_USAGE_MODEL.USER,
            },
          },
          { session },
        );
      }

      if (avatar !== undefined) {
        user.avatar = avatar;
      }
      if (name !== undefined) {
        user.name = name;
      }
      if (title !== undefined) {
        user.title = title;
      }
      if (bio !== undefined) {
        user.bio = bio;
      }
      if (socials !== undefined) {
        user.socials = socials;
      }

      await user.save({ session });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 },
    );
  }
}
