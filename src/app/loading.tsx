import { Box, CircularProgress } from "@mui/material";

/**
 * Global loading state for SSR.
 */
export default function Loading() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
    </Box>
  );
}
