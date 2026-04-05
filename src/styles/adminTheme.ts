import { createTheme } from "@mui/material/styles";

export const adminTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff",
      contrastText: "#000000",
    },
    secondary: {
      main: "#888888",
      contrastText: "#ffffff",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
  },
});
