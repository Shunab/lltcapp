"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, login, logout } from "../../lib/session";
import Button from "../components/Button";
import Input from "../components/Input";

export default function LoginPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getSession().then((s) => {
      if (s.sessionUserId && s.onboarded) {
        router.replace("/ladder");
        return;
      }
      setLoading(false);
    });
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const email = (emailOrPhone || "").trim();
    const pass = (password || "").trim();
    if (!email) {
      setError("Email or phone is required");
      return;
    }
    if (!pass) {
      setError("Password is required");
      return;
    }
    setSubmitting(true);
    login(email, pass).then((result) => {
      setSubmitting(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.onboarded) {
        router.replace("/ladder");
      } else {
        router.replace("/onboarding");
      }
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background px-5 pt-[env(safe-area-inset-top)] pb-8">
      <div className="mx-auto w-full max-w-sm flex-1 pt-8">
        <Link href="/" className="mb-6 inline-block">
          <Image src="/logo.png" alt="LLTC" width={80} height={80} className="h-16 w-auto object-contain" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-text">Log in</h1>
        <p className="mt-1.5 text-sm text-muted">
          Sign in to manage your ladder and matches.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-xl border border-danger/50 bg-danger-muted px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <Input
            id="emailOrPhone"
            label="Email or phone"
            type="text"
            inputMode="email"
            autoComplete="username"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="you@example.com"
          />

          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Log in"}
          </Button>
        </form>

        <div className="mt-8 space-y-3 text-center text-sm">
          <p>
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Create account
            </Link>
          </p>
          <p>
            <Link href="/" className="text-muted hover:text-text">Back to home</Link>
          </p>
          <p>
            <Button
              type="button"
              variant="ghost"
              className="w-auto"
              onClick={() => logout()}
            >
              Use different account
            </Button>
          </p>
          <p>
            <Button type="button" variant="ghost" className="w-auto">
              Forgot password?
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
