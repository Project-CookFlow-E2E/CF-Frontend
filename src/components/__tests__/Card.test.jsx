import { render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Card from "../Card";

vi.mock("../TimerBadge", () => ({
    default: vi.fn(({ minutes, color }) => (
        <div data-testid="mock-timer-badge" data-minutes={minutes} data-color={color}>
            {minutes}
        </div>   
    )),
}));

vi.mock("../Button", () => ({
    default: vi.fn((props) => (
        <button
            data-testid="mock-button"
            type={props.type}
            onClick={props.onClick}
            disabled={props.disabled}
            aria-label={props['aria-label']}
            className={props.className}
        >
            {props.children}
        </button>
    )),
}));

vi.mock('react-icons/bs', () => ({
    BsBookmark: vi.fn(() => <span data-testid="bookmark-icon-empty" />),
    BsBookmarkFill: vi.fn(() => <span data-testid="bookmark-icon-fill" />)
}));

const defaultProps = {
    id: 1,
    image: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F2023%2F02%2F07%2F5830864-makhani-chicken-indian-butter-chicken-MotherSarah-1x1-1.jpg&q=60&c=sc&poi=auto&orient=true&h=512",
    name: "Makhani Chicken",
    category: "Indian",
    time: "335m",
    isFavorite: false,
    onClick: vi.fn(),
    onToggleFavorite: vi.fn()
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("Card Component", () => {

    // Render tests of principal content
    it("Renders all provided content correctly", () => {
        render(<Card {...defaultProps} />);

        expect(screen.getByTestId("card-title")).toHaveTextContent(defaultProps.name);
        expect(screen.getByTestId("card-category")).toHaveTextContent(`${defaultProps.category}`);
        expect(screen.getByTestId("mock-timer-badge")).toHaveAttribute("data-minutes", defaultProps.time);
        expect(screen.getByTestId("mock-timer-badge")).toHaveTextContent(`${defaultProps.time}`);

        const imageElement = screen.getByRole("img", { name: defaultProps.name });
        expect(imageElement).toBeInTheDocument();
        expect(imageElement).toHaveAttribute("src", defaultProps.image);
    });

    it('Displays "No image" text when no image is provided', () => {
        render(<Card {...defaultProps} image={null} />);

        expect(screen.getByText("No image")).toBeInTheDocument();
        expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("Applies custom className to the main card div", () => {
        const customClass = "extra-card-style";
        render(<Card {...defaultProps} className={customClass} />);

        const mainCardDiv = screen.getByTestId("main-card-container");
        expect(mainCardDiv).toHaveClass(customClass);
         expect(mainCardDiv).toHaveClass('cursor-pointer', 'w-64', 'rounded-lg', 'overflow-hidden', 'shadow-md', 'hover:shadow-lg', 'transition-shadow', 'duration-300');
    });

    it("Applies custom imageClassName to the image container div", () => {
        const customImageClass = "custom-image-bg";
        render(<Card {...defaultProps} imageClassName={customImageClass} />);

        const imageContainerDiv = screen.getByTestId("card-image");
        expect(imageContainerDiv).toHaveClass(customImageClass);
        expect(imageContainerDiv).toHaveClass('relative', 'h-40', 'bg-gray-200', 'flex', 'items-center', 'justify-center');
    });

    it("Renders children content if provided", () => {
        render(<Card {...defaultProps}><div>Extra content</div></Card>);

        expect(screen.getByText("Extra content")).toBeInTheDocument();
    });

    // Favorite button handling tests
    it("Renders fill bookmark icon when isFavorite is true", () => {
        render(<Card {...defaultProps} isFavorite={true} />);

        expect(screen.getByTestId("bookmark-icon-fill")).toBeInTheDocument();
        expect(screen.queryByTestId("bookmark-icon-empty")).not.toBeInTheDocument();
    });

    it("Renders empty bookmark icon when isFavorite is false", () => {
        render(<Card {...defaultProps} isFavorite={false} />);

        expect(screen.queryByTestId("bookmark-icon-empty")).toBeInTheDocument();
        expect(screen.queryByTestId("bookmark-icon-fill")).not.toBeInTheDocument();
    });

    it("Calls onToggleFavorite with the correct id when favorite button is clicked", async () => {
        render(<Card {...defaultProps} />);
        const favoriteButtonMock = screen.getByTestId("mock-button");
        await userEvent.click(favoriteButtonMock);
        
        expect(defaultProps.onToggleFavorite).toHaveBeenCalledTimes(1);
        expect(defaultProps.onToggleFavorite).toHaveBeenCalledWith(defaultProps.id);
    });

    it("Updates aria-label of favorite button based on isFavorite state", () => {
        const { rerender } = render(<Card {...defaultProps} isFavorite={false} />);
        const favoriteButton = screen.getByTestId("mock-button");

        expect(favoriteButton).toHaveAttribute("aria-label", "Agregar a Favoritos");

        rerender(<Card {...defaultProps} isFavorite={true} />);
        expect(favoriteButton).toHaveAttribute("aria-label", "Quitar de Favoritos");
    });

    it("Not renders favorite button if onToggleFavorite is not provided", () => {
        render(<Card {...defaultProps} onToggleFavorite={undefined} />);
        expect(screen.queryByTestId("mock-button")).not.toBeInTheDocument();
    });

    // Click handling tests of complete card
    it("Calls onClick handler when the main card div is clicked", async () => {
        render(<Card {...defaultProps} />);
        const mainCardDiv = screen.getByTestId("card-title").closest("div").closest("div");
        await userEvent.click(mainCardDiv);

        expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it("Prevents onClick propagation when favorite button is clicked", async () => {
        const mockCardClick = vi.fn();
        const mockToggleFavorite = vi.fn();

        render(<Card {...defaultProps} onClick={mockCardClick} onToggleFavorite={mockToggleFavorite}/>);
        const favoriteButtonMock = screen.getByTestId("mock-button");
        await userEvent.click(favoriteButtonMock);

        expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
        expect(mockCardClick).not.toHaveBeenCalled();
    });

    // Default values tests
    it("Displays default name 'Swamp Soup' when name prop is not provided", () => {
        render(<Card {...defaultProps} name={undefined} />);

        expect(screen.getByTestId("card-title")).toHaveTextContent("Swamp Soup");
    });

    it("Displays default category 'LUNCH' when category prop is not provided", () => {
        render(<Card {...defaultProps} category={undefined} />);

        expect(screen.getByTestId("card-category")).toHaveTextContent("LUNCH");
    });
});