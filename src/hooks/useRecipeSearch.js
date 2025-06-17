/**
 * @file useRecipeSearch.js
 * @description Hook personalizado que unifica toda la lógica de filtrado, búsqueda y visualización de recetas.
 * Utiliza hooks internos (`useCategories` y `useRecipes`) y controla la interacción con la URL (parámetro de categoría),
 * además de aplicar una selección por defecto si no hay filtros activos. Maneja también el control de visibilidad de filtros
 * y la gestión de los resultados mostrados tras aplicar búsqueda o filtrado.
 *
 * @author Ana Castro, basado en el código original de Saray
 */

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useCategories from "./useCategories";
import useRecipes from "./useRecipes";

const useRecipeSearch = () => {
    const { categories, loading: loadingGeneral } = useCategories(2);
    const { categories: typeCategories, loading: loadingType } = useCategories(3);
    const { categories: originCategories, loading: loadingOrigin } = useCategories(4);
    const { recipes, loading: loadingRecipes } = useRecipes();
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedType, setSelectedType] = useState([]);
    const [selectedOrigin, setSelectedOrigin] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showingAll, setShowingAll] = useState(false);

    const [searchParams] = useSearchParams();
    useEffect(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam && categories.length > 0) {
            const selected = categories.filter(
                (cat) => cat.slug === categoryParam || cat.name.toLowerCase() === categoryParam.toLowerCase()
            );
            if (selected.length > 0) {
                setSelectedCategory([selected[0].id]);
            }
        }
    }, [searchParams, categories]);

    const toggleMostrarTodo = () => {
        setShowingAll((prev) => !prev);
    };

    const recipesToShow = useMemo(() => {
        if (showingAll) return recipes;

        const noFilters =
            selectedCategory.length === 0 &&
            selectedType.length === 0 &&
            selectedOrigin.length === 0 &&
            searchTerm.trim() === "";

        if (noFilters) return [];

        let result = recipes;
        if (selectedCategory.length > 0) {
            result = result.filter((recipe) => recipe.categories?.some((catId) => selectedCategory.includes(catId)));
        }
        if (selectedType.length > 0) {
            result = result.filter((recipe) => recipe.categories?.some((catId) => selectedType.includes(catId)));
        }
        if (selectedOrigin.length > 0) {
            result = result.filter((recipe) => recipe.categories?.some((catId) => selectedOrigin.includes(catId)));
        }
        if (searchTerm.trim() !== "") {
            result = result.filter((recipe) => recipe.name?.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return result;
    }, [recipes, selectedCategory, selectedType, selectedOrigin, searchTerm, showingAll]);

    return {
        loadingAll: loadingGeneral || loadingType || loadingOrigin || loadingRecipes,
        categories,
        typeCategories,
        originCategories,
        recipesToShow,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedType,
        setSelectedType,
        selectedOrigin,
        setSelectedOrigin,
        showingAll,
        toggleMostrarTodo,
    };
};

export default useRecipeSearch;
