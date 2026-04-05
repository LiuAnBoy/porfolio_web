import { v2 as cloudinary } from "cloudinary";

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Validate and configure Cloudinary. Throws at runtime if env vars are missing.
 * Called lazily so build-time page collection does not fail.
 */
function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary environment variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are required",
    );
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  return cloudinary;
}

/**
 * Upload image to Cloudinary
 * @param file - URL string or raw Buffer
 * @param folder - Cloudinary folder path
 * @param mimeType - MIME type for Buffer uploads (e.g. "image/jpeg", "image/png")
 */
export async function uploadImage(
  file: Buffer | string,
  folder: string = "portfolio",
  mimeType: string = "image/png",
): Promise<CloudinaryUploadResult> {
  const cld = getCloudinary();
  const result = await cld.uploader.upload(
    typeof file === "string"
      ? file
      : `data:${mimeType};base64,${file.toString("base64")}`,
    { folder, resource_type: "image" },
  );

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  const cld = getCloudinary();
  const result = await cld.uploader.destroy(publicId);
  if (result.result !== "ok") {
    throw new Error(`Failed to delete image from Cloudinary: ${result.result}`);
  }
}

/**
 * Delete multiple images from Cloudinary
 */
export async function deleteImages(publicIds: string[]): Promise<void> {
  const cld = getCloudinary();
  await cld.api.delete_resources(publicIds);
}

/**
 * Get image info from Cloudinary
 */
export async function getImageInfo(publicId: string) {
  const cld = getCloudinary();
  return await cld.api.resource(publicId);
}

export default cloudinary;
