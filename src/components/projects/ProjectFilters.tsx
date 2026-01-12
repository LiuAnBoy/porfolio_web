"use client";

import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { MouseEvent } from "react";

import type { ProjectType } from "@/services/projects/types";

const FiltersContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 16,
  marginBottom: 32,
  flexWrap: "wrap",
});

const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  borderRadius: 12,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  "& .MuiToggleButtonGroup-grouped": {
    border: "none",
    borderRadius: 10,
    margin: 4,
    padding: "8px 20px",
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "0.875rem",
    fontWeight: 500,
    textTransform: "none",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    "&.Mui-selected": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "#fff",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.12)",
      },
    },
  },
});

const PROJECT_TYPES = [
  { value: "", label: "All" },
  { value: "WEB", label: "Web" },
  { value: "APP", label: "App" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

interface ProjectFiltersProps {
  type: ProjectType | undefined;
  onTypeChange: (type: ProjectType | undefined) => void;
}

/**
 * Filters for project list (type filter).
 */
const ProjectFilters = ({ type, onTypeChange }: ProjectFiltersProps) => {
  const handleTypeChange = (
    _: MouseEvent<HTMLElement>,
    newType: string | null,
  ) => {
    onTypeChange(newType ? (newType as ProjectType) : undefined);
  };

  return (
    <FiltersContainer>
      <StyledToggleButtonGroup
        value={type ?? ""}
        exclusive
        onChange={handleTypeChange}
        aria-label="project type filter"
      >
        {PROJECT_TYPES.map((item) => (
          <ToggleButton key={item.label} value={item.value}>
            {item.label}
          </ToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </FiltersContainer>
  );
};

export default ProjectFilters;
