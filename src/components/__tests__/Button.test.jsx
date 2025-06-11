import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import Button from "../Button";

describe('Button Component', () => {
    it('render children content', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("call onClick handler when clicked", async () => {
        const handleClick = vi.fn();
        render(<Button  onClick={handleClick}>Click me</Button>);

        const buttonElement = screen.getByText("Click me");
        await userEvent.click(buttonElement);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});