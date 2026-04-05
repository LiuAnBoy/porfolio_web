'use client';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import { BaseModal, FileUpload } from '@/shared/components/common';
import { ImageValue, useNotification } from '@/shared/hooks';
import type {
  ExperiencePayload,
  ExperienceWithPositions,
  PositionPayload,
} from '@/types';

import {
  useCreateExperience,
  useUpdateExperience,
} from '../hooks/useUserQueries';

/** Props for ExperienceModal component */
interface ExperienceModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** User ID for creating/updating experiences */
  userId: string;
  /** Experience data for edit mode; undefined means create mode */
  editData?: ExperienceWithPositions;
}

/** Position form values */
interface PositionFormValue {
  id?: string;
  title: string;
  startAt: string;
  endAt: string;
  isCurrent: boolean;
  description: string;
}

/** Experience form values */
interface ExperienceFormValues {
  company: string;
  companyIcon: ImageValue | null;
  positions: PositionFormValue[];
}

/** Default empty position */
const EMPTY_POSITION: PositionFormValue = {
  title: '',
  startAt: '',
  endAt: '',
  isCurrent: false,
  description: '',
};

/**
 * Convert a Unix timestamp (seconds) to a YYYY-MM-DD string.
 *
 * @param ts - Unix timestamp in seconds, or null
 * @returns Date string or empty string
 */
function tsToDateStr(ts: number | null): string {
  if (!ts) return '';
  return new Date(ts * 1000).toISOString().slice(0, 10);
}

/**
 * Convert a YYYY-MM-DD string to a Unix timestamp (seconds).
 *
 * @param dateStr - Date string
 * @returns Unix timestamp in seconds, or null if empty
 */
function dateStrToTs(dateStr: string): number | null {
  if (!dateStr) return null;
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

/**
 * Modal for creating or editing an experience with nested positions.
 *
 * @param props - ExperienceModalProps
 */
export function ExperienceModal({
  open,
  onClose,
  userId,
  editData,
}: ExperienceModalProps) {
  const { notify } = useNotification();
  const isEdit = Boolean(editData);

  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const { control, register, handleSubmit, reset } =
    useForm<ExperienceFormValues>({
      defaultValues: {
        company: '',
        companyIcon: null,
        positions: [{ ...EMPTY_POSITION }],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'positions',
  });

  /** Reset form when modal opens or editData changes */
  useEffect(() => {
    if (open) {
      if (editData) {
        reset({
          company: editData.company,
          companyIcon: editData.companyIcon
            ? {
                imageId: editData.companyIcon.id,
                url: editData.companyIcon.url,
              }
            : null,
          positions: editData.positions.map((p) => ({
            id: p.id,
            title: p.title,
            startAt: tsToDateStr(p.startAt),
            endAt: tsToDateStr(p.endAt),
            isCurrent: p.isCurrent,
            description: p.description,
          })),
        });
      } else {
        reset({
          company: '',
          companyIcon: null,
          positions: [{ ...EMPTY_POSITION }],
        });
      }
    }
  }, [open, editData, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = handleSubmit(async (values) => {
    const positions: PositionPayload[] = values.positions.map((p, idx) => ({
      ...(p.id ? { id: p.id } : {}),
      title: p.title,
      startAt: dateStrToTs(p.startAt) ?? 0,
      endAt: p.isCurrent ? null : dateStrToTs(p.endAt),
      isCurrent: p.isCurrent,
      description: p.description,
      sn: idx,
    }));

    const payload: ExperiencePayload = {
      company: values.company,
      companyIcon: values.companyIcon?.imageId ?? null,
      positions,
    };

    try {
      if (isEdit && editData) {
        await updateMutation.mutateAsync({
          userId,
          expId: editData.id,
          payload,
        });
        notify.success('經歷更新成功');
      } else {
        await createMutation.mutateAsync({ userId, payload });
        notify.success('經歷建立成功');
      }
      handleClose();
    } catch (error) {
      const apiMessage = (
        error as { response?: { data?: { message?: string } } }
      ).response?.data?.message;
      notify.error(apiMessage ?? (isEdit ? '經歷更新失敗' : '經歷建立失敗'));
    }
  });

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title={isEdit ? '編輯經歷' : '新增經歷'}
      onConfirm={onSubmit}
      confirmText={isEdit ? '更新' : '建立'}
      loading={isPending}
      maxWidth="md"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Company */}
        <TextField
          {...register('company', { required: true })}
          label="Company"
          fullWidth
          autoFocus
        />

        {/* Company Icon */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Company Icon
          </Typography>
          <Controller
            name="companyIcon"
            control={control}
            render={({ field }) => (
              <FileUpload
                value={field.value}
                onChange={(val) => {
                  if (Array.isArray(val)) {
                    field.onChange(val[0] ?? null);
                  } else {
                    field.onChange(val);
                  }
                }}
                module="experiences"
              />
            )}
          />
        </Box>

        <Divider />

        {/* Positions header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Positions
          </Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => append({ ...EMPTY_POSITION })}
          >
            Add Position
          </Button>
        </Box>

        {/* Position fields */}
        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1.5,
              }}
            >
              <Typography variant="subtitle2">Position {index + 1}</Typography>
              {fields.length > 1 && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => remove(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                {...register(`positions.${index}.title`, { required: true })}
                label="Title"
                fullWidth
                size="small"
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  {...register(`positions.${index}.startAt`, {
                    required: true,
                  })}
                  label="Start Date"
                  type="date"
                  fullWidth
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  {...register(`positions.${index}.endAt`)}
                  label="End Date"
                  type="date"
                  fullWidth
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>

              <Controller
                name={`positions.${index}.isCurrent`}
                control={control}
                render={({ field: switchField }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={switchField.value}
                        onChange={switchField.onChange}
                        size="small"
                      />
                    }
                    label="Currently working here"
                  />
                )}
              />

              <TextField
                {...register(`positions.${index}.description`)}
                label="Description"
                fullWidth
                size="small"
                multiline
                rows={2}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </BaseModal>
  );
}
