"use client";

import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";
import LabelIcon from "@mui/icons-material/Label";
import LayersIcon from "@mui/icons-material/Layers";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import { type ReactNode } from "react";

import { useDashboardQuery } from "../hooks/useDashboardQuery";

/** Single stat card configuration */
interface StatCard {
  label: string;
  count: number;
  icon: ReactNode;
  href: string;
  color: string;
}

/**
 * Skeleton placeholder for stat cards while loading.
 */
function StatCardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" height={40} />
      </CardContent>
    </Card>
  );
}

/**
 * A single stat card displaying an icon, label, count, and link.
 *
 * @param props - StatCard
 */
function StatCardItem({ label, count, icon, href, color }: StatCard) {
  return (
    <Card
      component={Link}
      href={href}
      sx={{
        display: "block",
        textDecoration: "none",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box sx={{ color }}>{icon}</Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight={700}>
          {count}
        </Typography>
      </CardContent>
    </Card>
  );
}

/**
 * Dashboard main content component.
 * Displays stat cards and recent item lists.
 */
export function DashboardContent() {
  const { data, isLoading } = useDashboardQuery();

  const statCards: StatCard[] = data
    ? [
        {
          label: "Projects",
          count: data.counts.projects,
          icon: <FolderIcon />,
          href: "/admin/projects",
          color: "primary.main",
        },
        {
          label: "Tags",
          count: data.counts.tags,
          icon: <LabelIcon />,
          href: "/admin/tags",
          color: "success.main",
        },
        {
          label: "Stacks",
          count: data.counts.stacks,
          icon: <LayersIcon />,
          href: "/admin/stacks",
          color: "warning.main",
        },
        {
          label: "Images",
          count: data.counts.images,
          icon: <ImageIcon />,
          href: "/admin/images",
          color: "info.main",
        },
      ]
    : [];

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {isLoading
          ? [0, 1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <StatCardSkeleton />
              </Grid>
            ))
          : statCards.map((card) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
                <StatCardItem {...card} />
              </Grid>
            ))}
      </Grid>

      {/* Recent Items */}
      <Grid container spacing={3}>
        {/* Recent Projects */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Recent Projects
            </Typography>
            {isLoading ? (
              [0, 1, 2].map((i) => (
                <Skeleton key={i} variant="text" height={40} />
              ))
            ) : data && data.recentProjects.length > 0 ? (
              <List dense disablePadding>
                {data.recentProjects.map((p) => (
                  <ListItem key={p.id} disableGutters>
                    <ListItemText
                      primary={p.name}
                      secondary={dayjs(p.updatedAt * 1000).format("YYYY-MM-DD")}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No projects yet
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Recent Tags */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Recent Tags
            </Typography>
            {isLoading ? (
              [0, 1, 2].map((i) => (
                <Skeleton key={i} variant="text" height={40} />
              ))
            ) : data && data.recentTags.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pt: 1 }}>
                {data.recentTags.map((t) => (
                  <Chip key={t.id} label={t.label} size="small" />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No tags yet
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Recent Stacks */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Recent Stacks
            </Typography>
            {isLoading ? (
              [0, 1, 2].map((i) => (
                <Skeleton key={i} variant="text" height={40} />
              ))
            ) : data && data.recentStacks.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pt: 1 }}>
                {data.recentStacks.map((s) => (
                  <Chip key={s.id} label={s.label} size="small" />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No stacks yet
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
