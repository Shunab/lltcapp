"use client";

import { usePathname } from "next/navigation";
import AppShell from "./AppShell";
import AuthGate from "./AuthGate";

const AUTH_PATHS = ["/login", "/signup", "/onboarding"];

function isProtectedPath(pathname) {
  if (["/ladder", "/matches", "/record", "/challenge", "/profile"].includes(pathname))
    return true;
  if (pathname.startsWith("/player/")) return true;
  if (/^\/matches\/[^/]+$/.test(pathname)) return true;
  return false;
}

export default function AppShellWrapper({ children }) {
  const pathname = usePathname();

  if (AUTH_PATHS.includes(pathname)) {
    return <AuthGate mode="auth">{children}</AuthGate>;
  }

  if (isProtectedPath(pathname)) {
    return (
      <AuthGate mode="protected">
        <AppShell>{children}</AppShell>
      </AuthGate>
    );
  }

  return children;
}

