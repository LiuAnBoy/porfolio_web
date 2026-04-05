/**
 * Social platform enum
 */
export const SOCIAL_PLATFORM = {
  GITHUB: 'GITHUB',
  LINKEDIN: 'LINKEDIN',
  LINE: 'LINE',
  TELEGRAM: 'TELEGRAM',
  WECHAT: 'WECHAT',
} as const;

export type SocialPlatform =
  (typeof SOCIAL_PLATFORM)[keyof typeof SOCIAL_PLATFORM];

/**
 * Social link
 */
export interface ISocial {
  platform: SocialPlatform;
  url: string;
}

/**
 * Position data (API response)
 */
export interface PositionData {
  id: string;
  experienceId: string;
  title: string;
  startAt: number;
  endAt: number | null;
  isCurrent: boolean;
  description: string;
  sn: number;
}

/**
 * Position payload for create/update
 */
export interface PositionPayload {
  id?: string;
  title: string;
  startAt: number;
  endAt?: number | null;
  isCurrent?: boolean;
  description?: string;
  sn?: number;
}

/**
 * Experience with positions (API response)
 */
export interface ExperienceWithPositions {
  id: string;
  userId: string;
  company: string;
  companyIcon: import('./image').ImageRefData | null;
  sn: number;
  createdAt: number;
  updatedAt: number | null;
  positions: PositionData[];
}

/**
 * Experience data for public API (userId and timestamps excluded)
 */
export type PublicExperienceData = Omit<
  ExperienceWithPositions,
  'userId' | 'createdAt' | 'updatedAt'
>;

/**
 * Experience payload for create/update
 */
export interface ExperiencePayload {
  company: string;
  companyIcon?: string | null;
  sn?: number;
  positions: PositionPayload[];
}

/**
 * User data (API response)
 */
export interface UserData {
  id: string;
  email: string;
  avatar: import('./image').ImageRefData | null;
  name: string;
  title: string;
  bio: string;
  socials: ISocial[];
  createdAt: number;
  updatedAt: number | null;
}

/**
 * User data for public API (email and timestamps excluded)
 */
export type PublicUserData = Omit<
  UserData,
  'email' | 'createdAt' | 'updatedAt'
>;

/**
 * User with experiences (API response)
 */
export interface UserWithExperiences extends UserData {
  experiences: ExperienceWithPositions[];
}

/**
 * User payload for create/update
 */
export interface UserPayload {
  name: string;
  title?: string;
  bio?: string;
  socials?: ISocial[];
  avatar?: string | null;
}
