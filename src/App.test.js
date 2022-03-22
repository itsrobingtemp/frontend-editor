import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

test("renders ", () => {
  const { container } = render(<App />);

  expect(screen.getByText(/Spara som nytt dokument/i)).toBeInTheDocument();
});

describe("<App />", () => {
  test("render document name input", () => {
    render(<App />);

    const input = screen.getByDisplayValue("Untitled");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  test("Text in input field", () => {
    render(<App />);

    const input = screen.getByDisplayValue("Untitled");
    fireEvent.change(input, { target: { value: "Hello" } });

    expect(input).toHaveValue("Hello");
  });

  test("Input value change on 'Nytt dokument' button click", () => {
    render(<App />);

    const input = screen.getByDisplayValue("Untitled");
    // fireEvent.change(input, { target: { value: "Hello" } });

    const button = screen.getByRole("button", { name: "Nytt dokument" });
    fireEvent.click(button);

    expect(input).toHaveValue("");
  });

  test("Input value stays on 'Spara dokument' button click", () => {
    render(<App />);

    const input = screen.getByDisplayValue("Untitled");

    const button = screen.getByRole("button", { name: "Spara dokument" });
    fireEvent.click(button);

    expect(input).toHaveValue("Untitled");
  });
});
