"use client";

import { useState } from "react";

import http from "@/services/client";

/** Represents an uploaded image with its identifier and public URL */
export interface ImageValue {
  imageId: string;
  url: string;
}

/** Configuration options for the useUpload hook */
interface UseUploadOptions {
  /** The admin module this upload belongs to */
  module: "projects" | "user" | "experiences";
  /**
   * Callback invoked with the uploaded image on success
   * @param image - The uploaded image data
   */
  onSuccess?: (image: ImageValue) => void;
  /**
   * Callback invoked with the error on failure
   * @param error - The error that occurred
   */
  onError?: (error: Error) => void;
}

/**
 * Hook for uploading images to the admin upload endpoint.
 * Sends a multipart/form-data POST request to `POST /api/v1/admin/upload`.
 *
 * @param options - Upload configuration including module and optional callbacks
 * @returns Object containing `upload` function and `isUploading` state
 *
 * @example
 * const { upload, isUploading } = useUpload({ module: 'projects' });
 * const image = await upload(file);
 */
export function useUpload(options: UseUploadOptions): {
  upload: (file: File) => Promise<ImageValue>;
  isUploading: boolean;
} {
  const { module, onSuccess, onError } = options;
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Uploads a file to the server.
   *
   * @param file - The file to upload
   * @returns Promise resolving to the uploaded image data
   * @throws Error if the upload fails
   */
  const upload = async (file: File): Promise<ImageValue> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("module", module);

      const image = await http.post<ImageValue>("/v1/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess?.(image);
      return image;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      onError?.(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading };
}
