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

export default function useProfileRecipes() {
  const [activeTab, setActiveTab] = useState("saved");
  const [currentPage, setCurrentPage] = useState(1);
  const { favorites, toggleFavorite } = useFavorites();
  const recipesPerPage = 8;

  const filteredRecipes = useMemo(() => {
    return mockRecipes.filter((recipe) =>
      activeTab === "saved"
        ? favorites.includes(String(recipe.id))
        : recipe.isCreatedByUser
    );
  }, [activeTab, favorites]);

  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * recipesPerPage;
    return filteredRecipes.slice(start, start + recipesPerPage);
  }, [filteredRecipes, currentPage]);

  const createdRecipesCount = useMemo(
    () => mockRecipes.filter((r) => r.isCreatedByUser).length,
    []
  );

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

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
