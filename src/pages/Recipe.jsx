import RecipeIngredientsChecklist from '../components/RecipeIngredientsChecklist';

export default function Recipe() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Ingredients checklist */}
      <RecipeIngredientsChecklist />
    </div>
  );
}