// import { NextResponse } from "next/server";

// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// const items = Array.from({ length: 48 }).map((_, i) => {
//   const cohortId = i % 3 === 0 ? "mba-2026" : i % 3 === 1 ? "l3-eco" : "msc-supply";
//   const score = Math.round(35 + Math.random() * 55);

//   return {
//     id: String(i + 1),
//     name: `Student ${i + 1}`,
//     cohortId,
//     completion: Math.round(40 + Math.random() * 60),
//     score,
//     themes: {
//       earthSystem: Math.round(30 + Math.random() * 70),
//       humanWelfare: Math.round(30 + Math.random() * 70),
//       transitions: Math.round(30 + Math.random() * 70),
//     },
//   };
// });

// export async function GET() {
//   await sleep(100); // 👈 délai pour voir le skeleton
//   return NextResponse.json({ items });
// }



import { NextResponse } from "next/server";
import { db } from "@/app/api/_db";

export async function GET() {
  return NextResponse.json({ items: db.students });
}