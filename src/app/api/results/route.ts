import { NextResponse } from "next/server";
import { db, Student } from "@/app/api/_db";

export async function POST(req: Request) {
  const body = await req.json();

  
  const name = String(body?.name ?? "Demo Student");
  const cohortId = String(body?.cohortId ?? "mba-2026");

  const score = Number(body?.score ?? 0);
  const completion = Number(body?.completion ?? 100);
  const themes = body?.themes;

  const demoId = "demo";

  const existing = db.students.find((s) => s.id === demoId);

  const next: Student = {
    id: demoId,
    name,
    cohortId,
    completion: Math.max(0, Math.min(100, completion)),
    score: Math.max(0, Math.min(100, score)),
    themes: themes ?? {
      earthSystem: 0,
      humanWelfare: 0,
      transitions: 0,
    },
  };

  if (existing) {
    Object.assign(existing, next);
  } else {
    db.students.unshift(next);
  }

  return NextResponse.json({ ok: true, student: next });
}