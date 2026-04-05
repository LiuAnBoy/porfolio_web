'use client';

import { useCallback, useState } from 'react';

import http from '@/services/client';

/**
 * Hook for deleting images via the admin images endpoint.
 * Sends a DELETE request to `DELETE /api/v1/admin/images/{id}`.
 *
 * @returns Object containing `deleteImage` function and `isDeleting` state
 *
 * @example
 * const { deleteImage, isDeleting } = useDeleteImage();
 * await deleteImage('abc123');
 */
export function useDeleteImage(): {
  deleteImage: (imageId: string) => Promise<void>;
  isDeleting: boolean;
} {
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Deletes an image by its identifier.
   *
   * @param imageId - The identifier of the image to delete
   * @returns Promise that resolves when the image is deleted
   * @throws Error if the deletion fails
   */
  const deleteImage = useCallback(async (imageId: string): Promise<void> => {
    setIsDeleting(true);
    try {
      await http.del(`/v1/admin/images/${imageId}`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return { deleteImage, isDeleting };
}
