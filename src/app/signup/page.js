"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, signup } from "../../lib/session";
import Button from "../components/Button";
import Input from "../components/Input";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    const n = (name || "").trim();
    const email = (emailOrPhone || "").trim();
    const pass = (password || "").trim();
    const confirm = (confirmPassword || "").trim();
    if (!email) {
      setError("Email or phone is required");
      return;
    }
    if (!pass) {
      setError("Password is required");
      return;
    }
    if (pass !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    signup({ name: n || undefined, emailOrPhone: email, password: pass }).then(
      (result) => {
        setSubmitting(false);
        if (result.error) {
          setError(result.error);
          return;
        }
        router.replace("/onboarding");
      }
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background px-4 pt-[env(safe-area-inset-top)] pb-8">
      <div className="mx-auto w-full max-w-sm flex-1 pt-12">
        <h1 className="text-2xl font-bold text-text">Create account</h1>
        <p className="mt-2 text-sm text-muted">
          Sign up to join the ladder and record matches.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-lg border border-danger/50 bg-danger-muted px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <Input
            id="name"
            label="Name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Input
            id="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
