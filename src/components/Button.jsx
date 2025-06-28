// Button.jsx
import PropTypes from "prop-types";

const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  ariaLabel,
  textColor = "text-white",
  hoverColor = "hover:bg-rose-600",
  className = "px-4 py-2 rounded-xl",
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`font-medium transition-colors duration-300 bg-accent ${textColor} cursor-pointer ${hoverColor} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  'data-testid': PropTypes.string,
};
export default Button;