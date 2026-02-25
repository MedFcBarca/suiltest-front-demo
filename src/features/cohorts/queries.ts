import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";

const CohortSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  completion: z.number(),
  avgScore: z.number(),
});

const CohortsResponse = z.object({
  items: z.array(CohortSchema),
});

export type Cohort = z.infer<typeof CohortSchema>;

export function useCohorts() {
  return useQuery({
    queryKey: queryKeys.cohorts.all(),
    queryFn: async () => {
      const data = await apiGet("/api/cohorts", CohortsResponse);
      return data.items;
    },
  });
}