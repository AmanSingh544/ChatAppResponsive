import React, { useContext, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "./hooks/useAuth-context";
import { SocketProvider } from "./hooks/useSocketContext";
import Layout from "./pages/Layout";
import { useAuth } from '@/hooks/useAuth-context.tsx'
import { NetworkProvider, useNetworkCheck } from '@/hooks/network-context';

const queryClient = new QueryClient();

const PrivateRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <NetworkProvider>
      <AppContent />
    </NetworkProvider>
  );
};

// This is a new component where the hook is safely used inside the provider
const AppContent = () => {
  const { isOnline } = useNetworkCheck();

  return isOnline ? (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/*" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Layout />}>
                      <Route path="chat/:roomId" element={<Chat />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  ) : (
    <NetworkStatus />
  );
};


export default App;

export function NetworkStatus() {
  const { isOnline } = useNetworkCheck();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      window.location.reload(); // Simulate retry or re-check logic
    }, 1000);
  };

  if (isOnline) return null;


  // 📡 Offline Icon SVG
  const OfflineIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="64"
      viewBox="0 0 24 24"
      width="64"
      fill="#555"
      style={{ marginBottom: "24px" }}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M16.72 11.06c.46.59.84 1.25 1.13 1.97.18.45-.14.97-.63.97h-1.16a.738.738 0 01-.69-.49c-.24-.67-.59-1.28-1.02-1.82l2.37-2.37zm3.93 3.93A9.89 9.89 0 0020 12c0-5.52-4.48-10-10-10-1.58 0-3.07.37-4.41 1.02l1.51 1.51a8.01 8.01 0 019.98 9.98l1.51 1.51c.65-1.34 1.02-2.83 1.02-4.41 0-.88-.11-1.74-.32-2.57l1.86-1.86c.62 1.59.96 3.3.96 5.13 0 1.54-.24 3.01-.66 4.39l1.44 1.44a11.899 11.899 0 000-16.8l-1.44 1.44zM12 4c1.85 0 3.55.63 4.91 1.69l-1.45 1.45A6.997 6.997 0 0012 6c-1.61 0-3.1.59-4.24 1.56L6.31 5.94C7.66 4.75 9.74 4 12 4zm-6 8c0 1.5.39 2.9 1.06 4.12L5.64 18.4A9.894 9.894 0 014 12c0-.89.11-1.75.32-2.57l1.86 1.86C6.05 11.14 6 11.57 6 12zm6 8c-1.85 0-3.55-.63-4.91-1.69l1.45-1.45A6.997 6.997 0 0012 18c1.61 0 3.1-.59 4.24-1.56l1.45 1.45A8.003 8.003 0 0112 20zm0-4c-.7 0-1.37-.14-2-.39l2.79-2.79c.25.63.39 1.3.39 2 0 .55-.45 1-1 1zM2.1 2.1l19.8 19.8-1.41 1.41-2.72-2.72a9.93 9.93 0 01-6.77 2.41c-5.52 0-10-4.48-10-10 0-2.5.93-4.78 2.47-6.53L.69 3.51 2.1 2.1z" />
    </svg>
  );

  // 🔄 Refresh Icon SVG (used in button)
  const RefreshIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      fill="white"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7a6 6 0 11-6 6H4a8 8 0 108-8c1.48 0 2.84.4 4.02 1.1l1.63-1.63z" />
    </svg>
  );

  const styles = {
    container: {
      width: "100vw",
      height: "100vh",
      background: "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "16px",
    },
    card: {
      textAlign: "center",
      padding: "32px",
      borderRadius: "20px",
      background: "#f9f9f9",
      boxShadow: "0 4px 30px rgba(0,0,0,0.05)",
      maxWidth: "380px",
      width: "100%",
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      margin: "8px 0",
      color: "#222",
    },
    subtitle: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "24px",
    },
    button: {
      backgroundColor: "#222",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      fontSize: "14px",
      borderRadius: "8px",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background 0.2s",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <OfflineIcon />
        <h2 style={styles.title}>You're offline</h2>
        <p style={styles.subtitle}>Please connect to the internet and try again.</p>
        <button style={styles.button} onClick={handleRetry}>
          <RefreshIcon />
          <span style={{ marginLeft: "8px" }}>{retrying ? "Retrying..." : "Retry"}</span>
        </button>
      </div>
    </div>
  );
}