/**
 * Home Page Component
 *
 * Página principal que permite al usuario:
 * - Seleccionar categorías para buscar recetas.
 * - Ver las últimas recetas destacadas.
 * - Marcar recetas como favoritas (persistidas en localStorage).
 * - Recibir inspiración aleatoria con un botón.
 *
 * Usa `useNavigate` para la navegación entre páginas.
 * Usa `useFavorites` para gestionar las recetas favoritas del usuario
 *
 * @author Yuliia Martynovych
 * @module Home 
 * @modifiedby Ana Castro
 * @modified adaptar el componente Card.jsx para usarlo directamente, gestion de favorites a través del hook useFavorites,
 * gestion de categorias a través del hook useCategories,
 *  añadida la sección de inspiración con un botón que redirige a /inspire-me.
 *  Seleccion de las tres ultimas recetas creadas en la db.
 */

import { Badge, Button, Card } from "../components";
import useFavorites from "../hooks/useFavorites";
import useCategories from "../hooks/useCategories";
import useLatestRecipes from "../hooks/useLatestRecipes";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userService } from "../services/userService";

const Home = () => {
    const { latestRecipes } = useLatestRecipes();
    const { favorites, toggleFavorite } = useFavorites();
    const { categories, selectedCategories, toggleCategory, handleSearchClick } = useCategories(2);
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

    useEffect(() => {
        userService
            .getMe()
            .then((user) => setUserName(user?.name || user?.first_name || user?.username || ""))
            .catch(() => setUserName(""));
    }, []);

    return (
        <div className="min-h-screen bg-background w-full" data-testid="home-page">
            <div className="w-full bg-background pt-7 pb-12 px-4 sm:px-6 lg:px-20" id="home-header">
                <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                        <p className="text-gray-600 mb-8 text-lg" data-testid="prompt-text">
                            {userName ? (
                                <>
                                    <span className="font-bold">¡Hola, {userName}!</span> ¿No sabes qué cocinar hoy?
                                </>
                            ) : (
                                "¿No sabes qué elegir?"
                            )}
                        </p>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-10" data-testid="main-title">
                            ¿Qué te apetece?
                        </h1>
                        <div
                            className="flex flex-wrap gap-2 justify-center lg:justify-start mb-14"
                            data-testid="category-list"
                        >
                            {categories.map((category) => {
                                const isSelected = selectedCategories.includes(category.name);
                                return (
                                    <Badge
                                        key={category.id}
                                        data-testid={`category-badge-${category.name}`}
                                        className={`cursor-pointer ${
                                            isSelected
                                                ? "bg-pink-500 text-white"
                                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                        }`}
                                        onClick={() => toggleCategory(category.name)}
                                    >
                                        {category.name}
                                    </Badge>
                                );
                            })}
                        </div>
                        <Button onClick={handleSearchClick} data-testid="search-button">
                            Buscar
                        </Button>
                    </div>

                    <div className="flex justify-center lg:justify-end" data-testid="home-image-container">
                        <img
                            src="/home-page.jpeg"
                            alt="Delicious food"
                            className="w-full max-w-lg xl:max-w-2xl h-auto rounded-lg shadow-lg"
                            data-testid="home-image"
                            id="home-image"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full bg-primary py-12 px-4 sm:px-6 lg:px-8" data-testid="latest-recipes-section">
                <div className="max-w-7xl mx-auto">
                    <h2
                        className="text-3xl font-bold text-center text-gray-900 mb-8"
                        data-testid="latest-recipes-title"
                    >
                        Últimas recetas
                    </h2>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
                        data-testid="latest-recipes-list"
                    >
                        {latestRecipes.map((recipe) => (
                            <Card
                                key={recipe.id}
                                id={`recipe-card-${recipe.id}`}
                                image={recipe.image_url}
                                name={recipe.name}
                                category={recipe.category}
                                time={`${recipe.duration_minutes}`}
                               isFavorite={favorites.includes(String(recipe.id))} 
                                onToggleFavorite={() => toggleFavorite(recipe.id)}
                                onClick={() => navigate(`/recipe/${recipe.id}`)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full bg-background pt-16 pb-28 px-4 sm:px-6 lg:px-8" data-testid="inspire-section">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12" data-testid="inspire-title">
                        ¿Aún no sabes que hacer?
                    </h2>
                    <Button
                        onClick={() => navigate("/inspire-me")}
                        ariaLabel="Inspire me"
                        className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-accent flex items-center justify-center mx-auto hover:bg-rose-600 transition"
                    >
                        <span className="text-white font-semibold text-lg">Inspire me</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Home;
