import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, it, expect, vi, beforeEach} from "vitest";

import Input from "../Input";

vi.mock('react-icons/md', () => ({
    MdError: vi.fn((props) => {
        return <span data-testid="mock-error-icon" data-size={props.size} className={props.className} />
    })
}));

const MockLeftIcon = vi.fn((props) => (
    <svg {...props} className={props.className} />
));

describe("Input Component", () => {
    const defaultProps = {
        type: "text",
        onChange: vi.fn(),
        placeholder: "Introduce texto aquí",
        value: "valor inicial",
        icon: MockLeftIcon
    };

    beforeEach(() => {
        vi.clearAllMocks();
        MockLeftIcon.mockClear();
    });

    it("Renders the input element with correct basic props", () => {
        render(<Input {...defaultProps} />);
        const inputElement = screen.getByPlaceholderText(defaultProps.placeholder);

        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveAttribute("type", defaultProps.type);
        expect(inputElement).toHaveValue(defaultProps.value);
        expect(inputElement).toHaveClass("outline-none", "w-full", "bg-transparent");
    });

    it("Calls onChange handler when input value changes", async () => {
        render(<Input {...defaultProps} />);
        const inputElement = screen.getByPlaceholderText(defaultProps.placeholder);
        const newValue = "Texto introducido";
        await userEvent.type(inputElement, newValue);

        expect(defaultProps.onChange).toHaveBeenCalledTimes(newValue.length);
        expect(defaultProps.onChange).toHaveBeenCalledWith(expect.any(Object));

    })

    //Prop tests
    it("Applies the name attribute when provided", () => {
        const testName = "testTextField";
        render(<Input {...defaultProps} name={testName} />);
        const inputElement = screen.getByPlaceholderText(defaultProps.placeholder);

        expect(inputElement).toHaveAttribute("name", testName);
    })

    it("Does not apply the name attribute whe not provided", () => {
        render(<Input {...defaultProps} name={undefined} />);
        const inputElement = screen.getByPlaceholderText(defaultProps.placeholder);

        expect(inputElement).not.toHaveAttribute("name");
    });

    it("Renders the provided for icon component", () => {
        render(<Input {...defaultProps} iconTestId="mock-left-icon" />);
        const iconElement = screen.getByTestId("mock-left-icon");

        expect(iconElement).toBeInTheDocument();
        expect(iconElement).toHaveClass("mr-3", "text-black", "w-5", "h-5");
        expect(MockLeftIcon).toHaveBeenCalledTimes(1);
    });

    it("Does not render an icon when the icon prop is not provided", () => {
        render(<Input {...defaultProps} icon={undefined} />);
        
        expect(screen.queryByTestId("mock-left-icon")).not.toBeInTheDocument();
        expect(MockLeftIcon).not.toHaveBeenCalled();
    });

    it("Displays the error message when error prop is provided", () => {
        const errorMessage = "Este campo es obligatorio.";
        render(<Input {...defaultProps} error={errorMessage} />);
        const errorSpan = screen.getByTestId("input-error");

        expect(errorSpan).toBeInTheDocument();
        expect(errorSpan).toHaveTextContent(errorMessage);
        expect(errorSpan).toHaveClass("text-xs", "text-red-500", "mt-1");
    });

    it("Renders the MdError icon next to the error message when error is provided", () => {
        const errorMessage = "Entrada inválida"
        render(<Input {...defaultProps} error={errorMessage} />);

        expect(screen.getByTestId("mock-error-icon")).toBeInTheDocument();
        expect(screen.getByTestId("mock-error-icon")).toHaveAttribute("data-size", "16");
        expect(screen.getByTestId("mock-error-icon")).toHaveClass("inline-block", "mr-1", "mb-1");
    });

    it("Does not display the error message or icon when error prop is not provided", () => {
        render(<Input {...defaultProps} error={undefined} />);

        expect(screen.queryByTestId('input-error')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-error-icon')).not.toBeInTheDocument();
    });

    it("Spreads additional props onto the input element", () => {
        render(<Input {...defaultProps} disabled readOnly data-custom-attr="test-value" />);
        const inputElement = screen.getByPlaceholderText(defaultProps.placeholder);

        expect(inputElement).toBeDisabled();
        expect(inputElement).toHaveAttribute("readOnly");
        expect(inputElement).toHaveAttribute("data-custom-attr", "test-value");
    })
});