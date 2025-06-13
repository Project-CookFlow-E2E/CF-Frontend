import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RecipeIngredientsChecklist, Button } from "../components";
import TimerBadge from "../components/TimerBadge";

// ========================================================================
// ✅ SECCIÓN TEMPORAL DE MOCK:
// Estas recetas son datos simulados para desarrollo sin backend.
// ❌ IMPORTANTE: Cuando se conecte con backend, esta constante debe eliminarse.
// Será reemplazada por un useEffect que obtenga datos desde una API.
// ========================================================================
const recetasOrdenadas = [
  {
    id: 1,
    titulo: "Tarta de queso",
    tiempo: 35,
    imagen: "/tarta-queso.jpeg",
    ingredientes: [
      { id: 1, name: "Queso crema", quantity: 300, unit: "g" },
      { id: 2, name: "Galletas", quantity: 150, unit: "g" },
      { id: 3, name: "Mantequilla", quantity: 100, unit: "g" },
      { id: 4, name: "Azucar", quantity: 200, unit: "g" },
      { id: 5, name: "Leche", quantity: 200, unit: "ml" },
    ],
    pasos: [
      { descripcion: "Precalentar horno", imagen: "/huevos.jpeg" },
      { descripcion: "Machacar galletas", imagen: "/harina.jpeg" },
      { descripcion: "Mezclar todo", imagen: "/mezclar-queso.jpeg" },
      { descripcion: "Hornear 40 min", imagen: "/hornear.jpeg" },
    ],
  },
  {
    id: 2,
    titulo: "Pan de plátano",
    tiempo: 20,
    imagen: "/panplatano.jpeg",
    ingredientes: [
      { id: 1, name: "Plátano", quantity: 3, unit: "ud" },
      { id: 2, name: "Huevos", quantity: 2, unit: "ud" },
      { id: 3, name: "Harina", quantity: 200, unit: "g" },
      { id: 4, name: "Azucar", quantity: 200, unit: "g" },
      { id: 5, name: "Leche", quantity: 200, unit: "ml" },
    ],
    pasos: [
      { descripcion: "Precalentar horno", imagen: "/huevos.jpeg" },
      { descripcion: "Machacar plátanos", imagen: "/harina.jpeg" },
      { descripcion: "Mezclar todo", imagen: "/mezclar-queso.jpeg" },
      { descripcion: "Hornear 40 min", imagen: "/hornear.jpeg" },
    ],
  },
];

/**
 * Componente de pantalla de receta.
 * Muestra la información de una receta según el ID en la URL.
 *
 * 🔄 En el futuro:
 * - Esta pantalla debe hacer `fetch` de una receta específica desde el backend.
 * - El orden visual de navegación puede mantenerse con un array global o con IDs previos/siguientes.
 */
const Recipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pasosRef = useRef(null);

  const currentId = parseInt(id, 10);

  // ==================================================================================
  // ✅ Esta lógica usa los mocks. Más adelante, esta búsqueda se eliminará.
  // 🔁 Será sustituida por:
  // - useEffect(() => { fetch(`/api/recipes/${id}`)... }, [id])
  // - Y estados tipo: const [receta, setReceta] = useState(null);
  // ==================================================================================
  const currentIndex = recetasOrdenadas.findIndex((r) => r.id === currentId);
  const receta = recetasOrdenadas[currentIndex];

  const [checkedItems, setCheckedItems] = useState({});

  if (!receta) {
    return (
      <div data-testid="no-recipe-found" className="text-center p-6">
        Receta no encontrada
      </div>
    );
  }

  /**
   * Marca o desmarca un ingrediente en la lista.
   * @param {number} id - ID del ingrediente.
   */
  const handleToggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const areAllChecked = receta.ingredientes.every(
    (item) => checkedItems[item.id]
  );
  const isAnyChecked = Object.values(checkedItems).some(Boolean);

  /**
   * Desplaza la vista hacia la sección de pasos.
   */
  const handleStartCooking = () => {
    if (pasosRef.current) {
      pasosRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  /**
   * Reemplaza completamente la lista de la compra en localStorage
   * con los ingredientes no seleccionados (no checkeados).
   */
  const handleAddToShoppingList = () => {
    const noSeleccionados = receta.ingredientes.filter(
      (item) => !checkedItems[item.id]
    );

    localStorage.setItem("shoppingList", JSON.stringify(noSeleccionados));

    alert(
      `${noSeleccionados.length} ingrediente(s) añadidos a la lista de la compra.`
    );
  };

  /**
   * Navega a la receta anterior según orden visual (no ID numérico).
   */
  const handleAnterior = () => {
    setCheckedItems({});
    if (currentIndex > 0) {
      const anteriorId = recetasOrdenadas[currentIndex - 1].id;
      navigate(`/recipe/${anteriorId}`);
    }
  };

  /**
   * Navega a la receta siguiente según orden visual (no ID numérico).
   */
  const handleSiguiente = () => {
    setCheckedItems({});
    if (currentIndex < recetasOrdenadas.length - 1) {
      const siguienteId = recetasOrdenadas[currentIndex + 1].id;
      navigate(`/recipe/${siguienteId}`);
    }
  };

  return (
    <div
      data-testid="recipe-screen"
      className="flex flex-col min-h-screen bg-background text-center"
    >
      <main className="flex-grow p-6 max-w-4xl mx-auto pb-32">
        {/* Navegación entre recetas */}
        <div className="flex items-center justify-between mb-4">
          <button
            data-testid="btn-anterior"
            onClick={handleAnterior}
            disabled={currentIndex === 0}
            className="text-3xl"
          >
            &lt;
          </button>
          <div
            data-testid="recipe-title-container"
            className="text-center flex-1"
          >
            <h1 data-testid="recipe-title" className="text-3xl font-bold">
              {receta.titulo}
            </h1>
            {console.log(receta.tiempo, typeof receta.tiempo)}
            <TimerBadge
              data-testid="recipe-time"
              minutes={receta.tiempo}
              className="mt-2 flex justify-center"
            />
          </div>
          <button
            data-testid="btn-siguiente"
            onClick={handleSiguiente}
            disabled={currentIndex === recetasOrdenadas.length - 1}
            className="text-3xl"
          >
            &gt;
          </button>
        </div>

        {/* Imagen de la receta */}
        <img
          data-testid="recipe-image"
          src={receta.imagen}
          alt={receta.titulo}
          className="rounded-xl drop-shadow-xl w-full max-w-md mx-auto"
        />

        {/* Lista de ingredientes con checklist */}
        <RecipeIngredientsChecklist
          data-testid="ingredients-checklist"
          ingredients={receta.ingredientes}
          checkedItems={checkedItems}
          onToggleCheck={handleToggleCheck}
        />

        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-3 mt-6 max-w-md mx-auto">
          <Button
            data-testid="btn-add-to-shopping-list"
            onClick={handleAddToShoppingList}
            disabled={!isAnyChecked}
            className={`py-3 rounded-lg font-medium transition duration-300 ${
              isAnyChecked
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

        {/* Pasos de la receta */}
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
                <img
                  data-testid={`step-image-${index + 1}`}
                  src={paso.imagen}
                  alt={`Paso ${index + 1}`}
                  className="w-full max-w-md h-52 object-cover rounded-lg shadow-lg mb-4"
                />
                <p
                  data-testid={`step-desc-${index + 1}`}
                  className="text-gray-700 text-center text-base sm:text-lg font-medium"
                >
                  {paso.descripcion}
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
