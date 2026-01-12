"use client";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fab, Zoom } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

import { useScrollContainer } from "@/shared/contexts";

const StyledFab = styled(Fab)({
  position: "fixed",
  bottom: 32,
  right: 32,
  width: 56,
  height: 56,
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    color: "#fff",
  },
  "& svg": {
    fontSize: 28,
  },
  "@media (max-width: 767px)": {
    bottom: 24,
    right: 24,
    width: 48,
    height: 48,
    "& svg": {
      fontSize: 24,
    },
  },
});

/**
 * Scroll to top button that appears when user scrolls down.
 */
export default function ScrollToTop() {
  const { scrollContainerRef } = useScrollContainer();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef?.current;
    if (!container) return;

    const handleScroll = () => {
      setVisible(container.scrollTop > 300);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef]);

  const handleClick = () => {
    const container = scrollContainerRef?.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Zoom in={visible}>
      <StyledFab size="medium" aria-label="scroll to top" onClick={handleClick}>
        <KeyboardArrowUpIcon />
      </StyledFab>
    </Zoom>
  );
}
