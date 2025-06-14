import React, { useContext } from 'react';
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
const queryClient = new QueryClient();

const App = () => {

  const PrivateRoute = () => {
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/*" element={<Navigate to="/login" />} />
                  <Route path="/login" element={<Login />} />
                  <Route element={<PrivateRoute />} >
                      <Route path="/dashboard" element={<Layout />}>
                        <Route path="chat/:roomId" element={<Chat />} />
                        {/* <Route path="/chat" element={<Chat />} /> */}
                      </Route>
                  </Route>
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
};

export default App;
