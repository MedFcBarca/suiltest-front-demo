"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";

type Role = "teacher" | "student";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function strongEnoughPassword(value: string) {
  // simple rule: >= 10, at least 1 letter and 1 number
  const v = value.trim();
  return v.length >= 10 && /[A-Za-z]/.test(v) && /\d/.test(v);
}

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("teacher");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);

  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fullNameError = useMemo(() => {
    if (!fullName) return null;
    if (fullName.trim().length < 2) return "Please enter your full name.";
    return null;
  }, [fullName]);

  const emailError = useMemo(() => {
    if (!email) return null;
    if (!isEmail(email)) return "Enter a valid email address.";
    return null;
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return null;
    if (!strongEnoughPassword(password)) {
      return "Use 10+ chars with letters and numbers.";
    }
    return null;
  }, [password]);

  const confirmError = useMemo(() => {
    if (!confirmPassword) return null;
    if (confirmPassword !== password) return "Passwords do not match.";
    return null;
  }, [confirmPassword, password]);

  const canSubmit =
    !isSubmitting &&
    !!fullName &&
    !!email &&
    !!password &&
    !!confirmPassword &&
    acceptTerms &&
    !fullNameError &&
    !emailError &&
    !passwordError &&
    !confirmError;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (fullName.trim().length < 2) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!isEmail(email)) {
      setFormError("Please enter a valid email.");
      return;
    }
    if (!strongEnoughPassword(password)) {
      setFormError("Please choose a stronger password.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (!acceptTerms) {
      setFormError("You must accept the terms to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      /**
       * Ici tu brancheras l’API:
       * await fetch("/api/auth/register", { method:"POST", body: JSON.stringify(...) })
       *
       * Bonnes pratiques:
       * - envoyer via HTTPS
       * - côté serveur: créer user + email verification
       * - session/cookies httpOnly
       */
      await new Promise((r) => setTimeout(r, 600));

      // Demo redirect
      window.location.href = role === "teacher" ? "/console/dashboard" : "/student";
    } catch {
      setFormError("Registration failed. Please try again.");
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
              Create your account
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Join the platform and start using your workspace.
            </p>
          </div>

          <Badge tone="sun">demo</Badge>
        </header>

        {/* Role switch */}
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
          {formError && (
            <div
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {formError}
            </div>
          )}

          {/* Full name */}
          <label className="grid gap-1">
            <span className="text-sm font-medium text-[var(--ink)]">Full name</span>
            <input
              className={[
                "h-11 rounded-2xl border bg-white/70 px-4 outline-none",
                "focus:ring-2 focus:ring-[var(--ink)]",
                fullNameError ? "border-red-300" : "border-[var(--line)]",
              ].join(" ")}
              type="text"
              autoComplete="name"
              placeholder="Alex Martin"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              aria-invalid={!!fullNameError}
              aria-describedby={fullNameError ? "name-error" : undefined}
              required
            />
            {fullNameError && (
              <p id="name-error" className="text-xs text-red-600">
                {fullNameError}
              </p>
            )}
          </label>

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
              placeholder={role === "teacher" ? "teacher@university.org" : "student@school.org"}
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

          {/* Password */}
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
                autoComplete="new-password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "pw-error" : "pw-hint"}
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

            <p id="pw-hint" className="text-xs text-neutral-500">
              10+ characters, with letters and numbers.
            </p>
            {passwordError && (
              <p id="pw-error" className="text-xs text-red-600">
                {passwordError}
              </p>
            )}
          </label>

          {/* Confirm password */}
          <label className="grid gap-1">
            <span className="text-sm font-medium text-[var(--ink)]">Confirm password</span>

            <div
              className={[
                "h-11 rounded-2xl border bg-white/70 px-2 pl-4 flex items-center gap-2",
                confirmError ? "border-red-300" : "border-[var(--line)]",
                "focus-within:ring-2 focus-within:ring-[var(--ink)]",
              ].join(" ")}
            >
              <input
                className="h-full flex-1 bg-transparent outline-none"
                type={showPw2 ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={!!confirmError}
                aria-describedby={confirmError ? "pw2-error" : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw2((v) => !v)}
                className="h-9 px-3 rounded-2xl text-sm font-semibold text-neutral-600 hover:text-[var(--ink)] hover:bg-white/70 transition"
                aria-pressed={showPw2}
                aria-label={showPw2 ? "Hide password" : "Show password"}
              >
                {showPw2 ? "Hide" : "Show"}
              </button>
            </div>

            {confirmError && (
              <p id="pw2-error" className="text-xs text-red-600">
                {confirmError}
              </p>
            )}
          </label>

          {/* Terms */}
          <label className="mt-1 flex items-start gap-3 text-sm text-neutral-700 select-none">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[var(--line)]"
              aria-describedby="terms-hint"
            />
            <span id="terms-hint">
              I agree to the{" "}
              <Link className="underline hover:no-underline" href="/terms">
                Terms
              </Link>{" "}
              and{" "}
              <Link className="underline hover:no-underline" href="/privacy">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <div className="mt-2 grid gap-2">
            <Button className="w-full" type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => {
                // Demo fill (handy for Cypress)
                setFullName("Alex Martin");
                setEmail(role === "teacher" ? "teacher@university.org" : "student@school.org");
                setPassword("demo-demo-1234");
                setConfirmPassword("demo-demo-1234");
                setAcceptTerms(true);
                setFormError(null);
              }}
              disabled={isSubmitting}
            >
              Fill demo values
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{" "}
              <Link className="font-semibold text-[var(--ink)] hover:underline" href="/login">
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-2 text-xs text-neutral-500 text-center">
            Accessible form states (WCAG) • Clear errors • Loading-safe interactions.
          </p>
        </form>
      </Card>
    </main>
  );
}