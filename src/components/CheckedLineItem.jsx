// components/IngredientItem.jsx
export default function CheckedLineItem({ name, quantity, unit, checked, onChange }) {
  return (
    <li className="flex items-center justify-between py-2 border-b border-gray-100">
      <label className="flex items-center cursor-pointer w-full">
        {/* Checkbox personalizado */}
        <div className="relative mr-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="hidden"
          />
          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
            checked ? 'bg-black border-black' : 'border-gray-700'
          }`}>
            {checked && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>

        {/* Nombre + línea hasta la cantidad */}
        <div className="flex-1 flex items-center border-b border-dotted border-gray-300">
          <span className="text-gray-800">{name}</span>
        </div>

        {/* Cantidad */}
        <span className="text-sm text-gray-800 whitespace-nowrap ml-2">
          {quantity} {unit}
        </span>
      </label>
    </li>
  );
}
