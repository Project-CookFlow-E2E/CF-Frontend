import { useState } from "react";
import { Image, Plus } from "lucide-react";
import { Input } from "../components/";

const AddRecipe = () => {
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const addStep = () => setSteps([...steps, ""]);

  return (
    <div className="min-h-screen bg-[#FFF4EA] p-4">
      <div className="max-w-md mx-auto">
        <button className="mb-4">
          <span className="text-2xl">←</span>
        </button>
        <h1 className="text-2xl font-semibold text-center mb-6">
          Añadir receta
        </h1>

        <div className="bg-white border border-[#E5E5E5] rounded-xl h-48 flex flex-col justify-center items-center mb-6">
          <Image className="w-8 h-8 text-[#E47474]" />
          <button className="mt-2 px-4 py-1 border-2 border-[#E47474] rounded-xl text-[#E47474]">
            Añadir Foto
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la receta
          </label>
          <Input
            label="Nombre de la receta"
            placeholder="Ej: Huevos rancheros, fabada ..."
          />
          <div className="flex gap-4">
            <div className="flex-0.5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>

              <Input label="Category" value="Breakfast" readOnly />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo
              </label>

              <Input label="Time" value="15 m" readOnly />
            </div>
          </div>

          <div className="items-center">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingredients
            </label>
            <div className="flex gap-3 items-center">
              {ingredients.map((_, index) => (
                <Input
                  key={index}
                  placeholder="Add an ingredient"
                  className="mb-2"
                />
              ))}
              <button
                onClick={addIngredient}
                className="border rounded-xl shrink-0 w-10 h-10 flex justify-center items-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cooking Steps
            </label>
            <div className="flex gap-3 items-center">
              {steps.map((_, index) => (
                <Input
                  key={index}
                  placeholder="Describe a cooking step.."
                  className="mb-2"
                />
              ))}
              <button
                onClick={addStep}
                className="border rounded-xl shrink-0 w-10 h-10 flex justify-center items-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button className="w-full border border-[#E47474] text-[#E47474] rounded-full py-2 mt-6">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;

