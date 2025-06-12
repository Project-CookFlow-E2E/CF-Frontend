/**
 * @file useFavorites.js
 * @description Hook personalizado para gestionar recetas favoritas del usuario.
 * Utiliza `localStorage` para persistir los favoritos entre sesiones.
 *
 * Funcionalidades:
 * - Carga los favoritos desde `localStorage` al iniciar.
 * - Guarda automáticamente los cambios en `localStorage` cuando la lista de favoritos cambia.
 * - Permite alternar el estado de favorito en una receta.
 *
 * @module hooks/useFavorites
 * @author Ana Castro
 */

import { useState, useEffect } from "react";

/**
 * Hook para manejar los favoritos del usuario.
 *
 * @returns {Object} Estado y función para gestionar favoritos.
 */
export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    /**
     * Carga los favoritos almacenados en `localStorage`.
     * Si no hay datos previos, retorna un array vacío.
     *
     * @returns {string[]} Lista de IDs de recetas marcadas como favoritas.
     */
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    /**
     * Guarda la lista de favoritos en `localStorage` cada vez que cambia.
     */
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  /**
   * Alterna el estado de favorito de una receta.
   *
   * @param {number|string} id - ID de la receta a modificar.
   */
  const toggleFavorite = (id) => {
    const idStr = String(id);
    setFavorites((prev) =>
      prev.includes(idStr)
        ? prev.filter((fav) => fav !== idStr)
        : [...prev, idStr]
    );
  };

  return { favorites, toggleFavorite };
}
