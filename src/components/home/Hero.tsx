"use client";

import { Box, Button, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";

import { theme } from "@/shared/styles/theme";

/**
 * Generate floating path data based on position.
 */
const ANIMATION_DURATION = 15;

const generatePaths = (position: number) =>
  Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
    delay: (i % 12) * 0.3,
  }));

/**
 * Generate paths with a left turn for SmallFloatingPaths.
 */
const SMALL_PATH_COUNT = 13;
const SMALL_BASE_DELAY = 0.5;
const SMALL_STAGGER_DELAY = 0.12;
const SMALL_TOTAL_STAGGER = SMALL_PATH_COUNT * SMALL_STAGGER_DELAY;
const SMALL_CYCLE_GAP = 1.2;

const generateSmallPaths = (position: number) =>
  Array.from({ length: SMALL_PATH_COUNT }, (_, i) => {
    const staggerDelay = i * SMALL_STAGGER_DELAY;
    return {
      id: i,
      d: `M${900 + i * 4 * position} ${300 - i * 6}
          C${820 + i * 3 * position} ${280 - i * 5} ${760 + i * 3 * position} ${250 - i * 4} ${700 + i * 2 * position} ${240 - i * 4}
          C${620 + i * 2 * position} ${230 - i * 3} ${550 + i * 2 * position} ${160 - i * 3} ${480 + i * position} ${100 - i * 3}
          C${420 + i * position} ${50 - i * 2} ${380 + i * position} ${-20 - i * 2} ${320 + i * position} ${-60 - i * 2}`,
      width: 0.5 + i * 0.02,
      opacity: 0.6 - i * 0.02,
      delay: SMALL_BASE_DELAY + staggerDelay,
      repeatDelay: SMALL_TOTAL_STAGGER - staggerDelay + SMALL_CYCLE_GAP,
    };
  });

const HeroContainer = styled(Box)({
  position: "relative",
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  backgroundColor: "#0a0a0a",
});

const PathsContainer = styled(Box)({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
});

const StyledSvg = styled("svg")({
  width: "100%",
  height: "100%",
  color: "rgba(255, 255, 255, 0.8)",
});

const ContentContainer = styled(Box)({
  position: "relative",
  zIndex: 10,
  maxWidth: "56rem",
  margin: "0 auto",
  padding: "0 1rem",
  textAlign: "center",
});

const Title = styled("h1")({
  fontSize: "clamp(3rem, 10vw, 6rem)",
  fontWeight: 700,
  marginBottom: "2rem",
  letterSpacing: "-0.05em",
});

const StyledButton = styled(Button)({
  borderRadius: "0.75rem",
  padding: "0.625rem 1.25rem",
  fontSize: "0.875rem",
  fontWeight: 600,
  backdropFilter: "blur(12px)",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  color: "#000",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 1)",
    transform: "translateY(-2px)",
    boxShadow: "0 10px 40px rgba(255, 255, 255, 0.1)",
  },
});

const ButtonWrapper = styled(Box)({
  display: "inline-block",
  background:
    "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.1))",
  padding: "1px",
  borderRadius: "0.85rem",
  backdropFilter: "blur(12px)",
  overflow: "hidden",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 8px 40px rgba(0, 0, 0, 0.4)",
  },
});

interface FloatingPathsProps {
  position: number;
}

/**
 * Floating animated paths background.
 */
const FloatingPaths = ({ position }: FloatingPathsProps) => {
  const paths = useMemo(() => generatePaths(position), [position]);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const xViewBox = isMobile ? "0 -100 696 316" : "40 -20 696 316";

  return (
    <PathsContainer>
      <StyledSvg
        viewBox={xViewBox}
        fill="none"
        preserveAspectRatio="xMinYMid slice"
        // style={{
        //   transform: `translateX(${translateX})`,
        // }}
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.8, opacity: 0.6, pathOffset: -0.6 }}
            animate={{
              pathOffset: [-0.6, 1.3],
            }}
            transition={{
              duration: ANIMATION_DURATION,
              repeat: Infinity,
              delay: path.delay,
              ease: "linear",
            }}
          />
        ))}
      </StyledSvg>
    </PathsContainer>
  );
};

/**
 * Smaller floating paths for top-right corner.
 */
const SmallFloatingPaths = ({ position }: FloatingPathsProps) => {
  const paths = useMemo(() => generateSmallPaths(position), [position]);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const left = isMobile ? -150 : -100;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <StyledSvg
        viewBox={`${left} 160 900 500`}
        fill="none"
        preserveAspectRatio="xMaxYMin slice"
      >
        <title>Small Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={{ pathLength: 0.8, pathOffset: -1.0, opacity: 0 }}
            animate={{
              pathOffset: [-1.0, 1.3],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: ANIMATION_DURATION * 1.2,
              repeat: Infinity,
              repeatDelay: path.repeatDelay,
              delay: path.delay,
              ease: "linear",
            }}
          />
        ))}
      </StyledSvg>
    </Box>
  );
};

interface HeroProps {
  title?: string;
}

/**
 * Hero section with animated floating paths background.
 */
const Hero = ({ title = "" }: HeroProps) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const fontSize = isMobile ? "80px" : "120px";
  const words = title.split(" ").map((word, wordIndex) => ({
    text: word,
    letters: word.split("").map((letter, letterIndex) => ({
      id: `${word}-${wordIndex}-${letterIndex}`,
      char: letter,
      delay: wordIndex * 0.1 + letterIndex * 0.03,
    })),
  }));

  return (
    <HeroContainer>
      {/* Background paths */}
      <Box sx={{ position: "absolute", inset: 0 }}>
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
        <SmallFloatingPaths position={1} />
      </Box>

      {/* Content */}
      <ContentContainer>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <Title>
            {words.map((word) => (
              <span
                key={word.text}
                style={{ display: "inline-block", marginRight: "1rem" }}
              >
                {word.letters.map((letter) => (
                  <motion.span
                    key={letter.id}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: letter.delay,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    style={{
                      display: "inline-block",
                      background:
                        "linear-gradient(to right, #fff, rgba(255,255,255,0.8))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontSize: fontSize,
                    }}
                  >
                    {letter.char}
                  </motion.span>
                ))}
              </span>
            ))}
          </Title>

          <Link href="/projects" style={{ textDecoration: "none" }}>
            <ButtonWrapper>
              <StyledButton variant="contained" disableElevation>
                <span style={{ opacity: 0.9 }}>Explore My Work</span>
                <motion.span
                  style={{ marginLeft: "0.5rem", display: "inline-block" }}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.3 }}
                >
                  →
                </motion.span>
              </StyledButton>
            </ButtonWrapper>
          </Link>
        </motion.div>
      </ContentContainer>
    </HeroContainer>
  );
};

export default Hero;
