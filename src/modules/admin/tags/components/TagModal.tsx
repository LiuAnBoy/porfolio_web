"use client";

import { TextField } from "@mui/material";
import { pinyin } from "pinyin-pro";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { BaseModal } from "@/shared/components/common";
import { useNotification } from "@/shared/hooks";
import type { TagData } from "@/types";

import { useCreateTag, useUpdateTag } from "../hooks/useTagQueries";

/** Props for TagModal component */
interface TagModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Tag data for edit mode; undefined means create mode */
  editData?: TagData;
}

/** Form values for the tag form */
interface TagFormValues {
  label: string;
}

/**
 * Generate a URL-friendly slug from a label using pinyin-pro.
 *
 * @param label - The tag label (may contain Chinese characters)
 * @returns URL-friendly slug string
 */
function generateSlug(label: string): string {
  return pinyin(label, { toneType: "none", separator: "-" })
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/**
 * Modal for creating or editing a tag.
 * Auto-generates slug from label using pinyin-pro.
 *
 * @param props - TagModalProps
 */
export function TagModal({ open, onClose, editData }: TagModalProps) {
  const { notify } = useNotification();
  const isEdit = Boolean(editData);

  const { register, handleSubmit, watch, reset } = useForm<TagFormValues>({
    defaultValues: { label: editData?.label ?? "" },
  });

  const labelValue = watch("label");
  const slugPreview = generateSlug(labelValue);

  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Reset form when modal opens/closes or editData changes
  useEffect(() => {
    if (open) {
      reset({ label: editData?.label ?? "" });
    }
  }, [open, editData, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (isEdit && editData) {
        await updateMutation.mutateAsync({
          id: editData.id,
          payload: { label: values.label },
        });
        notify.success("標籤更新成功");
      } else {
        await createMutation.mutateAsync({ label: values.label });
        notify.success("標籤建立成功");
      }
      handleClose();
    } catch {
      notify.error(isEdit ? "標籤更新失敗" : "標籤建立失敗");
    }
  });

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title={isEdit ? "編輯標籤" : "新增標籤"}
      onConfirm={onSubmit}
      confirmText={isEdit ? "更新" : "建立"}
      loading={isPending}
      maxWidth="sm"
    >
      <TextField
        {...register("label", { required: true })}
        label="Label"
        fullWidth
        autoFocus
        helperText={labelValue ? `Slug preview: ${slugPreview}` : " "}
        sx={{ mt: 1 }}
      />
    </BaseModal>
  );
}
