export type SocialPlatform =
  | "GITHUB"
  | "LINKEDIN"
  | "LINE"
  | "TELEGRAM"
  | "WECHAT";

export interface Social {
  platform: SocialPlatform;
  url: string;
}

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

export interface Experience {
  id: string;
  userId: string;
  company: string;
  companyIcon: string | null;
  sn: number;
  positions: Position[];
}

export interface User {
  id: string;
  email: string;
  avatar: string | null;
  name: string;
  title: string;
  bio: string;
  socials: Social[];
  experiences: Experience[];
}

export interface GetUserProfileResponse {
  success: boolean;
  data: User;
  message?: string;
}
