/**
 * Image usage type enum
 */
export const IMAGE_USAGE_TYPE = {
  AVATAR: "AVATAR",
  EXPERIENCE: "EXPERIENCE",
  PROJECT_COVER: "PROJECT_COVER",
  PROJECT_GALLERY: "PROJECT_GALLERY",
  ARTICLE_COVER: "ARTICLE_COVER",
  ARTICLE_CONTENT: "ARTICLE_CONTENT",
} as const;

export type ImageUsageType =
  (typeof IMAGE_USAGE_TYPE)[keyof typeof IMAGE_USAGE_TYPE];

/**
 * Image usage model enum
 */
export const IMAGE_USAGE_MODEL = {
  USER: "USER",
  EXPERIENCE: "EXPERIENCE",
  PROJECT: "PROJECT",
  ARTICLE: "ARTICLE",
} as const;

export type ImageUsageModel =
  (typeof IMAGE_USAGE_MODEL)[keyof typeof IMAGE_USAGE_MODEL];

/**
 * Image usage data
 */
export interface ImageUsageData {
  type: ImageUsageType;
  refId: string;
  model: ImageUsageModel;
}

/**
 * Image reference (populated, minimal)
 */
export interface ImageRefData {
  id: string;
  url: string;
}

/**
 * Image data (API response)
 */
export interface ImageData {
  id: string;
  publicId: string;
  url: string;
  hash: string;
  isPending: boolean;
  createdAt: number;
  uploadedAt: number;
  updatedAt: number | null;
  usage: ImageUsageData | null;
}

/**
 * Image list query params
 */
export interface ImageListParams {
  page?: number;
  page_size?: number;
  isPending?: boolean | null;
  model?: ImageUsageModel | null;
}
