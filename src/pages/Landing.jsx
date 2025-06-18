/**
 * @file Landing.jsx
 * @description Página de bienvenida (Landing Page) para usuarios no registrados.
 * Presenta la propuesta de valor de CookFlow con una introducción visual, problemas comunes
 * relacionados con la cocina y una sección de recetas destacadas.
 *
 * Esta página actúa como punto de entrada para que los usuarios nuevos entiendan el objetivo
 * de la plataforma y se registren para empezar a usarla.
 *
 * Componentes utilizados:
 * - Button: Botón reutilizable
 * - Card: Vista individual de receta
 * - useFavorites: Hook para gestionar recetas favoritas
 * - mockRecipes: Datos simulados de recetas destacadas
 * Navegación:
 * - Los botones redirigen a la ruta `/signup` para incentivar el registro.
 *
 * @module pages/Landing
 */

import React from "react";
import { Button, Card } from "../components";
import { Link, useNavigate } from "react-router-dom";
import useLatestRecipes from "../hooks/useLatestRecipes";
import { FaGear } from "react-icons/fa6";
import useCategories from "../hooks/useCategories";

/**
 * Renderiza una receta individual dentro del carrusel de recetas destacadas.
 * Si el usuario hace clic en el icono de favorito, se le redirige al registro.
 *
 * @param {Object} props
 * @param {number} props.id - ID de la receta
 * @author Yuliia Martynovych
 * @modifiedby Ána Castro, Ángel Aragón
 * @modified - Adaptadción del componente Card.jsx para usarlo directamente mediante props.Gestion de favoritos a través del hook useFavorites.
 * - Agregado el icono de engranaje para representar la receta y arreglado tiempo en card.
 * @returns {JSX.Element} Componente de tarjeta de receta
 */

/**
 * Página principal de entrada para nuevos usuarios.
 * Contiene:
 * - Sección Hero con llamada a la acción
 * - Descripción de problemas comunes al cocinar
 * - Propuesta de solución con recetas destacadas
 *
 * @returns {JSX.Element}
 */


const Landing = () => {
  const { latestRecipes, loading } = useLatestRecipes();
  const navigate = useNavigate();
  const mediaUrl = import.meta.env.VITE_MEDIA_URL;
  const { categories } = useCategories(2);

  return (
    <div
      className="flex flex-col items-center justify-center w-full font-sans"
      data-testid="landing-page"
      id="landing-page-container"
    >
      <div
        className="w-full h-[500px] bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
        style={{ backgroundImage: "url('/landing.png')" }}
        data-testid="hero-section"
        id="hero-section"
      >
        <h1
          className="text-5xl font-serif font-bold text-black mb-4"
          data-testid="hero-title"
          id="hero-title"
        >
          CookFlow
        </h1>
        <p
          className="text-lg text-black mb-6"
          data-testid="hero-subtitle"
          id="hero-subtitle"
        >
          Redescubre el placer de cocinar
        </p>
        <Link to="/login" data-testid="hero-signup-link" id="hero-signup-link">
          <Button>Empezar →</Button>
        </Link>
      </div>

      <div
        className="bg-[#e9e6d7] w-full py-16 text-center"
        data-testid="problem-section"
        id="problem-section"
      >
        <h2
          className="text-2xl font-semibold mb-12"
          data-testid="problem-title"
          id="problem-title"
        >
          De la frustración a la diversión
        </h2>
        <div
          className="flex flex-col md:flex-row justify-center gap-6 md:gap-4 px-4"
          data-testid="problem-cards-container"
          id="problem-cards-container"
        >
          <div
            className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto"
            data-testid="problem-card-1"
            id="problem-card-1"
          >
            <div className="text-2xl mb-2 flex justify-center">
              <FaGear />
            </div>
            <h3 className="font-semibold text-lg mb-2">¿Que cocinamos hoy?</h3>
            <p className="text-gray-600 text-sm">
              Despídete del estrés diario de decidir qué comer.
              Planifica tus comidas de forma fácil, rápida y sin frustraciones
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto"
            data-testid="problem-card-2"
            id="problem-card-2"
          >
            <div className="text-2xl mb-2 flex justify-center">
              <FaGear />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              No planifiques. Solo cocina.
            </h3>
            <p className="text-gray-600 text-sm">
              Recetas que se pierden, compras a última hora y cenas caóticas.
              ¿Te suena? Te ayudamos a recuperar el control.
            </p>
          </div>
        </div>
      </div>

      <div
        className="bg-[#fdf2f2] w-full py-16 px-4 text-center"
        data-testid="solution-section"
        id="solution-section"
      >
        <h2
          className="text-2xl font-semibold mb-4"
          data-testid="solution-title"
          id="solution-title"
        >
          La solución CookFlow
        </h2>
        <p
          className="max-w-2xl mx-auto text-gray-700 mb-8 text-sm"
          data-testid="solution-description"
          id="solution-description"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-12"
          data-testid="recipe-cards-grid"
          id="recipe-cards-grid"
        >
          {loading ? (
            <p>Cargando recetas...</p>
          ) : Array.isArray(latestRecipes) && latestRecipes.length > 0 ? (
            latestRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                id={`recipe-card-${recipe.id}`}
                image={
                  recipe?.user?.id && recipe?.image?.url
                    ? mediaUrl + recipe.user.id + '/' + recipe.image.url
                    : 'https://placehold.co/800?text=Placeholder+Image&font=playfair-display'
                }
                name={recipe.name}
                category={
                    Array.isArray(recipe.categories)
                        ? recipe.categories
                                .map((cat) => {
                                    const catId = typeof cat === "object" ? cat.id : cat;
                                    const fullCat = categories.find((c) => c.id === catId);
                                    return fullCat?.name;
                                })
                                .filter(Boolean)
                        : ["Sin categoría"]
                }
                time={`${recipe.duration_minutes}`}
                onToggleFavorite={() => navigate("/login")}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              />
            ))
          ) : (
            <p>No hay recetas disponibles.</p>
          )}
        </div>
        <div
          className="pb-20"
          data-testid="signup-button-container"
          id="signup-button-container"
        >
          <Link to="/login" data-testid="signup-link" id="signup-link">
            <Button>A cocinar</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
