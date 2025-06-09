import CheckedLineItem from './CheckedLineItem'; // el componente que ya extrajimos

/**
 * Componente que muestra una lista de ingredientes con casillas de verificación (checkboxes).
 *
 * 👉 Este componente es utilizado dentro de la página `Recipe.jsx` para permitir al usuario
 * marcar los ingredientes que ya tiene o ha añadido a su cesta antes de comenzar a cocinar.
 *
 * Usa el componente `CheckedLineItem` para renderizar cada ítem de la lista.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {Array<Object>} props.ingredients - Lista de ingredientes a mostrar. Cada uno debe tener { id, name, quantity, unit }.
 * @param {Object} props.checkedItems - Objeto con los IDs de ingredientes marcados como claves y booleanos como valores.
 * @param {Function} props.onToggleCheck - Función que se ejecuta al marcar o desmarcar un ingrediente. Recibe el `id` como argumento.
 * @returns {JSX.Element} Una lista interactiva de ingredientes con checkbox.
 */
export default function RecipeIngredientsChecklist({ ingredients = [], checkedItems, onToggleCheck }) {
  return (
    <div className="bg-transparent p-4 rounded-lg" data-testid="ingredients-checklist">
      <h2 className="text-xl font-bold mb-4" data-testid="ingredients-title">Ingredientes</h2>

      <ul className="space-y-3" data-testid="ingredients-list">
        {ingredients.map((ingredient) => (
          <CheckedLineItem
            key={ingredient.id}
            name={ingredient.name}
            quantity={ingredient.quantity}
            unit={ingredient.unit}
            checked={checkedItems[ingredient.id] || false}
            onChange={() => onToggleCheck(ingredient.id)}
            data-testid={`ingredient-item-${ingredient.id}`}  // pass down to CheckedLineItem if it accepts this prop
          />
        ))}
      </ul>
    </div>
  );
}
