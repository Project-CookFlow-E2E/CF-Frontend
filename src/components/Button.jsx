/**
 * Button component
 * Renders a customizable button element.
 *
 * @author Sergio
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display inside the button
 * @param {function} props.onClick - Function to handle button click event
 * @param {string} [props.type="button"] - Button type attribute
 * @param {string} [props.className=""] - Optional additional class names
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @returns {JSX.Element} The rendered button component
 */
const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid="custom-button"
      className={`px-4 py-2 rounded-xl font-medium transition-colors duration-300 bg-accent text-white hover:bg-rose-600${className ? ` ${className}` : ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
