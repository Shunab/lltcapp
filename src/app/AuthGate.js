"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "../lib/session";

export default function AuthGate({ mode, children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [renderChildren, setRenderChildren] = useState(false);

  useEffect(() => {
    getSession().then((s) => {
      setReady(true);
      if (mode === "protected") {
        if (!s.sessionUserId) {
          router.replace("/login");
          setRenderChildren(false);
          return;
        }
        if (!s.onboarded) {
          router.replace("/onboarding");
          setRenderChildren(false);
          return;
        }
        setRenderChildren(true);
        return;
      }
      if (mode === "auth") {
        if (s.sessionUserId && s.onboarded) {
          router.replace("/ladder");
          setRenderChildren(false);
          return;
        }
        setRenderChildren(true);
        return;
      }
      setRenderChildren(true);
    });
  }, [mode, router]);

  if (!ready) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  if (!renderChildren) return null;

  return children;
}
