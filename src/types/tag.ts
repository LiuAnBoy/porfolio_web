/**
 * Tag data (API response)
 */
export interface TagData {
  id: string;
  label: string;
  slug: string;
  createdAt: number;
  updatedAt: number | null;
}

/**
 * Tag payload for create/update
 */
export interface TagPayload {
  label: string;
}
