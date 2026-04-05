import { handleOptions, jsonWithCors } from "@/lib/cors";
import { connectDB } from "@/lib/mongodb";
import { Experience, Position, User } from "@/models";

export const OPTIONS = handleOptions;

/**
 * GET /api/v1/user/me
 * Public user profile with experiences and positions.
 */
export async function GET() {
  try {
    await connectDB();

    const user = await User.findOne()
      .select("-password")
      .populate("avatar", "url")
      .lean();

    if (!user) {
      return jsonWithCors(
        { success: false, message: "找不到使用者" },
        { status: 404 },
      );
    }

    const experiences = await Experience.find({ userId: user._id })
      .populate("companyIcon", "url")
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

        const {
          _id,
          experienceId: posExperienceId,
          title,
          startAt,
          endAt,
          isCurrent,
          description,
          sn,
        } = position;
        acc[experienceId].push({
          id: _id.toString(),
          experienceId: posExperienceId.toString(),
          title,
          startAt,
          endAt,
          isCurrent,
          description,
          sn,
        });

        return acc;
      },
      {},
    );

    const experiencesData = experiences.map((experience) => {
      const { _id, userId, company, companyIcon, sn } = experience;

      return {
        id: _id.toString(),
        userId: userId.toString(),
        companyIcon:
          (companyIcon as unknown as { url: string } | null)?.url || null,
        company,
        sn,
        positions: positionsByExperience[_id.toString()] || [],
      };
    });

    const { _id, email, avatar, name, title, bio, socials } = user;

    return jsonWithCors({
      id: _id.toString(),
      avatar: (avatar as unknown as { url: string } | null)?.url || null,
      email,
      name,
      title,
      bio,
      socials,
      experiences: experiencesData,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return jsonWithCors(
      { success: false, message: "取得使用者資料失敗" },
      { status: 500 },
    );
  }
}
