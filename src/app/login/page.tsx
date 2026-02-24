"use client";

import Link from "next/link";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--mint)] via-white to-white" />

      <Card className="w-full max-w-md p-7 bg-white/70 backdrop-blur">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Demo access (no real authentication)
            </p>
          </div>

          <Badge tone="sun">demo</Badge>
        </div>

        <form className="mt-6 grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-[var(--ink)]">Email</span>
            <input
              className="h-11 rounded-2xl border border-[var(--line)] bg-white/70 px-4 outline-none focus:ring-2 focus:ring-[var(--ink)]"
              type="email"
              placeholder="teacher@university.org"
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-[var(--ink)]">Password</span>
            <input
              className="h-11 rounded-2xl border border-[var(--line)] bg-white/70 px-4 outline-none focus:ring-2 focus:ring-[var(--ink)]"
              type="password"
              placeholder="••••••••"
              required
            />
          </label>

          <div className="mt-2 grid gap-2">
            <Link href="/console/dashboard">
              <Button className="w-full">Sign in as Teacher</Button>
            </Link>

            <Link href="/student">
              <Button variant="secondary" className="w-full">
                Sign in as Student
              </Button>
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link className="text-sm text-neutral-600 hover:underline" href="/">
              Back to home
            </Link>
          </div>
        </form>
      </Card>
    </main>
  );
}