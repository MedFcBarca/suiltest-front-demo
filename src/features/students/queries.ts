import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  cohortId: z.string(),
  completion: z.number(),
  score: z.number(),
  themes: z.object({
    earthSystem: z.number(),
    humanWelfare: z.number(),
    transitions: z.number(),
  }),
});
const StudentsResponse = z.object({ items: z.array(StudentSchema) });

export type Student = z.infer<typeof StudentSchema>;

async function getJson(path: string) {
  const r = await fetch(path);
  if (!r.ok) throw new Error("API error");
  return r.json();
}

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => StudentsResponse.parse(await getJson("/api/students")).items,
  });
}