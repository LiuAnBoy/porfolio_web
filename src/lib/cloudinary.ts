import { v2 as cloudinary } from "cloudinary";

/**
 * Configure Cloudinary with environment variables
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
 * Upload image to Cloudinary
 */
export async function uploadImage(
  file: Buffer | string,
  folder: string = "portfolio",
): Promise<CloudinaryUploadResult> {
  const result = await cloudinary.uploader.upload(
    typeof file === "string"
      ? file
      : `data:image/png;base64,${file.toString("base64")}`,
    {
      folder,
      resource_type: "image",
    },
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
  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result !== "ok") {
    throw new Error(`Failed to delete image from Cloudinary: ${result.result}`);
  }
}

/**
 * Delete multiple images from Cloudinary
 */
export async function deleteImages(publicIds: string[]): Promise<void> {
  await cloudinary.api.delete_resources(publicIds);
}

/**
 * Get image info from Cloudinary
 */
export async function getImageInfo(publicId: string) {
  return await cloudinary.api.resource(publicId);
}

export default cloudinary;
