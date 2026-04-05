/**
 * Stack data (API response)
 */
export interface StackData {
  id: string;
  label: string;
  slug: string;
  createdAt: number;
  updatedAt: number | null;
}

/**
 * Stack payload for create/update
 */
export interface StackPayload {
  label: string;
}
