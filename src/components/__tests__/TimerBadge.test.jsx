import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import TimerBadge from '../TimerBadge';

vi.mock('react-icons/io', () => ({
    IoMdTime: vi.fn((props) => (
        <span data-testid="mock-time-icon" data-size={props.size} />
    )),
}));

describe('TimerBadge Component', () => {
    const defaultProps = {
        minutes: 30,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Content and basic render tests
    it("Renders the minutes value followed by ' min'", () => {
        render(<TimerBadge {...defaultProps} />);

        expect(screen.getByText("30 min")).toBeInTheDocument();
    });

    it("Renders the time icon", () => {
        render(<TimerBadge {...defaultProps} />);

        expect(screen.getByTestId('mock-time-icon')).toBeInTheDocument();
    });

    //Handling props tests
    it("Applies the default color class whe no color prop is provided", () => {
        render(<TimerBadge {...defaultProps} />);

        expect(screen.getByTestId("timer-badge")).toHaveClass("text-gray-700");
    });

    it("Applies the default icon size when no sizeIcon prop is provided", () => {
        render(<TimerBadge {...defaultProps} />);

        expect(screen.getByTestId("mock-time-icon")).toHaveAttribute("data-size", "18");
    });

    it("Applies a custom className to the container", () => {
        const customClass = "my-custom-badge-style";
        render(<TimerBadge {...defaultProps} className={customClass} />);

        expect(screen.getByTestId("timer-badge")).toHaveClass(customClass);
        expect(screen.getByTestId("timer-badge")).toHaveClass("flex", "items-center");
    });

    it("Applies a custom color class to the container", () => {
        const customColor = "text-red-500";
        render(<TimerBadge {...defaultProps} color={customColor} />);

        expect(screen.getByTestId("timer-badge")).toHaveClass(customColor);
        expect(screen.getByTestId("timer-badge")).not.toHaveClass("text-gray-700");
    });

    it("Applies a custom icon size", () => {
        const customSize = 24;
        render(<TimerBadge {...defaultProps} sizeIcon={customSize} />);

        expect(screen.getByTestId("mock-time-icon")).toHaveAttribute("data-size", customSize.toString());
    });
});