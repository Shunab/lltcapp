"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminLogin } from "../../../lib/adminAuth";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const eTrim = (email || "").trim();
    const pTrim = (password || "").trim();
    if (!eTrim) {
      setError("Email is required");
      return;
    }
    if (!pTrim) {
      setError("Password is required");
      return;
    }
    setSubmitting(true);
    adminLogin(eTrim, pTrim).then((result) => {
      setSubmitting(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.replace("/admin/dashboard");
    });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background px-4 pt-[env(safe-area-inset-top)] pb-8">
      <div className="mx-auto w-full max-w-sm flex-1 pt-12">
        <h1 className="text-2xl font-bold text-text">Admin login</h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to manage matches and accounts.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-lg border border-danger/50 bg-danger-muted px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <Input
            id="admin-email"
            label="Email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />

          <Input
            id="admin-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="text-primary hover:underline">
            Back to app
          </Link>
        </p>
      </div>
    </div>
  );
}
