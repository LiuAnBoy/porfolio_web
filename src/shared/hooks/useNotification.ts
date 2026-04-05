'use client';

import { useSnackbar } from 'notistack';
import { useMemo } from 'react';

/** Methods for displaying notifications at different severity levels */
interface NotifyMethods {
  /** Display a success notification */
  success: (message: string) => void;
  /** Display an error notification */
  error: (message: string) => void;
  /** Display a warning notification */
  warning: (message: string) => void;
  /** Display an info notification */
  info: (message: string) => void;
}

/**
 * Hook that wraps notistack's useSnackbar to provide a simple notification API.
 *
 * @returns Object containing `notify` with success/error/warning/info methods
 *
 * @example
 * const { notify } = useNotification();
 * notify.success('建立成功');
 * notify.error('刪除失敗');
 */
export function useNotification(): { notify: NotifyMethods } {
  const { enqueueSnackbar } = useSnackbar();

  const notify = useMemo<NotifyMethods>(
    () => ({
      success: (message: string) =>
        enqueueSnackbar(message, { variant: 'success' }),
      error: (message: string) =>
        enqueueSnackbar(message, { variant: 'error' }),
      warning: (message: string) =>
        enqueueSnackbar(message, { variant: 'warning' }),
      info: (message: string) => enqueueSnackbar(message, { variant: 'info' }),
    }),
    [enqueueSnackbar],
  );

  return { notify };
}
