/**
 * @file useProfileRecipes.js
 * @description Hook personalizado para gestionar las recetas en el perfil del usuario.
 * Maneja la alternancia entre recetas guardadas y creadas, la paginación y el estado de favoritos.
 *
 * Funcionalidades:
 * - Filtra recetas según la pestaña activa (guardadas o creadas).
 * - Gestiona la paginación de recetas (8 por página).
 * - Permite marcar/desmarcar recetas como favoritas.
 * - Reinicia la página actual al cambiar de pestaña.
 *
 * Dependencias:
 * - useFavorites: Hook para administrar recetas favoritas.
 * - mockRecipes: Datos simulados de recetas.
 *
 * @module hooks/useProfileRecipes
 * @author Ana Castro
 */

import { useState, useEffect, useMemo } from "react";
import { mockRecipes } from "../data/mockData";
import useFavorites from "./useFavorites";

/**
 * Hook para manejar la lógica del perfil de usuario con recetas guardadas y creadas.
 *
 * @returns {Object} Estado y funciones para gestionar la visualización de recetas en el perfil.
 */
export default function useProfileRecipes() {
  const [activeTab, setActiveTab] = useState("saved"); // Pestaña activa: "saved" o "created"
  const [currentPage, setCurrentPage] = useState(1); // Página actual de la lista de recetas
  const { favorites, toggleFavorite } = useFavorites(); // Estado y función para manejar favoritos
  const recipesPerPage = 8; // Número de recetas por página

  /**
   * Filtra las recetas según la pestaña activa.
   * - Si la pestaña es "saved", muestra solo las recetas marcadas como favoritas.
   * - Si la pestaña es "created", muestra solo las recetas creadas por el usuario.
   */
  const filteredRecipes = useMemo(() => {
    return mockRecipes.filter((recipe) =>
      activeTab === "saved"
        ? favorites.includes(String(recipe.id))
        : recipe.isCreatedByUser
    );
  }, [activeTab, favorites]);

  /**
   * Genera la lista de recetas paginadas según la página actual.
   */
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * recipesPerPage;
    return filteredRecipes.slice(start, start + recipesPerPage);
  }, [filteredRecipes, currentPage]);

  /**
   * Calcula el número total de recetas creadas por el usuario.
   */
  const createdRecipesCount = useMemo(
    () => mockRecipes.filter((r) => r.isCreatedByUser).length,
    []
  );

  /**
   * Calcula el número total de páginas basado en la cantidad de recetas filtradas.
   */
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  /**
   * Reinicia la paginación cuando se cambia la pestaña activa.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    favorites,
    toggleFavorite,
    createdRecipesCount,
    totalPages,
    filteredRecipes,
    paginatedRecipes,
  };
}
