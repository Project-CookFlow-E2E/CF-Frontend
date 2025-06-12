import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import Button from "../Button";

describe('Button Component', () => {
    it('Render children content', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("Call onClick handler when clicked", async () => {
        const handleClick = vi.fn();
        render(<Button  onClick={handleClick}>Click me</Button>);

        const buttonElement = screen.getByText("Click me");
        await userEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("Applies the correct type attribute", () => {
        render(<Button type="submit">Submit</Button>);

        const buttonElement = screen.getByText("Submit");
        expect(buttonElement).toHaveAttribute("type", "submit");
    });

    it("Renders the button as disabled when disabled prop is true", () => {
        render(<Button disabled>Disabled button</Button>);

        const buttonElement = screen.getByText("Disabled button");
        expect(buttonElement).toBeDisabled();
    });

    it("Not call onClick handler when disabled", async () => {
        const handleClick = vi.fn();
        render(<Button disabled onClick={handleClick}>Disabled button</Button>);

        const buttonElement = screen.getByText("Disabled button");
        await userEvent.click(buttonElement);
        expect(handleClick).not.toHaveBeenCalledTimes(1);
    });

    it("Applies the correct className", () => {
        render(<Button className='custom-class'>Styled button</Button>);

        const buttonElement = screen.getByText("Styled button");
        expect(buttonElement).toHaveClass('font-medium', 'transition-colors', 'duration-300', 'bg-accent', 'text-white', 'cursor-pointer', 'hover:bg-rose-600', 'px-4', 'py-2', 'rounded-xl', 'custom-class');
    });

    it("Applies the custom text and hover colors", () => {
        render(<Button textColor="text-blue-500" hoverColor="hover:bg-blue-700">Colored button</Button>);

        const buttonElement = screen.getByText("Colored button");
        expect(buttonElement).toHaveClass('text-blue-500');
        expect(buttonElement).toHaveClass('hover:bg-blue-700');
        expect(buttonElement).not.toHaveClass('text-white');
        expect(buttonElement).not.toHaveClass('hover:bg-rose-600');
    });

    it("Applies the aria-label for accessibility", () => {
        render(<Button ariaLabel='Click this button'>Accessible button</Button>);

        const buttonElement = screen.getByText("Accessible button");
        expect(buttonElement).toHaveAttribute("aria-label", "Click this button");
    });
});