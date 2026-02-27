"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminSession } from "../../lib/adminAuth";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    getAdminSession().then((session) => {
      router.replace(session ? "/admin/dashboard" : "/admin/login");
    });
  }, [router]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <p className="text-sm text-muted">Loading...</p>
    </div>
  );
}
