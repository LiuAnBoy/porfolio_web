'use client';

import { Chip } from '@mui/material';

/** Props for StatusChip component */
interface StatusChipProps {
  /** Text label to display */
  label: string;
  /** Color variant of the chip */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  /** Size of the chip */
  size?: 'small' | 'medium';
}

/**
 * A styled MUI Chip wrapper for displaying status labels.
 *
 * @param props - StatusChipProps
 */
export function StatusChip({
  label,
  color = 'default',
  size = 'small',
}: StatusChipProps) {
  return <Chip label={label} color={color} size={size} />;
}
