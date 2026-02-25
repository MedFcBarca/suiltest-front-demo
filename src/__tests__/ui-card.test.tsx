import { render, screen } from "@testing-library/react";
import { Card } from "@/app/components/ui/Card";

describe("Card", () => {
  it("renders children", () => {
    render(
      <Card>
        <div>hello</div>
      </Card>
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("merges className with base styles", () => {
    const { container } = render(<Card className="p-6">x</Card>);
    const el = container.firstChild as HTMLElement;

    expect(el).toHaveClass("rounded-3xl");
    expect(el).toHaveClass("border");
    expect(el).toHaveClass("p-6");
  });
});