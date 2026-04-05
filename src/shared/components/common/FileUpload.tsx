"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { ChangeEvent, DragEvent, useRef, useState } from "react";

import { ImageValue, useDeleteImage, useUpload } from "@/shared/hooks";

/** Maximum allowed file size in bytes (5 MB) */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/** Props for FileUpload component */
interface FileUploadProps {
  /** Current value — single image, array of images, or null */
  value: ImageValue | ImageValue[] | null;
  /**
   * Callback when the value changes
   * @param value - Updated image value(s)
   */
  onChange: (value: ImageValue | ImageValue[] | null) => void;
  /** Allow selecting multiple files */
  multiple?: boolean;
  /** Admin module scope for uploads */
  module: "projects" | "user" | "experiences";
  /** Maximum number of files allowed when multiple is true */
  maxFiles?: number;
}

/**
 * Drag-and-drop file upload component with image previews and remove support.
 * Validates file type (image/*) and size (max 5 MB).
 *
 * @param props - FileUploadProps
 */
export function FileUpload({
  value,
  onChange,
  multiple = false,
  module,
  maxFiles = 10,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { upload, isUploading } = useUpload({ module });
  const { deleteImage, isDeleting } = useDeleteImage();

  /** Normalizes value to an array for uniform processing */
  const images: ImageValue[] = value
    ? Array.isArray(value)
      ? value
      : [value]
    : [];

  /**
   * Validates and uploads a list of files.
   * @param files - FileList or array of File objects to process
   */
  const handleFiles = async (files: FileList | File[]) => {
    setValidationError(null);
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        setValidationError("Only image files are allowed.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setValidationError("File size must be under 5 MB.");
        return;
      }
    }

    try {
      if (multiple) {
        const remaining = maxFiles - images.length;
        if (fileArray.length > remaining) {
          setValidationError(`Maximum ${maxFiles} files allowed.`);
          return;
        }
        const uploaded: ImageValue[] = [];
        for (const file of fileArray.slice(0, remaining)) {
          const img = await upload(file);
          uploaded.push(img);
        }
        onChange([...images, ...uploaded]);
      } else {
        const img = await upload(fileArray[0]);
        onChange(img);
      }
    } catch {
      setValidationError("Upload failed. Please try again.");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      void handleFiles(e.target.files);
      // Reset input so re-selecting the same file triggers onChange
      e.target.value = "";
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      void handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /**
   * Removes an image by its index, deleting it from the server.
   * @param index - Index of the image to remove
   */
  const handleRemove = async (index: number) => {
    const img = images[index];
    try {
      await deleteImage(img.imageId);
      if (multiple) {
        const updated = images.filter((_, i) => i !== index);
        onChange(updated.length > 0 ? updated : null);
      } else {
        onChange(null);
      }
    } catch {
      setValidationError("Failed to remove image. Please try again.");
    }
  };

  const canUpload = multiple ? images.length < maxFiles : images.length === 0;

  return (
    <Box>
      {canUpload && (
        <Box
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          sx={{
            border: "2px dashed",
            borderColor: isDragging ? "primary.main" : "divider",
            borderRadius: 1,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color 0.2s",
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          {isUploading ? (
            <CircularProgress size={32} />
          ) : (
            <>
              <UploadFileIcon sx={{ fontSize: 40, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Drag & drop or click to select
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Image files only · Max 5 MB
                {multiple ? ` · Up to ${maxFiles} files` : ""}
              </Typography>
            </>
          )}
        </Box>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        style={{ display: "none" }}
        onChange={handleInputChange}
      />

      {validationError && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 0.5, display: "block" }}
        >
          {validationError}
        </Typography>
      )}

      {images.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {images.map((img, index) => (
            <Box
              key={img.imageId}
              sx={{ position: "relative", width: 96, height: 96 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={`Upload ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
              <IconButton
                size="small"
                onClick={() => void handleRemove(index)}
                disabled={isDeleting}
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                  p: 0.25,
                }}
              >
                <DeleteIcon sx={{ fontSize: 16, color: "#fff" }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
