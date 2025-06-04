import React from "react";

const Badge = ({ children, ...props }) => {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="hidden peer" {...props} />
            <span className="px-4 py-2 rounded-full bg-white text-black peer-checked:ring-1 peer-checked:ring-accent peer-checked:bg-accent peer-checked:text-white transition">
                {children}
            </span>
        </label>
    );
};

export default Badge;
