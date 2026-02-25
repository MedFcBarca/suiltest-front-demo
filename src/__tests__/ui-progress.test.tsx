import { render } from "@testing-library/react";
import { Progress } from "@/app/components/ui/Progress";

function getBar(container: HTMLElement) {
  const bars = container.querySelectorAll("div");
  return bars[1] as HTMLDivElement;
}

describe("Progress", () => {
  it("clamps value between 0 and 100", () => {
    const { container: c1 } = render(<Progress value={-10} />);
    expect(getBar(c1).style.width).toBe("0%");

    const { container: c2 } = render(<Progress value={120} />);
    expect(getBar(c2).style.width).toBe("100%");
  });

  it("sets width according to value", () => {
    const { container } = render(<Progress value={42} />);
    expect(getBar(container).style.width).toBe("42%");
  });

  it("uses barClassName when provided", () => {
    const { container } = render(<Progress value={50} barClassName="bg-red-500" />);
    const bar = getBar(container);
    expect(bar.className).toContain("bg-red-500");
  });
});