/**
 * @file useRecipeFilters.js
 * @description Hook personalizado para gestionar filtros de recetas por categoría, tipo, origen y texto.
 * Si se selecciona una categoría padre, obtiene automáticamente las subcategorías asociadas desde el backend.
 *
 * @author Saray
 * @modified Ana Castro - Añadido filtrado dinámico por subcategorías y lógica de categoría inicial desde URL.
 */

import { useState, useEffect } from "react";
import { categoryService } from "../services/categoryService";

const useRecipeFilters = (recipes) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState([]);
  const [subcategoryIds, setSubcategoryIds] = useState([]);

  /**
   * Obtiene las subcategorías si hay una única categoría seleccionada (se asume que es una categoría padre).
   */
  
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory.length === 1) {
        try {
          const data = await categoryService.getChildCategoriesOfSpecificParent(selectedCategory[0]);
          const subcategories = Array.isArray(data)
            ? data
            : Array.isArray(data.results)
            ? data.results
            : [];
          setSubcategoryIds(subcategories.map((cat) => cat.id));
        } catch (err) {
          console.error("❌ Error fetching subcategories:", err);
          setSubcategoryIds([]);
        }
      } else {
        setSubcategoryIds([]);
      }
    };

    fetchSubcategories();
  }, [selectedCategory]);

  /**
   * Filtra las recetas según los filtros activos: subcategorías (si hay una categoría padre), tipo, origen y búsqueda.
   */
  const filteredRecipes = recipes.filter((recipe) => {
    const matchCategory =
      selectedCategory.length === 0 ||
      recipe.categories?.some((id) => subcategoryIds.includes(id));

    const matchType =
      selectedType.length === 0 || selectedType.includes(recipe.type?.id);

    const matchOrigin =
      selectedOrigin.length === 0 || selectedOrigin.includes(recipe.origin?.id);

    const matchSearch = recipe.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchCategory && matchType && matchOrigin && matchSearch;
  });

  /**
   * Aplica una categoría inicial (por nombre) desde la URL si coincide con alguna existente.
   * @param {string} categoryName - Nombre de la categoría a buscar (ej: "Comida").
   * @param {Array} categoriesList - Lista de categorías disponibles.
   */
  const applyCategoryFromURL = (categoryName, categoriesList) => {
    const match = categoriesList.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (match) {
      setSelectedCategory([match.id]);
    }
  };

  return {
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
  };
};

export default useRecipeFilters;
