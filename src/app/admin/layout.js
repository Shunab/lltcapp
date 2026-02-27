"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAdminSession, adminLogout } from "../../lib/adminAuth";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState(null);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    getAdminSession().then((session) => {
      setAdmin(session);
      setReady(true);
    });
  }, [pathname]);

  useEffect(() => {
    if (!ready) return;
    if (isLoginPage) return;
    if (!admin) {
      router.replace("/admin/login");
      return;
    }
  }, [ready, admin, isLoginPage, router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  if (isLoginPage) {
    return (
      <div className="min-h-dvh bg-background">
        {children}
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border-subtle bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/admin/dashboard"
            className="text-lg font-semibold text-text"
          >
            Admin
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-card-elevated hover:text-text"
            >
              App
            </Link>
            <button
              type="button"
              onClick={() => {
                adminLogout();
                router.replace("/admin/login");
              }}
              className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-card-elevated hover:text-text"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
