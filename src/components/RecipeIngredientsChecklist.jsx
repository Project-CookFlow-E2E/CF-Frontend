import CheckedLineItem from './CheckedLineItem'; // el componente que ya extrajimos

export default function RecipeIngredientsChecklist({ ingredients = [], checkedItems, onToggleCheck }) {
  return (
    <div className="bg-transparent p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Ingredientes</h2>

      <ul className="space-y-3">
        {ingredients.map((ingredient) => (
          <CheckedLineItem
            key={ingredient.id}
            name={ingredient.name}
            quantity={ingredient.quantity}
            unit={ingredient.unit}
            checked={checkedItems[ingredient.id] || false}
            onChange={() => onToggleCheck(ingredient.id)}
          />
        ))}
      </ul>
    </div>
  );
}
