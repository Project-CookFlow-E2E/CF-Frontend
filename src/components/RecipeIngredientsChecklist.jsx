import CheckedLineItem from './CheckedLineItem'; // el componente que ya extrajimos

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
