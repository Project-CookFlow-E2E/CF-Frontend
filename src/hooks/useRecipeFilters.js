/**
 * @file useRecipeFilters.js
 * @description Hook personalizado para gestionar el filtrado de recetas según búsqueda por texto y filtros por categoría, tipo de cocina y origen.
 *
 * @function useRecipeFilters
 * @param {Array<Object>} recipes - Lista de recetas a filtrar.
 * @returns {Object} Objeto con:
 *  - `filteredRecipes` {Array<Object>}: Lista de recetas que cumplen con los filtros activos.
 *  - `searchTerm` {string}: Término de búsqueda por texto.
 *  - `setSearchTerm` {Function}: Setter para actualizar el término de búsqueda.
 *  - `selectedCategory` {Array<string>}: Categorías seleccionadas (con prefijo "general-").
 *  - `setSelectedCategory` {Function}: Setter para actualizar las categorías seleccionadas.
 *  - `selectedOrigin` {Array<string>}: Orígenes seleccionados (con prefijo "origin-").
 *  - `setSelectedOrigin` {Function}: Setter para actualizar los orígenes seleccionados.
 *  - `selectedType` {Array<string>}: Tipos de cocina seleccionados (con prefijo "type-").
 *  - `setSelectedType` {Function}: Setter para actualizar los tipos de cocina seleccionados.
 *
 *  @author Ana Castro basado en el codigo de Saray en Search.jsx
 */

import { useState, useMemo } from "react";

const useRecipeFilters = (recipes = []) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState([]);
  const [selectedType, setSelectedType] = useState([]);

  const match = (selectedArray, value, prefix) => {
    return (
      selectedArray.length === 0 ||
      selectedArray.map((id) => id.replace(`${prefix}-`, "")).includes(value)
    );
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      return (
        match(selectedCategory, recipe.category, "general") &&
        match(selectedOrigin, recipe.origin, "origin") &&
        match(selectedType, recipe.type, "type") &&
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [recipes, selectedCategory, selectedOrigin, selectedType, searchTerm]);

  return {
    filteredRecipes,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedOrigin,
    setSelectedOrigin,
    selectedType,
    setSelectedType
  };
};

export default useRecipeFilters;
