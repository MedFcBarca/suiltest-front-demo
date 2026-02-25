import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStudents } from "@/features/students/queries";

function TestComp() {
  const q = useStudents();

  if (q.isLoading) return <div>loading</div>;
  if (q.isError) return <div>error</div>;

  return <div>count:{q.data?.length ?? 0}</div>;
}

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("useStudents", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("returns parsed students", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          {
            id: "s1",
            name: "A",
            cohortId: "c1",
            completion: 80,
            score: 62,
            themes: { earthSystem: 10, humanWelfare: 20, transitions: 30 },
          },
        ],
      }),
    });

    renderWithClient(<TestComp />);

    expect(screen.getByText("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("count:1")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/students");
  });

  it("handles api error (non-ok)", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "fail" }),
    });

    renderWithClient(<TestComp />);

    await waitFor(() => {
      expect(screen.getByText("error")).toBeInTheDocument();
    });
  });
});