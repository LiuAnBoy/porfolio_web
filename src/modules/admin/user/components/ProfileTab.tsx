"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { FileUpload, RichTextEditor } from "@/shared/components/common";
import { ImageValue, useNotification } from "@/shared/hooks";
import type { ISocial, SocialPlatform, UserData } from "@/types";
import { SOCIAL_PLATFORM } from "@/types";

import { useUpdateUser } from "../hooks/useUserQueries";

/** Props for ProfileTab component */
interface ProfileTabProps {
  /** User data to populate the form */
  user: UserData;
}

/** Form values for the profile form */
interface ProfileFormValues {
  name: string;
  email: string;
  title: string;
  bio: string;
  avatar: ImageValue | null;
  socials: ISocial[];
}

/** Available social platform options */
const PLATFORM_OPTIONS: { label: string; value: SocialPlatform }[] = [
  { label: "GitHub", value: SOCIAL_PLATFORM.GITHUB },
  { label: "LinkedIn", value: SOCIAL_PLATFORM.LINKEDIN },
  { label: "LINE", value: SOCIAL_PLATFORM.LINE },
  { label: "Telegram", value: SOCIAL_PLATFORM.TELEGRAM },
  { label: "WeChat", value: SOCIAL_PLATFORM.WECHAT },
];

/**
 * Convert user avatar to ImageValue.
 *
 * @param avatar - User avatar data or null
 * @returns ImageValue or null
 */
function toImageValue(
  avatar: { id: string; url: string } | null,
): ImageValue | null {
  if (!avatar) return null;
  return { imageId: avatar.id, url: avatar.url };
}

/**
 * Profile editing tab with user details, avatar upload, and social links.
 *
 * @param props - ProfileTabProps
 */
export function ProfileTab({ user }: ProfileTabProps) {
  const { notify } = useNotification();
  const updateMutation = useUpdateUser();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: user.name,
      email: user.email,
      title: user.title,
      bio: user.bio,
      avatar: toImageValue(user.avatar),
      socials: user.socials,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socials",
  });

  /** Re-populate form when user data changes */
  useEffect(() => {
    reset({
      name: user.name,
      email: user.email,
      title: user.title,
      bio: user.bio,
      avatar: toImageValue(user.avatar),
      socials: user.socials,
    });
  }, [user, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateMutation.mutateAsync({
        id: user.id,
        payload: {
          name: values.name,
          title: values.title,
          bio: values.bio,
          avatar: values.avatar?.imageId ?? null,
          socials: values.socials,
        },
      });
      notify.success("個人資料更新成功");
    } catch {
      notify.error("個人資料更新失敗");
    }
  });

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 700 }}
    >
      {/* Name */}
      <TextField
        {...register("name", { required: "Name is required" })}
        label="Name"
        fullWidth
        error={Boolean(errors.name)}
        helperText={errors.name?.message}
      />

      {/* Email (readonly) */}
      <TextField
        {...register("email")}
        label="Email"
        fullWidth
        slotProps={{ input: { readOnly: true } }}
      />

      {/* Title */}
      <TextField {...register("title")} label="Title" fullWidth />

      {/* Bio */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Bio
        </Typography>
        <Controller
          name="bio"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Write something about yourself..."
            />
          )}
        />
      </Box>

      {/* Avatar */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Avatar
        </Typography>
        <Controller
          name="avatar"
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
              module="user"
            />
          )}
        />
      </Box>

      {/* Social links */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="subtitle2">Social Links</Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() =>
              append({ platform: SOCIAL_PLATFORM.GITHUB, url: "" })
            }
          >
            Add
          </Button>
        </Box>

        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{ display: "flex", gap: 1, mb: 1.5, alignItems: "flex-start" }}
          >
            <Controller
              name={`socials.${index}.platform`}
              control={control}
              render={({ field: platformField }) => (
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Platform</InputLabel>
                  <Select {...platformField} label="Platform">
                    {PLATFORM_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <TextField
              {...register(`socials.${index}.url`, {
                required: "URL is required",
              })}
              label="URL"
              size="small"
              fullWidth
              error={Boolean(errors.socials?.[index]?.url)}
              helperText={errors.socials?.[index]?.url?.message}
            />
            <IconButton
              size="small"
              color="error"
              onClick={() => remove(index)}
              sx={{ mt: 0.5 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* Submit */}
      <Box sx={{ pt: 1 }}>
        <Button
          variant="contained"
          type="submit"
          disabled={updateMutation.isPending}
          startIcon={
            updateMutation.isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : null
          }
        >
          儲存
        </Button>
      </Box>
    </Box>
  );
}
