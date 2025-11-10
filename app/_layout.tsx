// app/_layout.tsx
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Text as RNText } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Set Inter as the global default for <Text>
      RNText.defaultProps ??= {};
      RNText.defaultProps.style = [
        RNText.defaultProps.style,
        { fontFamily: "Inter_400Regular" },
      ];
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false, // hides the "index" header bar
        contentStyle: { backgroundColor: "black" },
      }}
    >
      {/* or just for this screen:
      <Stack.Screen name="index" options={{ headerShown: false }} />
      */}
    </Stack>
  );
}
