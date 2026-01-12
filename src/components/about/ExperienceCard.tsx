"use client";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import Image from "next/image";

import type { Experience } from "@/services/user/types";

const CardContainer = styled(Box)({
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  borderRadius: 16,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  padding: 24,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
});

const CardHeader = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  gap: 16,
  marginBottom: 20,
});

const CompanyIconWrapper = styled(Box)({
  width: 56,
  height: 56,
  borderRadius: 12,
  overflow: "hidden",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  flexShrink: 0,
  position: "relative",
});

const CompanyInfo = styled(Box)({
  flex: 1,
});

const CompanyName = styled(Typography)({
  color: "#fff",
  fontWeight: 600,
  fontSize: "1.125rem",
  marginBottom: 4,
});

const PositionTitle = styled(Typography)({
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "0.9375rem",
  marginBottom: 4,
});

const DateRange = styled(Typography)({
  color: "rgba(255, 255, 255, 0.4)",
  fontSize: "0.8125rem",
});

const DescriptionContainer = styled(Box)({
  "& ul": {
    margin: 0,
    paddingLeft: 20,
    listStyle: "none",
  },
  "& li": {
    position: "relative",
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: "0.875rem",
    lineHeight: 1.7,
    marginBottom: 12,
    paddingLeft: 8,
    "&:last-child": {
      marginBottom: 0,
    },
    "&::before": {
      content: '""',
      position: "absolute",
      left: -16,
      top: 10,
      width: 6,
      height: 6,
      borderRadius: "50%",
      backgroundColor: "#22d3ee",
    },
  },
  "& p": {
    margin: 0,
  },
});

const PositionDivider = styled(Box)({
  height: 1,
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  margin: "16px 0",
});

/**
 * Format date range string.
 */
const formatDateRange = (
  startAt: number,
  endAt: number | null,
  isCurrent: boolean,
): string => {
  const start = dayjs.unix(startAt).format("MMM YYYY");
  if (isCurrent || !endAt) {
    return `${start} - Present`;
  }
  const end = dayjs.unix(endAt).format("MMM YYYY");
  return `${start} - ${end}`;
};

interface ExperienceCardProps {
  experience: Experience;
}

/**
 * Experience card showing company info and positions.
 */
const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <CardContainer>
      {experience.positions.map((position, index) => (
        <Box key={position.id}>
          {index > 0 && <PositionDivider />}

          <CardHeader>
            {index === 0 && (
              <CompanyIconWrapper>
                {experience.companyIcon ? (
                  <Image
                    src={experience.companyIcon}
                    alt={experience.company}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255, 255, 255, 0.3)",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                    }}
                  >
                    {experience.company.charAt(0)}
                  </Box>
                )}
              </CompanyIconWrapper>
            )}
            {index > 0 && <Box sx={{ width: 56, flexShrink: 0 }} />}

            <CompanyInfo>
              {index === 0 && <CompanyName>{experience.company}</CompanyName>}
              <PositionTitle>{position.title}</PositionTitle>
              <DateRange>
                {formatDateRange(
                  position.startAt,
                  position.endAt,
                  position.isCurrent,
                )}
              </DateRange>
            </CompanyInfo>
          </CardHeader>

          {position.description && (
            <DescriptionContainer
              dangerouslySetInnerHTML={{ __html: position.description }}
            />
          )}
        </Box>
      ))}
    </CardContainer>
  );
};

export default ExperienceCard;
