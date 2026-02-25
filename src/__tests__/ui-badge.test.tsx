import { render, screen } from "@testing-library/react";
import { Badge } from "@/app/components/ui/Badge";

describe("Badge", () => {
  it("renders text content", () => {
    render(<Badge>demo</Badge>);
    expect(screen.getByText("demo")).toBeInTheDocument();
  });

  it("applies tone styles (sun)", () => {
    render(<Badge tone="sun">sun</Badge>);
    expect(screen.getByText("sun")).toHaveClass("bg-[var(--sun)]");
  });

  it("applies tone styles (teal)", () => {
    render(<Badge tone="teal">teal</Badge>);
    expect(screen.getByText("teal")).toHaveClass("bg-[var(--teal)]/15");
  });

  it("defaults to neutral tone", () => {
    render(<Badge>neutral</Badge>);
    expect(screen.getByText("neutral")).toHaveClass("bg-neutral-100");
  });
});