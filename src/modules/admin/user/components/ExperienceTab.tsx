"use client";

import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton } from "@mui/material";
import { useState } from "react";

import {
  BaseTable,
  ColumnDef,
  ConfirmDialog,
} from "@/shared/components/common";
import { useNotification } from "@/shared/hooks";
import type { ExperienceWithPositions } from "@/types";

import {
  useDeleteExperience,
  useExperiences,
  useReorderExperiences,
} from "../hooks/useUserQueries";
import { ExperienceModal } from "./ExperienceModal";

/** Props for ExperienceTab component */
interface ExperienceTabProps {
  /** User ID */
  userId: string;
}

/**
 * Experience management tab with table, reorder controls, and CRUD modal.
 *
 * @param props - ExperienceTabProps
 */
export function ExperienceTab({ userId }: ExperienceTabProps) {
  const { notify } = useNotification();

  const { data: experiences = [], isLoading } = useExperiences(userId);
  const deleteMutation = useDeleteExperience();
  const reorderMutation = useReorderExperiences();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<ExperienceWithPositions | undefined>(
    undefined,
  );

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    company: string;
  } | null>(null);

  /** Sorted experiences by sn */
  const sorted = [...experiences].sort((a, b) => a.sn - b.sn);

  const paginatedData = sorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  /**
   * Move an experience up or down in the order.
   *
   * @param index - Current index in the sorted array
   * @param direction - Direction to move ("up" or "down")
   */
  const handleMove = (index: number, direction: "up" | "down") => {
    const ids = sorted.map((e) => e.id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= ids.length) return;

    // Swap
    [ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]];

    reorderMutation.mutate(
      { userId, payload: { sn: ids } },
      {
        onError: () => notify.error("排序更新失敗"),
      },
    );
  };

  const columns: ColumnDef<ExperienceWithPositions>[] = [
    {
      key: "company",
      label: "Company",
      render: (row) => row.company,
    },
    {
      key: "positions",
      label: "Positions",
      width: 100,
      align: "center",
      render: (row) => row.positions.length,
    },
    {
      key: "sn",
      label: "Order",
      width: 80,
      align: "center",
      render: (row) => row.sn,
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      width: 180,
      render: (row) => {
        const currentIndex = sorted.findIndex((e) => e.id === row.id);
        return (
          <>
            <IconButton
              size="small"
              disabled={currentIndex === 0 || reorderMutation.isPending}
              onClick={() => handleMove(currentIndex, "up")}
              aria-label="move up"
            >
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              disabled={
                currentIndex === sorted.length - 1 || reorderMutation.isPending
              }
              onClick={() => handleMove(currentIndex, "down")}
              aria-label="move down"
            >
              <ArrowDownwardIcon fontSize="small" />
            </IconButton>
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
              onClick={() =>
                setDeleteTarget({ id: row.id, company: row.company })
              }
              aria-label="delete"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        );
      },
    },
  ];

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync({
        userId,
        expId: deleteTarget.id,
      });
      notify.success("經歷刪除成功");
    } catch {
      notify.error("經歷刪除失敗");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => {
          setEditData(undefined);
          setModalOpen(true);
        }}
        sx={{ mb: 2 }}
      >
        新增經歷
      </Button>

      <BaseTable<ExperienceWithPositions>
        columns={columns}
        data={paginatedData}
        total={sorted.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(rpp) => {
          setRowsPerPage(rpp);
          setPage(0);
        }}
        loading={isLoading}
        emptyMessage="尚無工作經歷"
        getRowKey={(row) => row.id}
      />

      <ExperienceModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(undefined);
        }}
        userId={userId}
        editData={editData}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        message={`確定要刪除「${deleteTarget?.company ?? ""}」的經歷嗎？此操作無法復原。`}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
