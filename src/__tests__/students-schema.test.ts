import { StudentsResponse } from "@/features/students/queries";

describe("StudentsResponse (Zod)", () => {
  it("accepts valid API payload", () => {
    const payload = {
      items: [
        {
          id: "s1",
          name: "Mohamed",
          cohortId: "mba-2026",
          completion: 80,
          score: 62,
          themes: { earthSystem: 10, humanWelfare: 20, transitions: 30 },
        },
      ],
    };

    expect(() => StudentsResponse.parse(payload)).not.toThrow();
  });

  it("rejects invalid API payload (wrong types)", () => {
    const payload = {
      items: [
        {
          id: "s1",
          name: "Mohamed",
          cohortId: "mba-2026",
          completion: "80",
          score: 62,
          themes: { earthSystem: 10, humanWelfare: 20, transitions: 30 },
        },
      ],
    };

    expect(() => StudentsResponse.parse(payload)).toThrow();
  });

  it("rejects missing fields", () => {
    const payload = {
      items: [
        {
          id: "s1",
          cohortId: "mba-2026",
          completion: 80,
          score: 62,
          themes: { earthSystem: 10, humanWelfare: 20, transitions: 30 },
        },
      ],
    };

    expect(() => StudentsResponse.parse(payload)).toThrow();
  });
});