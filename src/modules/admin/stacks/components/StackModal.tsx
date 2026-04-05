"use client";

import { TextField } from "@mui/material";
import { pinyin } from "pinyin-pro";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { BaseModal } from "@/shared/components/common";
import { useNotification } from "@/shared/hooks";
import type { StackData } from "@/types";

import { useCreateStack, useUpdateStack } from "../hooks/useStackQueries";

/** Props for StackModal component */
interface StackModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Stack data for edit mode; undefined means create mode */
  editData?: StackData;
}

/** Form values for the stack form */
interface StackFormValues {
  label: string;
}

/**
 * Generate a URL-friendly slug from a label using pinyin-pro.
 *
 * @param label - The stack label (may contain Chinese characters)
 * @returns URL-friendly slug string
 */
function generateSlug(label: string): string {
  return pinyin(label, { toneType: "none", separator: "-" })
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/**
 * Modal for creating or editing a stack.
 * Auto-generates slug from label using pinyin-pro.
 *
 * @param props - StackModalProps
 */
export function StackModal({ open, onClose, editData }: StackModalProps) {
  const { notify } = useNotification();
  const isEdit = Boolean(editData);

  const { register, handleSubmit, control, reset } = useForm<StackFormValues>({
    defaultValues: { label: editData?.label ?? "" },
  });

  const labelValue = useWatch({ control, name: "label" });
  const slugPreview = generateSlug(labelValue);

  const createMutation = useCreateStack();
  const updateMutation = useUpdateStack();

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
        notify.success("技術棧更新成功");
      } else {
        await createMutation.mutateAsync({ label: values.label });
        notify.success("技術棧建立成功");
      }
      handleClose();
    } catch (error) {
      const apiMessage = (
        error as { response?: { data?: { message?: string } } }
      ).response?.data?.message;
      notify.error(
        apiMessage ?? (isEdit ? "技術棧更新失敗" : "技術棧建立失敗"),
      );
    }
  });

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title={isEdit ? "編輯技術棧" : "新增技術棧"}
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
