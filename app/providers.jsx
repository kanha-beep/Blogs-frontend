"use client";

import { useEffect } from "react";
import Navbar from "../src/components/Navbar.jsx";
import { AuthProvider } from "../src/auth/AuthContext.jsx";
import { ToastProvider } from "../src/components/ToastProvider.jsx";

export default function Providers({ children }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <ToastProvider>
      <AuthProvider>
        <Navbar />
        {children}
      </AuthProvider>
    </ToastProvider>
  );
}
