import { NextResponse } from "next/server";

const cohorts = [
  { id: "mba-2026", name: "MBA 2026", size: 84, completion: 71, avgScore: 63 },
  { id: "l3-eco", name: "L3 Eco", size: 120, completion: 58, avgScore: 56 },
  { id: "msc-supply", name: "MSc Supply Chain", size: 52, completion: 79, avgScore: 68 },
];

export async function GET() {
  return NextResponse.json({ items: cohorts });
}