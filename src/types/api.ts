/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Paginated API response
 */
export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
  total: number;
  message?: string;
}

/**
 * Image upload response value
 */
export interface ImageUploadValue {
  imageId: string;
  url: string;
}
