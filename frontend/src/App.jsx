import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AuthContainer from "./components/AuthContainer";
import { Suspense, lazy } from "react";
import PageTransition from "./components/PageTransition";

const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const SettingsPrivacyPage = lazy(() => import("./pages/SettingsPrivacyPage"));
const SettingsNotificationsPage = lazy(() => import("./pages/SettingsNotificationsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100 text-base-content">
        <Loader className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-64">
      <Loader className="size-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div
      data-theme={theme}
      className="h-screen bg-base-100 text-base-content"
    >
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <PageTransition>
              {authUser ? <HomePage /> : <Navigate to="/login" />}
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              {authUser ? <Navigate to="/" /> : <AuthContainer />}
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              {authUser ? <Navigate to="/" /> : <AuthContainer />}
            </PageTransition>
          }
        />
        <Route
          path="/settings"
          element={
            <PageTransition>
              <Suspense fallback={<LoadingFallback />}>
                {authUser ? <SettingsPage /> : <Navigate to="/login" />}
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/settings/privacy"
          element={
            <PageTransition>
              <Suspense fallback={<LoadingFallback />}>
                {authUser ? <SettingsPrivacyPage /> : <Navigate to="/login" />}
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/settings/notifications"
          element={
            <PageTransition>
              <Suspense fallback={<LoadingFallback />}>
                {authUser ? <SettingsNotificationsPage /> : <Navigate to="/login" />}
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/profile"
          element={
            <PageTransition>
              <Suspense fallback={<LoadingFallback />}>
                {authUser ? <ProfilePage /> : <Navigate to="/login" />}
              </Suspense>
            </PageTransition>
          }
        />
      </Routes>

      <Toaster position="top-right" />
    </div>
  );
};

export default App;
