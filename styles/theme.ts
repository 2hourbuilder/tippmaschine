import { createTheme } from "@shopify/restyle";

const palette = {
  white: "#fff",
  black: "#000",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  red: {
    50: "##fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
};

export const theme = createTheme({
  colors: {
    mainBackground: palette.white,
    cardPrimaryBackground: palette.gray[200],
    textPrimary: palette.gray[900],
    textSecondary: palette.gray[700],
    textTertiary: palette.gray[500],
    textOnColor: palette.gray[100],
    accentPrimary: palette.red[400],
    accentSecondary: palette.red[300],
    accentTertiary: palette.red[200],
    navigationHeader: palette.gray[50],
    borderPrimary: palette.gray[300],
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontFamily: "Lato_700Bold",
      fontSize: 24,
      lineHeight: 30,
      color: "textPrimary",
    },
    subheader: {
      fontFamily: "Lato_700Bold",
      fontSize: 16,
      lineHeight: 24,
    },
    buttonLabel: {
      fontFamily: "Lato_700Bold",
      fontSize: 16,
      color: "textOnColor",
    },
    errorMessage: {
      fontFamily: "Lato_400Regular",
      fontSize: 14,
      lineHeight: 20,
      color: "accentPrimary",
    },
    formLabel: {
      fontFamily: "Lato_700Bold",
      fontSize: 14,
      lineHeight: 20,
      color: "textPrimary",
    },
    defaults: {
      fontFamily: "Lato_400Regular",
      fontSize: 16,
      lineHeight: 24,
      color: "textPrimary",
    },
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  borderRadii: {
    s: 2,
    m: 4,
    l: 8,
    xl: 16,
  },
});

export const darkTheme: Theme = createTheme({
  ...theme,
  colors: {
    mainBackground: palette.gray[900],
    cardPrimaryBackground: palette.gray[700],
    textPrimary: palette.gray[50],
    textSecondary: palette.white,
    textTertiary: palette.white,
    textOnColor: palette.gray[800],
    accentPrimary: palette.red[400],
    accentSecondary: palette.red[300],
    accentTertiary: palette.red[200],
    navigationHeader: palette.gray[800],
    borderPrimary: palette.gray[700],
  },
});

export type Theme = typeof theme;

export const NavigationTheme = {
  dark: false,
  colors: {
    primary: theme.colors.accentPrimary,
    background: theme.colors.mainBackground,
    card: theme.colors.navigationHeader,
    text: theme.colors.textPrimary,
    border: theme.colors.borderPrimary,
    notification: "rgb(255, 69, 58)",
  },
};

export const NavigationThemeDark = {
  dark: true,
  colors: {
    primary: darkTheme.colors.accentPrimary,
    background: darkTheme.colors.mainBackground,
    card: darkTheme.colors.navigationHeader,
    text: darkTheme.colors.textPrimary,
    border: darkTheme.colors.borderPrimary,
    notification: "rgb(255, 69, 58)",
  },
};
