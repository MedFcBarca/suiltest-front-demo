"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";

type Role = "teacher" | "student";

function isEmail(value: string) {
  // simple & testable (Jest)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function LoginPage() {
  const [role, setRole] = useState<Role>("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emailError = useMemo(() => {
    if (!email) return null;
    if (!isEmail(email)) return "Enter a valid email address.";
    return null;
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return null;
    if (password.length < 8) return "Password must be at least 8 characters.";
    return null;
  }, [password]);

  const canSubmit = !isSubmitting && !!email && !!password && !emailError && !passwordError;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    // Front validation (fast feedback)
    if (!isEmail(email)) {
      setFormError("Please enter a valid email.");
      return;
    }
    if (password.length < 8) {
      setFormError("Your password is too short.");
      return;
    }

    setIsSubmitting(true);
    try {
      /**
       * Ici tu brancheras ton vrai auth:
       * - NextAuth / custom API / etc.
       * - idéalement via fetch + cookies httpOnly côté serveur
       *
       * Pour l’instant: demo routing
       */
      await new Promise((r) => setTimeout(r, 450));

      // demo navigation (sans next/router pour garder simple)
      window.location.href = role === "teacher" ? "/console/dashboard" : "/student";
    } catch {
      setFormError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--mint)] via-white to-white" />

      <Card className="w-full max-w-md p-7 bg-white/70 backdrop-blur border border-[var(--line)]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Sign in to continue to your workspace.
            </p>
          </div>

          <Badge tone="sun">demo</Badge>
        </header>

        {/* Role switch (polished interaction) */}
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-3xl bg-white/60 p-2 border border-[var(--line)]">
          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={[
              "h-10 rounded-2xl text-sm font-semibold transition",
              role === "teacher"
                ? "bg-white shadow-sm text-[var(--ink)]"
                : "text-neutral-600 hover:text-[var(--ink)]",
            ].join(" ")}
            aria-pressed={role === "teacher"}
          >
            Teacher
          </button>
          <button
            type="button"
            onClick={() => setRole("student")}
            className={[
              "h-10 rounded-2xl text-sm font-semibold transition",
              role === "student"
                ? "bg-white shadow-sm text-[var(--ink)]"
                : "text-neutral-600 hover:text-[var(--ink)]",
            ].join(" ")}
            aria-pressed={role === "student"}
          >
            Student
          </button>
        </div>

        <form className="mt-6 grid gap-3" onSubmit={onSubmit} noValidate>
          {/* Global error (WCAG) */}
          {formError && (
            <div
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {formError}
            </div>
          )}

          {/* Email */}
          <label className="grid gap-1">
            <span className="text-sm font-medium text-[var(--ink)]">Email</span>
            <input
              className={[
                "h-11 rounded-2xl border bg-white/70 px-4 outline-none",
                "focus:ring-2 focus:ring-[var(--ink)]",
                emailError ? "border-red-300" : "border-[var(--line)]",
              ].join(" ")}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="teacher@university.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
              required
            />
            {emailError && (
              <p id="email-error" className="text-xs text-red-600">
                {emailError}
              </p>
            )}
          </label>

          {/* Password + show/hide */}
          <label className="grid gap-1">
            <span className="text-sm font-medium text-[var(--ink)]">Password</span>

            <div
              className={[
                "h-11 rounded-2xl border bg-white/70 px-2 pl-4 flex items-center gap-2",
                passwordError ? "border-red-300" : "border-[var(--line)]",
                "focus-within:ring-2 focus-within:ring-[var(--ink)]",
              ].join(" ")}
            >
              <input
                className="h-full flex-1 bg-transparent outline-none"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "password-error" : undefined}
                required
              />

              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="h-9 px-3 rounded-2xl text-sm font-semibold text-neutral-600 hover:text-[var(--ink)] hover:bg-white/70 transition"
                aria-pressed={showPw}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>

            {passwordError && (
              <p id="password-error" className="text-xs text-red-600">
                {passwordError}
              </p>
            )}
          </label>

          {/* Remember + forgot */}
          <div className="mt-1 flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-neutral-700 select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--line)]"
              />
              Remember me
            </label>

            <Link className="text-sm text-neutral-600 hover:underline" href="/forgot-password">
              Forgot password?
            </Link>
          </div>

          <div className="mt-2 grid gap-2">
            <Button className="w-full" type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Signing in…" : `Sign in as ${role === "teacher" ? "Teacher" : "Student"}`}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => {
                // Demo fill: useful for QA + Cypress
                setEmail(role === "teacher" ? "teacher@university.org" : "student@university.org");
                setPassword("demo-demo-1234");
                setFormError(null);
              }}
              disabled={isSubmitting}
            >
              Fill demo credentials
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Link className="text-sm text-neutral-600 hover:underline" href="/">
              Back to home
            </Link>
          </div>

          {/* Small footer hint (context) */}
          <p className="mt-2 text-xs text-neutral-500 text-center">
            Optimized for accessibility & performance (WCAG-friendly UI).
          </p>
        </form>
      </Card>
    </main>
  );
}