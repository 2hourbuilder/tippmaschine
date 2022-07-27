import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@shopify/restyle";
import { AuthProvider } from "./firebase/auth/AuthContext";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { theme, darkTheme } from "./styles/theme";
import { CompetitionProvider } from "./firebase/firestore/CompetitionContext";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <AuthProvider>
          <CompetitionProvider>
            <ThemeProvider theme={colorScheme === "dark" ? darkTheme : theme}>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </ThemeProvider>
          </CompetitionProvider>
        </AuthProvider>
      </SafeAreaProvider>
    );
  }
}
