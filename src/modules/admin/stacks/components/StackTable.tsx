"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

import {
  BaseTable,
  ColumnDef,
  ConfirmDialog,
  PageHeader,
} from "@/shared/components/common";
import { useNotification } from "@/shared/hooks";
import type { StackData } from "@/types";

import { useDeleteStack, useStackList } from "../hooks/useStackQueries";
import { StackModal } from "./StackModal";

/**
 * Stack management table with CRUD operations.
 * Includes pagination, edit and delete actions.
 */
export function StackTable() {
  const { notify } = useNotification();
  const { data = [], isLoading } = useStackList();

  const deleteMutation = useDeleteStack();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<StackData | undefined>(undefined);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLabel, setDeleteLabel] = useState("");

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const columns: ColumnDef<StackData>[] = [
    {
      key: "label",
      label: "Label",
      render: (row) => row.label,
    },
    {
      key: "slug",
      label: "Slug",
      render: (row) => row.slug,
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => dayjs(row.createdAt * 1000).format("YYYY-MM-DD"),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (row) => (
        <>
          <IconButton
            size="small"
            onClick={() => {
              setEditData(row);
              setModalOpen(true);
            }}
            aria-label="edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setDeleteId(row.id);
              setDeleteLabel(row.label);
            }}
            aria-label="delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      notify.success("技術棧刪除成功");
    } catch {
      notify.error("技術棧刪除失敗");
    } finally {
      setDeleteId(null);
      setDeleteLabel("");
    }
  };

  return (
    <>
      <PageHeader
        title="技術棧管理"
        action={
          <Button
            variant="contained"
            onClick={() => {
              setEditData(undefined);
              setModalOpen(true);
            }}
          >
            新增
          </Button>
        }
      />

      <BaseTable<StackData>
        columns={columns}
        data={paginatedData}
        total={data.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(rpp) => {
          setRowsPerPage(rpp);
          setPage(0);
        }}
        loading={isLoading}
        emptyMessage="尚無技術棧資料"
        getRowKey={(row) => row.id}
      />

      <StackModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(undefined);
        }}
        editData={editData}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => {
          setDeleteId(null);
          setDeleteLabel("");
        }}
        onConfirm={handleDeleteConfirm}
        message={`確定要刪除技術棧「${deleteLabel}」嗎？此操作無法復原。`}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
