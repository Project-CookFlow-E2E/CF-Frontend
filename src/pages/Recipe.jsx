import RecipeIngredientsChecklist from '../components/RecipeIngredientsChecklist';
import React from 'react'
import { Boton } from '../components/index'

const Recipe = () => {
  const receta = {
    id: 1,
    titulo: "Pan de plátano",
    tiempo: 20,
    imagen: "/pasta.jpg",
    ingredientes: [
      { id: 1, nombre: "Plátano", cantidad: 300, unidad: "g" },
      { id: 2, nombre: "Huevos", cantidad: 100, unidad: "g" },
      { id: 3, nombre: "Mantequilla derretida", cantidad: 80, unidad: "g" },
      { id: 4, nombre: "Azúcar moreno", cantidad: 100, unidad: "g" },
    ],
    ingredientesDisponibles: [1, 2, 4],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">{receta.titulo}</h1>
        <p className="text-gray-500 mb-4">⏱️ {receta.tiempo} min</p>
        <img src={receta.imagen} alt={receta.titulo} className="rounded-xl mb-6" />

        <h2 className="text-xl font-semibold">Ingredientes</h2>
        <ul className="space-y-2 mt-2">
          {receta.ingredientes.map((item) => (
            <li key={item.id}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={receta.ingredientesDisponibles.includes(item.id)}
                  readOnly
                />
                {item.nombre} - {item.cantidad} {item.unidad}
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex gap-4">
         <Boton
          className="border text-[color:var(--color-accent)] border-[color:var(--color-accent)] bg-transparent hover:bg-[color:var(--color-accent)/0.1]"
>
          ¡A comprar!
          </Boton>



          <Boton>
            ¡A cocinar!
          </Boton>
        </div>
      </main>
    </div>
  );
};

export default Recipe;
