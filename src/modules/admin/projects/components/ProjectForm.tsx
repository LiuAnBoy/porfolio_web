"use client";

import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { pinyin } from "pinyin-pro";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { useStackList } from "@/modules/admin/stacks/hooks/useStackQueries";
import { useTagList } from "@/modules/admin/tags/hooks/useTagQueries";
import {
  FileUpload,
  PageHeader,
  RichTextEditor,
} from "@/shared/components/common";
import { ImageValue, useNotification } from "@/shared/hooks";
import type { PopulatedRef, ProjectPayload, ProjectType } from "@/types";
import { PROJECT_TYPE_OPTIONS } from "@/types";

import {
  useCreateProject,
  useProjectDetail,
  useUpdateProject,
} from "../hooks/useProjectQueries";

/** Props for ProjectForm component */
interface ProjectFormProps {
  /** Form mode */
  mode: "create" | "edit";
  /** Project ID for edit mode */
  projectId?: string;
}

/** Form values for the project form */
interface ProjectFormValues {
  title: string;
  slug: string;
  description: string;
  type: ProjectType;
  cover: ImageValue | null;
  gallery: ImageValue[];
  tags: PopulatedRef[];
  stacks: PopulatedRef[];
  isFeatured: boolean;
  isVisible: boolean;
  link: string;
  partner: string;
}

/**
 * Generate a URL-friendly slug from a title using pinyin-pro.
 *
 * @param title - The project title (may contain Chinese characters)
 * @returns URL-friendly slug string
 */
function generateSlug(title: string): string {
  return pinyin(title, { toneType: "none", separator: "-" })
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Convert populated refs to ImageValue for cover.
 *
 * @param ref - Image reference data or null
 * @returns ImageValue or null
 */
function toImageValue(
  ref: { id: string; url: string } | null,
): ImageValue | null {
  if (!ref) return null;
  return { imageId: ref.id, url: ref.url };
}

/**
 * Convert array of image refs to ImageValue array.
 *
 * @param refs - Array of image reference data
 * @returns Array of ImageValue
 */
function toImageValues(refs: { id: string; url: string }[]): ImageValue[] {
  return refs.map((r) => ({ imageId: r.id, url: r.url }));
}

/**
 * Project create/edit form with all fields.
 * Uses React Hook Form with controlled MUI components.
 *
 * @param props - ProjectFormProps
 */
export function ProjectForm({ mode, projectId }: ProjectFormProps) {
  const router = useRouter();
  const { notify } = useNotification();
  const isEdit = mode === "edit";

  const { data: project, isLoading: isLoadingProject } = useProjectDetail(
    projectId ?? "",
  );
  const { data: tagOptions = [] } = useTagList();
  const { data: stackOptions = [] } = useStackList();

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      type: "WEB",
      cover: null,
      gallery: [],
      tags: [],
      stacks: [],
      isFeatured: false,
      isVisible: true,
      link: "",
      partner: "",
    },
  });

  const titleValue = watch("title");
  const slugValue = watch("slug");

  /** Auto-generate slug when title changes (only if slug hasn't been manually edited) */
  useEffect(() => {
    if (!isEdit && titleValue) {
      const generated = generateSlug(titleValue);
      setValue("slug", generated);
    }
  }, [titleValue, isEdit, setValue]);

  /** Populate form when project data loads in edit mode */
  useEffect(() => {
    if (isEdit && project) {
      reset({
        title: project.title,
        slug: project.slug,
        description: project.description,
        type: project.type,
        cover: toImageValue(project.cover),
        gallery: toImageValues(project.gallery),
        tags: project.tags,
        stacks: project.stacks,
        isFeatured: project.isFeatured,
        isVisible: project.isVisible,
        link: project.link ?? "",
        partner: project.partner ?? "",
      });
    }
  }, [isEdit, project, reset]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = handleSubmit(async (values) => {
    const payload: ProjectPayload = {
      title: values.title,
      slug: values.slug,
      description: values.description,
      type: values.type,
      tags: values.tags.map((t) => t.id),
      stacks: values.stacks.map((s) => s.id),
      isFeatured: values.isFeatured,
      isVisible: values.isVisible,
      link: values.link || null,
      partner: values.partner || null,
      cover: values.cover?.imageId ?? null,
      gallery: values.gallery.map((g) => g.imageId),
    };

    try {
      if (isEdit && projectId) {
        await updateMutation.mutateAsync({ id: projectId, payload });
        notify.success("專案更新成功");
      } else {
        await createMutation.mutateAsync(payload);
        notify.success("專案建立成功");
      }
      router.push("/admin/projects");
    } catch {
      notify.error(isEdit ? "專案更新失敗" : "專案建立失敗");
    }
  });

  if (isEdit && isLoadingProject) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <PageHeader title={isEdit ? "編輯專案" : "新增專案"} />

      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 800 }}
      >
        {/* Title */}
        <TextField
          {...register("title", { required: "Title is required" })}
          label="Title"
          fullWidth
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
        />

        {/* Slug */}
        <TextField
          {...register("slug", { required: "Slug is required" })}
          label="Slug"
          fullWidth
          error={Boolean(errors.slug)}
          helperText={errors.slug?.message ?? `Preview: ${slugValue}`}
        />

        {/* Description */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Description
          </Typography>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Enter project description..."
              />
            )}
          />
        </Box>

        {/* Type */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select {...field} label="Type">
                {PROJECT_TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        {/* Cover */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Cover Image
          </Typography>
          <Controller
            name="cover"
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
                module="projects"
              />
            )}
          />
        </Box>

        {/* Gallery */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Gallery
          </Typography>
          <Controller
            name="gallery"
            control={control}
            render={({ field }) => (
              <FileUpload
                value={field.value.length > 0 ? field.value : null}
                onChange={(val) => {
                  if (val === null) {
                    field.onChange([]);
                  } else if (Array.isArray(val)) {
                    field.onChange(val);
                  } else {
                    field.onChange([val]);
                  }
                }}
                multiple
                module="projects"
                maxFiles={10}
              />
            )}
          />
        </Box>

        {/* Tags */}
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              options={tagOptions}
              getOptionLabel={(opt) => opt.label}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              value={field.value}
              onChange={(_, newValue) => field.onChange(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option.label}
                      size="small"
                      {...tagProps}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Select tags" />
              )}
            />
          )}
        />

        {/* Stacks */}
        <Controller
          name="stacks"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              options={stackOptions}
              getOptionLabel={(opt) => opt.label}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              value={field.value}
              onChange={(_, newValue) => field.onChange(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option.label}
                      size="small"
                      {...tagProps}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Stacks"
                  placeholder="Select stacks"
                />
              )}
            />
          )}
        />

        {/* Switches row */}
        <Box sx={{ display: "flex", gap: 4 }}>
          <Controller
            name="isFeatured"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch checked={field.value} onChange={field.onChange} />
                }
                label="Featured"
              />
            )}
          />
          <Controller
            name="isVisible"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch checked={field.value} onChange={field.onChange} />
                }
                label="Visible"
              />
            )}
          />
        </Box>

        {/* Link */}
        <TextField
          {...register("link")}
          label="Link (optional)"
          fullWidth
          placeholder="https://..."
        />

        {/* Partner */}
        <TextField
          {...register("partner")}
          label="Partner (optional)"
          fullWidth
        />

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
          <Button
            variant="contained"
            type="submit"
            disabled={isPending}
            startIcon={
              isPending ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {isEdit ? "更新" : "建立"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/admin/projects")}
            disabled={isPending}
          >
            取消
          </Button>
        </Box>
      </Box>
    </>
  );
}
