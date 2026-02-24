import Link from "next/link";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";

export default function TaskWelcomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 grid gap-4">
      <Card className="p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-neutral-600">TASK™ demo</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--ink)]">
              Sustainability knowledge check
            </h1>
          </div>
          <Badge tone="sun">6 questions</Badge>
        </div>

        <p className="mt-4 text-sm text-neutral-700 leading-relaxed">
          This is a lightweight demo assessment inspired by TASK. You’ll answer 6 multiple-choice
          questions across 3 themes. At the end, you’ll get an overall score and a breakdown by theme.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/task/run">
            <Button>Start assessment</Button>
          </Link>
          <Link href="/console/dashboard">
            <Button variant="secondary">Back to console</Button>
          </Link>
        </div>

        <div className="mt-6 rounded-3xl border border-[var(--line)] bg-white p-5">
          <div className="text-sm font-semibold text-[var(--ink)]">What this proves (frontend)</div>
          <ul className="mt-2 text-sm text-neutral-700 list-disc pl-5 space-y-1">
            <li>Polished interaction (progress, navigation, results)</li>
            <li>Data-driven UI + theme breakdown</li>
            <li>Reusable components (Card/Badge/Progress)</li>
          </ul>
        </div>
      </Card>
    </main>
  );
}