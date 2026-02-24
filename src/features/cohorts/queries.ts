import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const CohortSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  completion: z.number(),
  avgScore: z.number(),
});
const CohortsResponse = z.object({ items: z.array(CohortSchema) });

export type Cohort = z.infer<typeof CohortSchema>;

async function getJson(path: string) {
  const r = await fetch(path);
  if (!r.ok) throw new Error("API error");
  return r.json();
}

export function useCohorts() {
  return useQuery({
    queryKey: ["cohorts"],
    queryFn: async () => CohortsResponse.parse(await getJson("/api/cohorts")).items,
  });
}