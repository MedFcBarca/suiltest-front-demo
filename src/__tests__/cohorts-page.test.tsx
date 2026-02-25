import { render, screen } from "@testing-library/react";
import CohortsPage from "@/app/console/cohorts/page";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

const mockUseCohorts = jest.fn();

jest.mock("@/features/cohorts/queries", () => ({
  useCohorts: () => mockUseCohorts(),
}));

describe("CohortsPage", () => {
  beforeEach(() => {
    mockUseCohorts.mockReset();
  });

  it("shows loading skeletons", () => {
    mockUseCohorts.mockReturnValue({ isLoading: true });

    render(<CohortsPage />);

    // Texte visible dans l'état loading ? Non, donc on check plutôt l'existence du layout
    // On sait qu'il y a "Cohorts" seulement dans l'état loaded
    expect(screen.queryByText("Cohorts")).not.toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUseCohorts.mockReturnValue({
      isLoading: false,
      isError: true,
      refetch: jest.fn(),
    });

    render(<CohortsPage />);

    expect(screen.getByText("Impossible de charger les cohortes")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("shows empty state when no cohorts", () => {
    mockUseCohorts.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
    });

    render(<CohortsPage />);
    expect(screen.getByText("No cohorts found.")).toBeInTheDocument();
  });

  it("renders cohort cards", () => {
    mockUseCohorts.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        { id: "mba-2026", name: "MBA 2026", size: 84, completion: 71, avgScore: 63 },
      ],
    });

    render(<CohortsPage />);

    expect(screen.getByText("MBA 2026")).toBeInTheDocument();
    expect(screen.getByText("84 learners")).toBeInTheDocument();
    expect(screen.getByText("63")).toBeInTheDocument();
  });
});