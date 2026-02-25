export const queryKeys = {
  cohorts: {
    all: () => ["cohorts"] as const,
    detail: (id: string) => ["cohorts", id] as const,
  },
  students: {
    all: () => ["students"] as const,
    detail: (id: string) => ["students", id] as const,
  },
  dashboard: {
    main: () => ["dashboard"] as const,
  },
};