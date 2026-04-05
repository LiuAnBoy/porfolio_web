import { unstable_cache } from 'next/cache';

import { connectDB } from '@/lib/mongodb';
import {
  Experience,
  Position,
  Project as ProjectModel,
  User as UserModel,
} from '@/models';
import type { Project } from '@/services/projects/types';
import type { User } from '@/services/user/types';

/**
 * Cache revalidation time in seconds.
 * Data will be cached for 5 minutes.
 */
const CACHE_REVALIDATE_SECONDS = 60 * 5;

/**
 * Initial load target count.
 */
const INITIAL_LOAD_COUNT = 15;

/**
 * Page limit for infinite scroll.
 */
const PAGE_LIMIT = 12;

/**
 * Strip HTML tags from string.
 */
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

/**
 * Initial projects data structure.
 */
export interface InitialProjectsData {
  projects: Project[];
  featuredCount: number;
  nonFeaturedLoaded: number;
  nonFeaturedTotal: number;
}

const EMPTY_INITIAL_PROJECTS_DATA: InitialProjectsData = {
  projects: [],
  featuredCount: 0,
  nonFeaturedLoaded: 0,
  nonFeaturedTotal: 0,
};

/**
 * Cached function to get user profile.
 * Data is cached across requests and revalidates every 5 minutes.
 */
export const getUser = unstable_cache(
  async (): Promise<User | null> => {
    if (!process.env.MONGODB_URI) {
      return null;
    }

    await connectDB();

    const user = await UserModel.findOne()
      .select('-password')
      .populate('avatar', 'url')
      .lean();

    if (!user) {
      return null;
    }

    const experiences = await Experience.find({ userId: user._id })
      .populate('companyIcon', 'url')
      .sort({ sn: -1 })
      .lean();

    const experienceIds = experiences.map((experience) => experience._id);
    const positions = await Position.find({
      experienceId: { $in: experienceIds },
    })
      .sort({ sn: 1 })
      .lean();

    const positionsByExperience = positions.reduce<
      Record<string, User['experiences'][number]['positions']>
    >((acc, position) => {
      const experienceId = position.experienceId.toString();
      if (!acc[experienceId]) {
        acc[experienceId] = [];
      }

      acc[experienceId].push({
        id: position._id.toString(),
        experienceId,
        title: position.title,
        startAt: position.startAt,
        endAt: position.endAt,
        isCurrent: position.isCurrent,
        description: position.description,
        sn: position.sn,
      });

      return acc;
    }, {});

    return {
      id: user._id.toString(),
      email: user.email,
      avatar: (user.avatar as unknown as { url: string } | null)?.url || null,
      name: user.name,
      title: user.title,
      bio: user.bio,
      socials: user.socials,
      experiences: experiences.map((experience) => ({
        id: experience._id.toString(),
        userId: experience.userId.toString(),
        company: experience.company,
        companyIcon:
          (experience.companyIcon as unknown as { url: string } | null)?.url ||
          null,
        sn: experience.sn,
        positions: positionsByExperience[experience._id.toString()] || [],
      })),
    };
  },
  ['user-profile'],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);

/**
 * Cached function to get initial projects.
 * Fetches all featured projects first, then fills up to INITIAL_LOAD_COUNT with non-featured.
 */
export const getInitialProjects = unstable_cache(
  async (): Promise<InitialProjectsData> => {
    if (!process.env.MONGODB_URI) {
      return EMPTY_INITIAL_PROJECTS_DATA;
    }

    await connectDB();

    const featuredQuery: Record<string, unknown> = {
      isVisible: true,
      isFeatured: true,
    };

    // Step 1: Fetch all featured projects
    const featuredProjects = await ProjectModel.find(featuredQuery)
      .populate('tags', 'label slug')
      .populate('stacks', 'label slug')
      .populate('cover', 'url')
      .populate('gallery', 'url')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const featuredCount = featuredProjects.length;

    // Step 2: Calculate how many non-featured we need
    const nonFeaturedNeeded = Math.max(0, INITIAL_LOAD_COUNT - featuredCount);

    let nonFeaturedProjects: Project[] = [];
    let nonFeaturedTotal = 0;

    if (nonFeaturedNeeded > 0) {
      const nonFeaturedQuery = {
        isVisible: true,
        isFeatured: false,
      };

      const [projectRows, total] = await Promise.all([
        ProjectModel.find(nonFeaturedQuery)
          .populate('tags', 'label slug')
          .populate('stacks', 'label slug')
          .populate('cover', 'url')
          .populate('gallery', 'url')
          .sort({ createdAt: -1 })
          .limit(PAGE_LIMIT)
          .lean(),
        ProjectModel.countDocuments(nonFeaturedQuery),
      ]);

      nonFeaturedProjects = projectRows
        .map((project) => ({
          id: project._id.toString(),
          title: project.title,
          slug: project.slug,
          description: project.description,
          type: project.type,
          tags: (
            project.tags as unknown as Array<{
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
            project.stacks as unknown as Array<{
              _id: unknown;
              label: string;
              slug: string;
            }>
          ).map((stack) => ({
            id: String(stack._id),
            label: stack.label,
            slug: stack.slug,
          })),
          isFeatured: project.isFeatured,
          isVisible: project.isVisible,
          link: project.link,
          partner: project.partner,
          cover:
            (project.cover as unknown as { url: string } | null)?.url || null,
          gallery: (
            (project.gallery || []) as unknown as Array<{ url: string }>
          ).map((image) => image.url),
        }))
        .slice(0, nonFeaturedNeeded);
      nonFeaturedTotal = total;
    } else {
      nonFeaturedTotal = await ProjectModel.countDocuments({
        isVisible: true,
        isFeatured: false,
      });
    }

    // Step 3: Combine - featured first, then non-featured
    const projects = [
      ...featuredProjects.map((project) => ({
        id: project._id.toString(),
        title: project.title,
        slug: project.slug,
        description: project.description,
        type: project.type,
        tags: (
          project.tags as unknown as Array<{
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
          project.stacks as unknown as Array<{
            _id: unknown;
            label: string;
            slug: string;
          }>
        ).map((stack) => ({
          id: String(stack._id),
          label: stack.label,
          slug: stack.slug,
        })),
        isFeatured: project.isFeatured,
        isVisible: project.isVisible,
        link: project.link,
        partner: project.partner,
        cover:
          (project.cover as unknown as { url: string } | null)?.url || null,
        gallery: (
          (project.gallery || []) as unknown as Array<{ url: string }>
        ).map((image) => image.url),
      })),
      ...nonFeaturedProjects,
    ];

    return {
      projects,
      featuredCount,
      nonFeaturedLoaded: nonFeaturedProjects.length,
      nonFeaturedTotal,
    };
  },
  ['initial-projects'],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);
