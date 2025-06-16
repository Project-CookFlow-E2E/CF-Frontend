/**
 * @file Search.jsx
 * @description Página de búsqueda de recetas. Permite aplicar filtros por categoría, tipo de cocina y origen,
 * además de realizar búsquedas por texto. Solo se muestran las recetas tras pulsar "Buscar" o la tecla Enter.
 *
 * @author Saray
 * @modified Ana Castro - Refactorización del filtrado a hook personalizado, integración con base de datos
 * para categorías y recetas. Se ha externalizado la lógica de selección automática desde parámetros de URL
 * hacia el hook de filtros.
 */

import { useSearchParams } from "react-router-dom";
import RecipeFiltersPanel from "../components/RecipeFiltersPanel";
import Card from "../components/Card";
import Button from "../components/Button";
import useCategories from "../hooks/useCategories";
import useRecipes from "../hooks/useRecipes";
import useRecipeFilters from "../hooks/useRecipeFilters";
import { useState, useEffect } from "react";

const Search = () => {
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");
    const [showAll, setShowAll] = useState(false);

    const { categories, loading } = useCategories(1);
    const { categories: typeCategories, loading: loadingType } = useCategories(2);
    const { categories: originCategories, loading: loadingOrigin } = useCategories(3);
    const { recipes, loading: loadingRecipes } = useRecipes();

    const {
        filteredRecipes,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedType,
        setSelectedType,
        selectedOrigin,
        setSelectedOrigin,
        applyCategoryFromURL,
    } = useRecipeFilters(recipes);

    
    useEffect(() => {
        if (categoryParam && categories.length > 0) {
            applyCategoryFromURL(categoryParam, categories);
        }
    }, [categoryParam, categories]);

    const visibleRecipes = showAll ? filteredRecipes : recipes;

    if (loading || loadingType || loadingOrigin) {
        return <div>Cargando categorías...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col justify-start items-start bg-background px-4 pt-15 lg:px-10">
            <div className="w-full lg:w-1/2 pr-4">
                <h4 className="text-xl font-bold text-black mb-2">¿Qué quieres cocinar?</h4>
                <div className="w-full max-w-xl lg:max-w-2xl border border-black rounded-lg mb-10 mt-0 lg:mt-4">
                    <div className="flex items-center bg-white rounded-lg border border-gray-300 px-4 py-3 lg:px-6 lg:py-4 w-full">
                        <input
                            type="text"
                            placeholder="Buscar receta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") setShowAll(true);
                            }}
                            className="outline-none w-full bg-transparent text-base lg:text-lg"
                        />
                        <button onClick={() => setShowAll(true)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-search"
                            >
                                <path d="m21 21-4.34-4.34" />
                                <circle cx="11" cy="11" r="8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col md:flex-row items-start gap-8 px-0 md:px-4">
                <div className="w-full md:w-1/2">
                    <RecipeFiltersPanel
                        general={categories}
                        type={typeCategories}
                        origin={originCategories}
                        selected={{ selectedCategory, selectedType, selectedOrigin }}
                        setSelected={{ setSelectedCategory, setSelectedType, setSelectedOrigin }}
                    />
                    <div className="flex justify-center mt-4">
                        <Button onClick={() => setShowAll(true)}>Buscar</Button>
                    </div>
                </div>

                <div className="w-full md:w-1/2 md:pl-4 md:mt-0">
                    <div className="flex justify-between items-center px-1 sm:px-2">
                        <h4 className="text-xl font-bold text-black mb-1">Recetas populares</h4>
                    </div>

                    {loadingRecipes ? (
                        <div className="text-center text-gray-600 text-lg mt-10 mb-40">Cargando recetas...</div>
                    ) : showAll ? (
                        filteredRecipes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-30">
                                {filteredRecipes.map((recipe) => (
                                    <Card key={recipe.id} {...recipe} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-600 text-lg mt-10 mb-40">
                                Lo siento, no tenemos resultados para esa receta.
                            </div>
                        )
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-30">
                            {visibleRecipes.map((recipe) => (
                                <Card key={recipe.id} {...recipe} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
