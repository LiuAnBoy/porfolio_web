/**
 * Social media platform enum.
 */
export type SocialPlatform =
  | "GITHUB"
  | "LINKEDIN"
  | "LINE"
  | "TELEGRAM"
  | "WECHAT";

/**
 * Social media link.
 */
export interface Social {
  platform: SocialPlatform;
  url: string;
}

/**
 * Position within a company.
 */
export interface Position {
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
 * Work experience at a company.
 */
export interface Experience {
  id: string;
  userId: string;
  company: string;
  companyIcon: string | null;
  sn: number;
  positions: Position[];
}

/**
 * User profile.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  title: string;
  bio: string;
  avatar: string | null;
  socials: Social[];
  experiences: Experience[];
}

/**
 * User profile API response.
 */
export interface UserResponse {
  success: boolean;
  data: User;
}
