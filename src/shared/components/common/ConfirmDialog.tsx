'use client';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Typography } from '@mui/material';

import { BaseModal } from './BaseModal';

/** Props for ConfirmDialog component */
interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when the dialog is closed without confirming */
  onClose: () => void;
  /** Callback when the user confirms the action */
  onConfirm: () => void;
  /** Dialog title (default: '確認刪除') */
  title?: string;
  /** Message to display in the dialog body */
  message: string;
  /** Whether the confirm action is in progress */
  loading?: boolean;
}

/**
 * Confirmation dialog with a warning icon and destructive confirm button.
 * Wraps BaseModal internally.
 *
 * @param props - ConfirmDialogProps
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = '確認刪除',
  message,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={title}
      onConfirm={onConfirm}
      confirmText="刪除"
      cancelText="取消"
      loading={loading}
      maxWidth="xs"
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <WarningAmberIcon color="warning" sx={{ mt: 0.25 }} />
        <Typography variant="body1">{message}</Typography>
      </Box>
    </BaseModal>
  );
}
