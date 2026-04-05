"use client";

import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";

/** Column definition for BaseTable */
export interface ColumnDef<T> {
  /** Unique key for the column */
  key: string;
  /** Display label for the column header */
  label: string;
  /** Column width (number in px or CSS string) */
  width?: number | string;
  /** Text alignment within the column */
  align?: "left" | "center" | "right";
  /**
   * Render function for cell content
   * @param row - The data row
   * @returns React node to render in the cell
   */
  render: (row: T) => ReactNode;
}

/** Props for BaseTable component */
interface BaseTableProps<T> {
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Data rows */
  data: T[];
  /** Total number of items for pagination */
  total: number;
  /** Current page (0-indexed) */
  page: number;
  /** Number of rows per page */
  rowsPerPage: number;
  /**
   * Callback when page changes
   * @param page - New page number
   */
  onPageChange: (page: number) => void;
  /**
   * Callback when rows per page changes
   * @param rowsPerPage - New rows per page value
   */
  onRowsPerPageChange: (rowsPerPage: number) => void;
  /** Whether to show skeleton loading state */
  loading?: boolean;
  /** Message to display when data is empty */
  emptyMessage?: string;
  /**
   * Optional function to derive a stable key for each row.
   * When omitted, falls back to `row-{page}-{index}`.
   *
   * @param row - The data row
   * @param index - Row index within the current page
   * @returns A stable string or number key
   */
  getRowKey?: (row: T, index: number) => string | number;
}

/**
 * Generic data table with pagination, loading skeleton, and empty state.
 *
 * @template T - The type of data rows
 * @param props - BaseTableProps
 */
export function BaseTable<T>({
  columns,
  data,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
  emptyMessage = "No data available",
  getRowKey,
}: BaseTableProps<T>) {
  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align ?? "left"}
                  style={{ width: col.width }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              (["skeleton-0", "skeleton-1", "skeleton-2"] as const).map(
                (skeletonKey) => (
                  <TableRow key={skeletonKey}>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ),
              )
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 4 }}
                  >
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <TableRow
                  key={
                    getRowKey
                      ? getRowKey(row, rowIndex)
                      : `row-${page}-${rowIndex}`
                  }
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align ?? "left"}>
                      {col.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) =>
          onRowsPerPageChange(parseInt(e.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
}
