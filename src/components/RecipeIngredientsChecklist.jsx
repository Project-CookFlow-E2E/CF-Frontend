// components/RecipeIngredientsChecklist.jsx
import { useState } from 'react';

export default function RecipeIngredientsChecklist() {
  // ========== BACKEND INTEGRATION SECTION START ==========
  // TODO: Replace this mock data with actual API call to fetch recipe ingredients
  // Expected API endpoint: GET /api/recipes/{recipeId}/ingredients/
  // Django REST Framework will likely return: { "ingredients": [...] }
  const mockIngredients = [
    { id: 1, name: 'All-Purpose Flour', quantity: 200, unit: 'g' },
    { id: 2, name: 'Granulated Sugar', quantity: 150, unit: 'g' },
    { id: 3, name: 'Eggs', quantity: 2, unit: 'large' },
    { id: 4, name: 'Milk', quantity: 120, unit: 'ml' },
    { id: 5, name: 'Vanilla Extract', quantity: 1, unit: 'tsp' },
    { id: 6, name: 'Baking Powder', quantity: 2, unit: 'tsp' },
  ];
  // ========== BACKEND INTEGRATION SECTION END ==========

  const [checkedItems, setCheckedItems] = useState({});
  const [ingredients] = useState(mockIngredients);
  
  const handleCheckChange = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // ========== BACKEND INTEGRATION SECTION START ==========
  const handleAddToShoppingList = () => {
    // TODO: Replace with actual API call to add selected ingredients to shopping list
    // Expected API endpoint: POST /api/shopping-list/items/
    // Django REST Framework payload: { "ingredients": [...] }
    // Note: DRF typically uses trailing slashes in URLs
    const selectedIngredients = ingredients.filter(item => checkedItems[item.id]);
    
    console.log('Adding to shopping list:', selectedIngredients);
    alert(`${selectedIngredients.length} items added to shopping list!`);
    
    // Example of what the API call should look like:
    // try {
    //   const response = await fetch('/api/shopping-list/add', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ ingredients: selectedIngredients })
    //   });
    //   if (response.ok) {
    //     // Handle success - maybe show toast notification
    //   }
    // } catch (error) {
    //   // Handle error
    // }
  };
  // ========== BACKEND INTEGRATION SECTION END ==========

  // ========== BACKEND INTEGRATION SECTION START ==========
  const handleStartCooking = () => {
    // TODO: Implement navigation to cooking mode
    // This might involve:
    // 1. API call to track cooking session start
    // 2. Navigation to cooking instructions page
    // 3. Timer functionality setup
    console.log('Starting cooking process');
    alert('Starting cooking mode!');
    
    // Example navigation (when router is set up):
    // router.push('/recipe/cooking-mode');
  };
  // ========== BACKEND INTEGRATION SECTION END ==========

  const isAnyChecked = Object.values(checkedItems).some(Boolean);

  return (
    <div className="bg-transparent p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Ingredients</h2>
      
      <ul className="space-y-3">
        {ingredients.map((ingredient) => (
          <li 
            key={ingredient.id} 
            className="flex items-center justify-between py-2 border-b border-gray-100"
          >
            <label className="flex items-center cursor-pointer w-full">
              <div className="relative mr-3">
                <input
                  type="checkbox"
                  checked={checkedItems[ingredient.id] || false}
                  onChange={() => handleCheckChange(ingredient.id)}
                  className="hidden"
                />
                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                  checkedItems[ingredient.id] 
                    ? 'bg-black border-black' 
                    : 'border-gray-700'
                }`}>
                  {checkedItems[ingredient.id] && (
                    <svg 
                      className="w-3 h-3 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="3" 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="flex-grow text-gray-800">
                {ingredient.name}
              </span>
              <span className="text-gray-500 text-sm">
                {ingredient.quantity} {ingredient.unit}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {/* Desktop Button */}
      <div className="hidden sm:block mt-6">
        <button
          onClick={handleAddToShoppingList}
          disabled={!isAnyChecked}
          className={`w-full py-3 rounded-lg font-medium transition ${
            isAnyChecked
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Add to Shopping List
        </button>
      </div>

      {/* Mobile Buttons */}
      <div className="sm:hidden grid grid-cols-2 gap-3 mt-6">
        <button
          onClick={handleAddToShoppingList}
          disabled={!isAnyChecked}
          className={`py-3 rounded-lg font-medium ${
            isAnyChecked
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Add to List
        </button>
        <button 
          onClick={handleStartCooking}
          className="py-3 rounded-lg font-medium border border-gray-300 bg-white text-gray-800"
        >
          Start Cooking
        </button>
      </div>
    </div>
  );
}