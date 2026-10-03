import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import WelcomeScreen from "./components/WelcomeScreen";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import OnboardingScreen from "./components/OnboardingScreen";
import MainScreen from "./components/MainScreen";
import { AuthUser, getStoredUser, logoutUser } from "./services/auth";

type Screen = "welcome" | "login" | "register" | "onboarding" | "home";
export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
function AppContent() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [restoring, setRestoring] = useState(true);
  function handleAuthSuccess(nextUser: AuthUser) {
    setUser(nextUser);
    setScreen(nextUser.onboardingCompleted ? "home" : "onboarding");
  }
  useEffect(() => {
    let active = true;
    getStoredUser()
      .then((stored) => {
        if (active && stored) handleAuthSuccess(stored);
      })
      .catch(() => {
        /* A missing or unreadable session returns to the welcome screen. */
      })
      .finally(() => {
        if (active) setRestoring(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function signOut() {
    try {
      await logoutUser();
      setUser(null);
      setScreen("login");
    } catch {
      Alert.alert("Unable to sign out", "Please try again.");
    }
  }
  function handleGoogle() {
    Alert.alert(
      "Google Sign In",
      "Google authentication will be connected using the Android development build.",
    );
  }
  if (restoring)
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#079455" size="large" />
      </View>
    );
  if (screen === "welcome")
    return <WelcomeScreen onStart={() => setScreen("login")} />;
  if (screen === "register")
    return (
      <RegisterScreen
        onBack={() => setScreen("login")}
        onLogin={() => setScreen("login")}
        onGoogle={handleGoogle}
        onSuccess={handleAuthSuccess}
      />
    );
  if (screen === "onboarding" && user)
    return (
      <OnboardingScreen
        user={user}
        onComplete={handleAuthSuccess}
        onSignOut={signOut}
      />
    );
  if (screen === "home" && user)
    return <MainScreen user={user} onSignOut={signOut} />;
  return (
    <LoginScreen
      onBack={() => setScreen("welcome")}
      onRegister={() => setScreen("register")}
      onGoogle={handleGoogle}
      onSuccess={handleAuthSuccess}
    />
  );
}
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});
