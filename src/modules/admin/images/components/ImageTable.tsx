"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

import {
  BaseModal,
  BaseTable,
  ColumnDef,
  ConfirmDialog,
  FileUpload,
  PageHeader,
  StatusChip,
} from "@/shared/components/common";
import { ImageValue, useNotification } from "@/shared/hooks";
import type { ImageData, ImageListParams, ImageUsageModel } from "@/types";
import { IMAGE_USAGE_MODEL } from "@/types";

import { useDeleteImage, useImageList } from "../hooks/useImageQueries";

/** Filter value for isPending select */
type PendingFilter = "all" | "pending" | "used";

/** Filter value for model select */
type ModelFilter = "all" | ImageUsageModel;

/**
 * Image management table with filters, upload dialog, and delete.
 */
export function ImageTable() {
  const { notify } = useNotification();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [pendingFilter, setPendingFilter] = useState<PendingFilter>("all");
  const [modelFilter, setModelFilter] = useState<ModelFilter>("all");

  /** Build query params from local filter state */
  const params: ImageListParams = {
    page: page + 1,
    page_size: rowsPerPage,
    ...(pendingFilter !== "all" && {
      isPending: pendingFilter === "pending",
    }),
    ...(modelFilter !== "all" && { model: modelFilter }),
  };

  const { data: result, isLoading, isError } = useImageList(params);
  const images = result?.payload ?? [];
  const total = result?.total_count ?? 0;

  const deleteMutation = useDeleteImage();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadValue, setUploadValue] = useState<
    ImageValue | ImageValue[] | null
  >(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  /** Truncate a URL for display */
  const truncateUrl = (url: string, max = 40): string =>
    url.length > max ? `${url.slice(0, max)}...` : url;

  const columns: ColumnDef<ImageData>[] = [
    {
      key: "preview",
      label: "Preview",
      width: 80,
      render: (row) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={row.url}
          alt={row.publicId}
          style={{
            width: 56,
            height: 56,
            objectFit: "cover",
            borderRadius: 4,
          }}
        />
      ),
    },
    {
      key: "url",
      label: "URL",
      render: (row) => (
        <Tooltip title={row.url}>
          <Typography variant="body2" noWrap sx={{ maxWidth: 280 }}>
            {truncateUrl(row.url)}
          </Typography>
        </Tooltip>
      ),
    },
    {
      key: "isPending",
      label: "Status",
      width: 100,
      render: (row) => (
        <StatusChip
          label={row.isPending ? "Pending" : "Used"}
          color={row.isPending ? "warning" : "success"}
        />
      ),
    },
    {
      key: "model",
      label: "Model",
      width: 120,
      render: (row) =>
        row.usage ? (
          <StatusChip label={row.usage.model} color="info" />
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        ),
    },
    {
      key: "createdAt",
      label: "Created At",
      width: 120,
      render: (row) => dayjs(row.createdAt * 1000).format("YYYY-MM-DD"),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      width: 80,
      render: (row) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => setDeleteId(row.id)}
          aria-label="delete"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  if (isError) {
    return <Typography color="error">載入失敗，請重新整理頁面。</Typography>;
  }

  /** Handle delete confirm */
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      notify.success("圖片刪除成功");
    } catch (error) {
      const apiMessage = (
        error as { response?: { data?: { message?: string } } }
      ).response?.data?.message;
      notify.error(apiMessage ?? "圖片刪除失敗");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="圖片管理"
        action={
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setUploadOpen(true)}
          >
            上傳
          </Button>
        }
      />

      {/* Filter row */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={pendingFilter}
            label="Status"
            onChange={(e) => {
              setPendingFilter(e.target.value as PendingFilter);
              setPage(0);
            }}
          >
            <MenuItem value="all">全部</MenuItem>
            <MenuItem value="pending">待使用</MenuItem>
            <MenuItem value="used">已使用</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Model</InputLabel>
          <Select
            value={modelFilter}
            label="Model"
            onChange={(e) => {
              setModelFilter(e.target.value as ModelFilter);
              setPage(0);
            }}
          >
            <MenuItem value="all">全部</MenuItem>
            {Object.values(IMAGE_USAGE_MODEL).map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <BaseTable<ImageData>
        columns={columns}
        data={images}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(rpp) => {
          setRowsPerPage(rpp);
          setPage(0);
        }}
        loading={isLoading}
        emptyMessage="尚無圖片資料"
        getRowKey={(row) => row.id}
      />

      {/* Upload dialog */}
      <BaseModal
        open={uploadOpen}
        onClose={() => {
          setUploadOpen(false);
          setUploadValue(null);
        }}
        title="上傳圖片"
        maxWidth="sm"
      >
        <FileUpload
          value={uploadValue}
          onChange={setUploadValue}
          multiple
          module="projects"
          maxFiles={10}
        />
      </BaseModal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        message="確定要刪除此圖片嗎？此操作無法復原。"
        loading={deleteMutation.isPending}
      />
    </>
  );
}
