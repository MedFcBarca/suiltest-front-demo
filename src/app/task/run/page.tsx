"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { Progress } from "@/app/components/ui/Progress";
import { TASK_QUESTIONS, THEME_LABEL, ThemeKey } from "@/features/task/questions";

type AnswerMap = Record<string, "a" | "b" | "c" | "d" | undefined>;

export default function TaskRunPage() {
  const router = useRouter();
  const [i, setI] = React.useState(0);
  const [answers, setAnswers] = React.useState<AnswerMap>({});

  const q = TASK_QUESTIONS[i];
  const total = TASK_QUESTIONS.length;
  const pct = Math.round(((i + 1) / total) * 100);

  function choose(choice: "a" | "b" | "c" | "d") {
    setAnswers((prev) => ({ ...prev, [q.id]: choice }));
  }

  function next() {
    if (i < total - 1) setI((x) => x + 1);
  }

  function back() {
    if (i > 0) setI((x) => x - 1);
  }

  function finish() {
    let correct = 0;
    const byTheme: Record<ThemeKey, { correct: number; total: number }> = {
      earthSystem: { correct: 0, total: 0 },
      humanWelfare: { correct: 0, total: 0 },
      transitions: { correct: 0, total: 0 },
    };

    for (const qq of TASK_QUESTIONS) {
      const a = answers[qq.id];
      byTheme[qq.theme].total += 1;
      if (a && a === qq.correct) {
        correct += 1;
        byTheme[qq.theme].correct += 1;
      }
    }

    const score = Math.round((correct / total) * 100);

    const themes = (Object.keys(byTheme) as ThemeKey[]).reduce((acc, k) => {
      const t = byTheme[k];
      acc[k] = Math.round((t.correct / Math.max(1, t.total)) * 100);
      return acc;
    }, {} as Record<ThemeKey, number>);

    const payload = {
      finishedAt: new Date().toISOString(),
      score,
      themes,
      answers,
    };

    sessionStorage.setItem("task:lastResult", JSON.stringify(payload));
    router.push("/task/result");
  }

  const selected = answers[q.id];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 grid gap-4">
      <Card className="p-6 card-hover">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-neutral-600">TASK™ demo</div>
            <div className="mt-1 text-lg font-semibold text-[var(--ink)]">
              Question {i + 1} / {total}
            </div>
            <div className="mt-2">
              <Badge tone="teal">{THEME_LABEL[q.theme]}</Badge>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-neutral-600">Progress</div>
            <div className="mt-1 text-sm font-semibold text-[var(--ink)]">{pct}%</div>
          </div>
        </div>

        <div className="mt-4">
          <Progress value={pct} barClassName="bg-[var(--sun)]" />
        </div>

        <div className="mt-6 text-xl font-semibold text-[var(--ink)] leading-snug">
          {q.prompt}
        </div>

        <div className="mt-5 grid gap-2">
          {q.choices.map((c) => {
            const active = selected === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => choose(c.id)}
                className={[
                  "text-left rounded-3xl border border-[var(--line)] bg-white p-4 transition",
                  "hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]",
                  active ? "ring-2 ring-[var(--sun)]" : "",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold text-[var(--ink)]">
                    {c.id.toUpperCase()}. {c.label}
                  </div>
                  {active && <Badge tone="sun">Selected</Badge>}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="secondary" onClick={back} disabled={i === 0}>
            Back
          </Button>

          {i < total - 1 ? (
            <Button onClick={next} disabled={!selected}>
              Next
            </Button>
          ) : (
            <Button onClick={finish} disabled={!selected}>
              Finish
            </Button>
          )}
        </div>
      </Card>
    </main>
  );
}