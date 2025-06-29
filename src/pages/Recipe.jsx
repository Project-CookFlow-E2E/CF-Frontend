import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RecipeIngredientsChecklist, Button } from "../components";
import TimerBadge from "../components/TimerBadge";
import { recipeService } from "../services/recipeService";
import { ingredientService } from "../services/ingredientService";
import { unitService } from "../services/unitService";
import { shoppingListItemService } from "../services/shoppingListItemService";
import SuccessMsg from "../components/SuccessMsg";
import ErrorMsg from "../components/ErrorMsg";
import { TiShoppingCart } from "react-icons/ti";
const mediaUrl = import.meta.env.VITE_MEDIA_URL;

/**
 * Componente de pantalla de receta.
 * Muestra la información de una receta según el ID en la URL.
 * @modified by Ana Castro
 * @modified añadir ingrendientes a la base de datos de la lista de compra
 * @modified Ángel Áragón - Añadido manejo de errores y mensajes de éxito,
 */

const Recipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pasosRef = useRef(null);

  const [receta, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      setCheckedItems({});

      try {
        const rawRecipeData = await recipeService.getRecipeById(Number(id));

        if (!rawRecipeData) {
          throw new Error(
            "Receta no encontrada o datos vacíos después de la llamada al servicio."
          );
        }

        const ingredientsWithDetailsPromises = rawRecipeData.ingredients.map(
          async (ing) => {
            try {
              const ingredientDetail =
                await ingredientService.getIngredientById(ing.ingredient);
              const unitDetail = await unitService.getUnitById(ing.unit);

              if (!ingredientDetail || !unitDetail) {
                console.warn(
                  `Advertencia: Detalle de ingrediente ${ing.ingredient} o unidad ${ing.unit} no encontrado.`
                );
                return {
                  id: ing.id,
                  name: `Ingrediente desconocido (ID: ${ing.ingredient})`,
                  quantity: ing.quantity,
                  unit: `Unidad desconocida (ID: ${ing.unit})`,
                };
              }

              return {
                id: ing.id,
                ingredientId: ing.ingredient,
                name: ingredientDetail.name,
                quantity: ing.quantity,
                unitId: ing.unit,
                unit: unitDetail.name,
              };
            } catch (innerErr) {
              console.error(
                `Error al obtener detalles para ingrediente ID ${ing.ingredient} o unidad ID ${ing.unit}:`,
                innerErr
              );
              setError(
                "Error al cargar los detalles de los ingredientes. Por favor, inténtalo de nuevo."
              );
              return {
                id: ing.id,
                name: `ERROR: Ingrediente (${ing.ingredient})`,
                quantity: ing.quantity,
                unit: `ERROR: Unidad (${ing.unit})`,
              };
            }
          }
        );

        const ingredientsWithDetails = await Promise.all(
          ingredientsWithDetailsPromises
        );

        setRecipe({
          id: rawRecipeData.id,
          titulo: rawRecipeData.name,
          tiempo: rawRecipeData.duration_minutes,
          imagen: rawRecipeData.image
            ? mediaUrl + rawRecipeData.user.id + "/" + rawRecipeData.image.url
            : "https://placehold.co/800?text=Placeholder+Image&font=playfair-display",
          ingredientes: ingredientsWithDetails,
          pasos: rawRecipeData.steps || [],
          userId: rawRecipeData.user.id,
        });
      } catch (err) {
        console.error("Error FATAL al cargar la receta completa:", err);
        setError("No se pudo cargar la receta. Por favor, inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const handleToggleCheck = (ingredientId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [ingredientId]: !prev[ingredientId],
    }));
  };

  const areAllChecked =
    receta && receta.ingredientes.every((item) => checkedItems[item.id]);
  const hasIngredientes = receta && receta.ingredientes.length > 0;

  const handleStartCooking = () => {
    if (pasosRef.current) {
      pasosRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAddToShoppingList = async () => {
    if (!receta || !receta.ingredientes) return;

    const noSeleccionados = receta.ingredientes.filter(
      (item) => !checkedItems[item.id]
    );

    try {
      await Promise.all(
        noSeleccionados.map((item) =>
          shoppingListItemService.createShoppingListItem({
            ingredient_id: item.ingredientId,
            unit: item.unitId, // <-- no el string "g", sino el ID // Este debe ser el ID real del ingrediente
            quantity_needed: item.quantity || 1,
            is_purchased: false,
          })
        )
      );
      if (noSeleccionados.length === 0) {
        setSuccess("Todos los ingredientes ya están en tu lista de compra.");
      } else {
        setSuccess(
          <>
            {noSeleccionados.length} ingredientes añadidos a tu lista de compra.{" "}
            <TiShoppingCart className="inline-block ml-2" />
          </>
        );
      }
    } catch (error) {
      console.error("Error al guardar en la DB ❌", error);
      setError("No se pudo guardar la lista de compra. Inténtalo de nuevo.");
    }
  };

  if (loading) {
    return (
      <div data-testid="loading-recipe" className="text-center p-6">
        Cargando receta...
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="recipe-error" className="text-center p-6 text-red-500">
        {error}
      </div>
    );
  }

  if (!receta) {
    return (
      <div data-testid="no-recipe-found" className="text-center p-6">
        Receta no encontrada
      </div>
    );
  }

  return (
    <div
      data-testid="recipe-screen"
      className="flex flex-col min-h-screen bg-background text-center"
    >
      <main className="flex-grow p-6 max-w-4xl mx-auto pb-32">
        <div className="flex items-center justify-between mb-4">
          <div
            data-testid="recipe-title-container"
            className="text-center flex-1"
          >
            {error && (
              <ErrorMsg data-testid="recipe-error-msg">{error}</ErrorMsg>
            )}
            {success && (
              <SuccessMsg data-testid="recipe-success-msg" className="">
                {success}
              </SuccessMsg>
            )}
            <h1 data-testid="recipe-title" className="text-3xl font-bold">
              {receta.titulo}
            </h1>
            <TimerBadge
              data-testid="recipe-time"
              minutes={receta.tiempo}
              className="mt-2 flex justify-center"
            />
          </div>
        </div>

        <img
          data-testid="recipe-image"
          src={receta.imagen}
          alt={receta.titulo}
          className="rounded-xl drop-shadow-xl w-full max-w-md mx-auto"
        />

        <RecipeIngredientsChecklist
          data-testid="ingredients-checklist"
          ingredients={receta.ingredientes}
          checkedItems={checkedItems}
          onToggleCheck={handleToggleCheck}
        />

        <div className="grid grid-cols-2 gap-3 mt-6 max-w-md mx-auto">
          <Button
            data-testid="btn-add-to-shopping-list"
            onClick={handleAddToShoppingList}
            disabled={!hasIngredientes}
            className={`py-3 rounded-lg font-medium transition duration-300 ${
              hasIngredientes
                ? "bg-accent text-white hover:bg-accent/90"
                : "bg-background !text-accent border-2 border-accent cursor-not-allowed"
            }`}
          >
            ¡A comprar!
          </Button>
          <Button
            data-testid="btn-start-cooking"
            onClick={handleStartCooking}
            disabled={!areAllChecked}
            className={`py-3 rounded-lg font-medium transition duration-300 ${
              areAllChecked
                ? "bg-accent text-white hover:bg-accent/90"
                : "bg-background !text-accent border-2 border-accent cursor-not-allowed"
            }`}
          >
            ¡A cocinar!
          </Button>
        </div>

        <div data-testid="steps-section" ref={pasosRef} className="mt-16">
          <h2
            data-testid="steps-title"
            className="text-2xl font-semibold mb-6 text-center"
          >
            Pasos de la receta
          </h2>
          <ol className="space-y-12">
            {receta.pasos.map((paso, index) => (
              <li
                key={index}
                data-testid={`step-${index + 1}`}
                className="flex flex-col items-center bg-background rounded-xl shadow-md p-6 max-w-2xl mx-auto"
              >
                <span
                  data-testid={`step-number-${index + 1}`}
                  className="text-xl font-bold text-black mb-4"
                >
                  Paso {index + 1}
                </span>
                {paso.image && paso.image.url && (
                  <img
                    data-testid={`step-image-${index + 1}`}
                    src={mediaUrl + receta.userId + "/" + paso.image.url}
                    alt={`Paso ${index + 1}`}
                    className="w-full max-w-md h-52 object-cover rounded-lg shadow-lg mb-4"
                  />
                )}
                <p
                  data-testid={`step-desc-${index + 1}`}
                  className="text-gray-700 text-center text-base sm:text-lg font-medium"
                >
                  {paso.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
};

export default Recipe;
