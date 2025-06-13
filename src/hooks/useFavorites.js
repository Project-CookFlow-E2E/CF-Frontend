/**
 * @file useFavorites.js
 * @description Hook conectado al backend para gestionar recetas favoritas del usuario autenticado.
 *
 * @function useFavorites
 * @returns {Object} Objeto con:
 *  - `favorites` {Array<number>}: Lista de IDs de recetas favoritas.
 *  - `toggleFavorite` {Function}: Marca o desmarca una receta como favorita en la BBDD.
 *  - `loading` {boolean}: Estado de carga inicial.
 *  - `error` {Error|null}: Error en caso de fallo de la API.
 *
 * @example
 * const { favorites, toggleFavorite } = useFavorites();
 * toggleFavorite(12);
 *
 * @author Ana Castro
 */

import { useEffect, useState } from "react";
import { favoriteService } from "../services/favoriteService";

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await favoriteService.getUserFavorites();
        const recipeIds = data.map((fav) => fav.recipe?.id); 
        setFavorites(recipeIds.filter(Boolean)); 
      } catch (err) {
        console.error("Error cargando favoritos:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  /**
   * Alterna el estado de favorito de una receta.
   * Si ya es favorita, la elimina. Si no, la añade.
   *
   * @param {number} recipeId 
   */
  const toggleFavorite = async (recipeId) => {
    const isFav = favorites.includes(recipeId);

    try {
      if (isFav) {
        await favoriteService.removeFavorite(recipeId);
        setFavorites((prev) => prev.filter((id) => id !== recipeId));
      } else {
        await favoriteService.addFavorite(recipeId);
        setFavorites((prev) => [...prev, recipeId]);
      }
    } catch (err) {
      console.error("Error al actualizar favoritos:", err);
      setError(err);
    }
  };

  return { favorites, toggleFavorite, loading, error };
}
