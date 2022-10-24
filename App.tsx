import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@shopify/restyle";
import { AuthProvider } from "./firebase/auth/AuthContext";

import useCachedResources from "./helpers/hooks/useCachedResources";
import useColorScheme from "./helpers/hooks/useColorScheme";
import Navigation from "./navigation";
import { theme, darkTheme } from "./styles/theme";
import { FirestoreProvider } from "./firebase/firestore/FirestoreContext";
import { LocalStorageProvider } from "./localStorage/localStorageContext";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <LocalStorageProvider>
          <AuthProvider>
            <FirestoreProvider>
              <ThemeProvider theme={colorScheme === "dark" ? darkTheme : theme}>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
              </ThemeProvider>
            </FirestoreProvider>
          </AuthProvider>
        </LocalStorageProvider>
      </SafeAreaProvider>
    );
  }
}
