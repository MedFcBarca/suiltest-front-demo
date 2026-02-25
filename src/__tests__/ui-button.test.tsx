import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/app/components/ui/Button";

describe("Button", () => {
  it("calls onClick", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole("button", { name: "Click" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports disabled state", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <Button onClick={onClick} disabled>
        Click
      </Button>
    );

    await user.click(screen.getByRole("button", { name: "Click" }));
    expect(onClick).toHaveBeenCalledTimes(0);
  });

  it("applies variant styles", () => {
    render(<Button variant="secondary">Sec</Button>);
    expect(screen.getByRole("button", { name: "Sec" })).toHaveClass("border");
  });
});