'use client';

import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { ReactNode } from 'react';

/** Props for BaseModal component */
interface BaseModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when the modal is closed */
  onClose: () => void;
  /** Title displayed in the dialog header */
  title: string;
  /** Content to render inside the dialog */
  children: ReactNode;
  /** Optional confirm action callback */
  onConfirm?: () => void;
  /** Label for the confirm button (default: '確認') */
  confirmText?: string;
  /** Label for the cancel button (default: '取消') */
  cancelText?: string;
  /** Whether the confirm action is in progress */
  loading?: boolean;
  /** Maximum width of the dialog */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * Reusable modal dialog with title, scrollable content, and action buttons.
 *
 * @param props - BaseModalProps
 */
export function BaseModal({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = '確認',
  cancelText = '取消',
  loading = false,
  maxWidth = 'sm',
}: BaseModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        {onConfirm && (
          <Button
            variant="contained"
            onClick={onConfirm}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
