import { createTheme } from "@mui/material";

const customeTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#C5A059",
    },
    secondary: {
      main: "#1E1E24",
    },
    background: {
      default: "#070708",
      paper: "#16161D",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A0A0A9",
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Open Sans", sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderRadius: "8px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.15)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(197, 160, 89, 0.6)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#C5A059",
            borderWidth: "1.5px",
          },
        },
        input: {
          color: "#FFFFFF !important",
          "&::placeholder": {
            color: "#71717A",
            opacity: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#A0A0A9",
          "&.Mui-focused": {
            color: "#C5A059",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#16161D",
          color: "#FFFFFF",
          backgroundImage: "none",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255, 255, 255, 0.08)",
        },
      },
    },
  },
});

export default customeTheme;