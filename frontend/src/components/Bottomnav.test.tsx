import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { BottomNav } from "./BottomNav";

const defaultProps = {
  currentScreen: "main" as const,
  onScreenChange: vi.fn(),
  mainView: "cards" as const,
  onMainViewChange: vi.fn(),
};

describe("BottomNav", () => {
  it("renders navigation buttons", () => {
    render(<BottomNav {...defaultProps} />);
    expect(screen.getByText("Main")).toBeDefined();
    expect(screen.getByText("Dictionary")).toBeDefined();
    expect(screen.getByText("Progres")).toBeDefined();
  });

  it("calls onScreenChange when Dictionary is clicked", () => {
    const onScreenChange = vi.fn();
    render(<BottomNav {...defaultProps} onScreenChange={onScreenChange} />);
    fireEvent.click(screen.getByText("Dictionary"));
    expect(onScreenChange).toHaveBeenCalledWith("dictionary");
  });

  it("shows Cards/Texts toggle only on main screen", () => {
    render(<BottomNav {...defaultProps} currentScreen="main" />);
    expect(screen.getByText("Cards")).toBeDefined();
    expect(screen.getByText("Texts")).toBeDefined();
  });
});
