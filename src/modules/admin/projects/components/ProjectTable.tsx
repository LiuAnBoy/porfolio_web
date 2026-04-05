'use client';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Switch,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  BaseTable,
  ColumnDef,
  ConfirmDialog,
  PageHeader,
  StatusChip,
} from '@/shared/components/common';
import { useNotification } from '@/shared/hooks';
import type { ProjectData } from '@/types';

import {
  useDeleteProject,
  useProjectList,
  useToggleFeatured,
  useToggleVisible,
} from '../hooks/useProjectQueries';

/**
 * Project management table with CRUD operations.
 * Includes featured/visible toggles, tag/stack chips, and navigation to edit pages.
 */
export function ProjectTable() {
  const router = useRouter();
  const { notify } = useNotification();

  const { data: result, isLoading, isError } = useProjectList();
  const projects = result?.payload ?? [];
  const total = result?.total_count ?? 0;

  const deleteMutation = useDeleteProject();
  const toggleFeatured = useToggleFeatured();
  const toggleVisible = useToggleVisible();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState('');

  if (isError) {
    return <Typography color="error">載入失敗，請重新整理頁面。</Typography>;
  }

  const paginatedData = projects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const columns: ColumnDef<ProjectData>[] = [
    {
      key: 'cover',
      label: 'Cover',
      width: 80,
      render: (row) =>
        row.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.cover.url}
            alt={row.title}
            style={{
              width: 56,
              height: 40,
              objectFit: 'cover',
              borderRadius: 4,
            }}
          />
        ) : (
          <Box
            sx={{
              width: 56,
              height: 40,
              borderRadius: 1,
              backgroundColor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" color="text.disabled">
              N/A
            </Typography>
          </Box>
        ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (row) => row.title,
    },
    {
      key: 'type',
      label: 'Type',
      width: 100,
      render: (row) => <StatusChip label={row.type} color="primary" />,
    },
    {
      key: 'tags',
      label: 'Tags',
      width: 200,
      render: (row) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {row.tags.slice(0, 3).map((tag) => (
            <Chip
              key={tag.id}
              label={tag.label}
              size="small"
              variant="outlined"
            />
          ))}
          {row.tags.length > 3 && (
            <Chip label={`+${row.tags.length - 3}`} size="small" />
          )}
        </Box>
      ),
    },
    {
      key: 'stacks',
      label: 'Stacks',
      width: 200,
      render: (row) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {row.stacks.slice(0, 3).map((stack) => (
            <Chip
              key={stack.id}
              label={stack.label}
              size="small"
              variant="outlined"
            />
          ))}
          {row.stacks.length > 3 && (
            <Chip label={`+${row.stacks.length - 3}`} size="small" />
          )}
        </Box>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      width: 80,
      align: 'center',
      render: (row) => (
        <Switch
          size="small"
          checked={row.isFeatured}
          onChange={(_, checked) =>
            toggleFeatured.mutate({ id: row.id, isFeatured: checked })
          }
        />
      ),
    },
    {
      key: 'visible',
      label: 'Visible',
      width: 80,
      align: 'center',
      render: (row) => (
        <Switch
          size="small"
          checked={row.isVisible}
          onChange={(_, checked) =>
            toggleVisible.mutate({ id: row.id, isVisible: checked })
          }
        />
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      width: 100,
      render: (row) => (
        <>
          <IconButton
            size="small"
            onClick={() => router.push(`/admin/projects/${row.id}`)}
            aria-label="edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setDeleteId(row.id);
              setDeleteTitle(row.title);
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
      notify.success('專案刪除成功');
    } catch (error) {
      const apiMessage = (
        error as { response?: { data?: { message?: string } } }
      ).response?.data?.message;
      notify.error(apiMessage ?? '專案刪除失敗');
    } finally {
      setDeleteId(null);
      setDeleteTitle('');
    }
  };

  return (
    <>
      <PageHeader
        title="作品管理"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/projects/create')}
          >
            新增
          </Button>
        }
      />

      <BaseTable<ProjectData>
        columns={columns}
        data={paginatedData}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(rpp) => {
          setRowsPerPage(rpp);
          setPage(0);
        }}
        loading={isLoading}
        emptyMessage="尚無專案資料"
        getRowKey={(row) => row.id}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => {
          setDeleteId(null);
          setDeleteTitle('');
        }}
        onConfirm={handleDeleteConfirm}
        message={`確定要刪除專案「${deleteTitle}」嗎？此操作無法復原。`}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
