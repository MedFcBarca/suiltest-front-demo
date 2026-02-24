export type ThemeKey = "earthSystem" | "humanWelfare" | "transitions";

export type TaskQuestion = {
  id: string;
  theme: ThemeKey;
  prompt: string;
  choices: { id: "a" | "b" | "c" | "d"; label: string }[];
  correct: "a" | "b" | "c" | "d";
};

export const THEME_LABEL: Record<ThemeKey, string> = {
  earthSystem: "Earth system",
  humanWelfare: "Human welfare",
  transitions: "Transitions",
};

export const TASK_QUESTIONS: TaskQuestion[] = [
  {
    id: "q1",
    theme: "earthSystem",
    prompt: "Which concept describes the safe operating limits for humanity on Earth?",
    choices: [
      { id: "a", label: "Planetary boundaries" },
      { id: "b", label: "Green GDP" },
      { id: "c", label: "Trickle-down economics" },
      { id: "d", label: "Compound interest" },
    ],
    correct: "a",
  },
  {
    id: "q2",
    theme: "earthSystem",
    prompt: "Which gas is the main contributor to human-caused global warming?",
    choices: [
      { id: "a", label: "Oxygen (O₂)" },
      { id: "b", label: "Carbon dioxide (CO₂)" },
      { id: "c", label: "Nitrogen (N₂)" },
      { id: "d", label: "Helium (He)" },
    ],
    correct: "b",
  },
  {
    id: "q3",
    theme: "humanWelfare",
    prompt: "Which idea focuses on ensuring everyone’s basic needs are met within ecological limits?",
    choices: [
      { id: "a", label: "Doughnut economics" },
      { id: "b", label: "Gold standard" },
      { id: "c", label: "Perfect competition" },
      { id: "d", label: "Random walk theory" },
    ],
    correct: "a",
  },
  {
    id: "q4",
    theme: "humanWelfare",
    prompt: "Which is most closely linked to reducing inequality long-term?",
    choices: [
      { id: "a", label: "Lower literacy rates" },
      { id: "b", label: "Access to quality education" },
      { id: "c", label: "Higher inflation" },
      { id: "d", label: "More single-use plastics" },
    ],
    correct: "b",
  },
  {
    id: "q5",
    theme: "transitions",
    prompt: "What does “decarbonization” mean?",
    choices: [
      { id: "a", label: "Increasing coal consumption" },
      { id: "b", label: "Reducing CO₂ emissions from energy and industry" },
      { id: "c", label: "Switching from digital to paper records" },
      { id: "d", label: "Replacing recycling with landfilling" },
    ],
    correct: "b",
  },
  {
    id: "q6",
    theme: "transitions",
    prompt: "Which policy tool directly prices carbon emissions?",
    choices: [
      { id: "a", label: "Carbon tax" },
      { id: "b", label: "VAT (value-added tax)" },
      { id: "c", label: "Import quota" },
      { id: "d", label: "Minimum wage" },
    ],
    correct: "a",
  },
];