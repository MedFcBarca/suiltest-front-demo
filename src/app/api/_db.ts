export type ThemeKey = "earthSystem" | "humanWelfare" | "transitions";

export type Student = {
  id: string;
  name: string;
  cohortId: string;
  completion: number;
  score: number;
  themes: Record<ThemeKey, number>;
};

const seed = Array.from({ length: 48 }).map((_, i) => {
  const cohortId = i % 3 === 0 ? "mba-2026" : i % 3 === 1 ? "l3-eco" : "msc-supply";
  return {
    id: String(i + 1),
    name: `Student ${i + 1}`,
    cohortId,
    completion: Math.round(40 + Math.random() * 60),
    score: Math.round(35 + Math.random() * 55),
    themes: {
      earthSystem: Math.round(30 + Math.random() * 70),
      humanWelfare: Math.round(30 + Math.random() * 70),
      transitions: Math.round(30 + Math.random() * 70),
    },
  } satisfies Student;
});

export const db = {
  students: seed as Student[],
};