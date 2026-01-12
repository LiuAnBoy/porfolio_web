"use client";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { Experience } from "@/services/user/types";

import ExperienceCard from "./ExperienceCard";

const SectionContainer = styled(Box)({
  marginTop: 48,
});

const SectionTitle = styled(Typography)({
  color: "#fff",
  fontWeight: 700,
  fontSize: "1.5rem",
  marginBottom: 24,
  paddingLeft: 4,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    left: -16,
    top: "50%",
    transform: "translateY(-50%)",
    width: 4,
    height: "100%",
    backgroundColor: "#22d3ee",
    borderRadius: 2,
  },
});

const ExperienceStack = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 20,
});

interface ExperienceListProps {
  experiences: Experience[];
}

/**
 * List of work experiences.
 */
const ExperienceList = ({ experiences }: ExperienceListProps) => {
  if (experiences.length === 0) {
    return null;
  }

  return (
    <SectionContainer>
      <SectionTitle>Work Experience</SectionTitle>
      <ExperienceStack>
        {experiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </ExperienceStack>
    </SectionContainer>
  );
};

export default ExperienceList;
