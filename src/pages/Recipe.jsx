import React, { useEffect, useRef, useState } from 'react';
import { RecipeIngredientsChecklist } from '../components';

const recetasSimuladas = [
  {
    titulo: 'Pan de plátano',
    tiempo: 20,
    imagen: '/pasta.jpg',
    ingredientes: [
      { id: 1, name: 'Plátano', quantity: 3, unit: 'ud' },
      { id: 2, name: 'Huevos', quantity: 2, unit: 'ud' },
      { id: 3, name: 'Harina', quantity: 200, unit: 'g' },
      { id: 4, name: 'Azucar', quantity: 200, unit: 'g' },
      { id: 5, name: 'Leche', quantity: 200, unit: 'ml' },
    ],
    pasos: ['Precalentar horno', 'Machacar plátanos', 'Mezclar todo', 'Hornear 40 min']
  },
  {
    titulo: 'Tarta de queso',
    tiempo: 35,
    imagen: '/soup.jpg',
    ingredientes: [
      { id: 1, name: 'Queso crema', quantity: 300, unit: 'g' },
      { id: 2, name: 'Galletas', quantity: 150, unit: 'g' },
      { id: 3, name: 'Mantequilla', quantity: 100, unit: 'g' },
      { id: 4, name: 'Azucar', quantity: 200, unit: 'g' },
      { id: 5, name: 'Leche', quantity: 200, unit: 'ml' },
    ],
    pasos: ['Preparar base', 'Mezclar queso', 'Hornear', 'Enfriar']
  }
];

const Recipe = () => {
  const [indiceActual, setIndiceActual] = useState(0);
  const receta = recetasSimuladas[indiceActual];
  const pasosRef = useRef(null);

  const handleStartCooking = () => {
    if (pasosRef.current) {
      pasosRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAnterior = () => {
    if (indiceActual > 0) setIndiceActual(indiceActual - 1);
  };

  const handleSiguiente = () => {
    if (indiceActual < recetasSimuladas.length - 1) {
      setIndiceActual(indiceActual + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-center">
      <main className="flex-grow p-6 max-w-4xl mx-auto pb-32">

        {/* Navegación con botones */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleAnterior} disabled={indiceActual === 0} className="text-3xl">
            &lt;
          </button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold">{receta.titulo}</h1>
            <p className="text-gray-500">⏱️ {receta.tiempo} min</p>
          </div>
          <button
            onClick={handleSiguiente}
            disabled={indiceActual === recetasSimuladas.length - 1}
            className="text-3xl"
          >
            &gt;
          </button>
        </div>

        {/* Imagen */}
        <img
          src={receta.imagen}
          alt={receta.titulo}
          className="rounded-xl drop-shadow-xl w-full max-w-md mx-auto"
        />

        {/* Ingredientes */}
        <RecipeIngredientsChecklist
          ingredients={receta.ingredientes}
          onStartCooking={handleStartCooking}
        />

        {/* Pasos */}
        <div ref={pasosRef} className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Pasos de la receta</h2>
          <ol className="space-y-12">
            {receta.pasos.map((paso, index) => (
              <li
                key={index}
                className="flex flex-col items-center bg-background rounded-xl shadow-md p-6 max-w-2xl mx-auto"
              >
                <span className="text-xl font-bold text-accent mb-4">Paso {index + 1}</span>
                <img
                  src="/salad.jpg"
                  alt={`Paso ${index + 1}`}
                  className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg mb-4"
                />
                <p className="text-gray-700 text-center text-base sm:text-lg font-medium">
                  {paso}
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
