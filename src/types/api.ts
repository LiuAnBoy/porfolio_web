/**
 * Generic mutation response (POST/PATCH/DELETE)
 */
export interface ApiMutationResponse {
  success: boolean;
  message?: string;
}

/**
 * Paginated list response
 */
export interface ApiListResponse<T> {
  payload: T[];
  total_count: number;
  page_size: number;
  page: number;
}

/**
 * Image upload response value
 */
export interface ImageUploadValue {
  imageId: string;
  url: string;
}

/**
 * Upload API success response
 */
export interface ImageUploadResponse {
  success: boolean;
  payload: ImageUploadValue;
}
