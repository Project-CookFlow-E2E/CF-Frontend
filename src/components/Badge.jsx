import React from "react";

const Badge = ({ children, className = "", ...props }) => {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" {...props} />
            <span
                className={`px-4 py-2 rounded-full bg-white text-black transition peer-checked:ring-1 peer-checked:ring-accent peer-checked:bg-accent peer-checked:text-white ${className}`}
            >
                {children}
            </span>
        </label>
    );
};

export default Badge;
