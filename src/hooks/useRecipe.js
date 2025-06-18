import { useEffect, useState } from 'react';
import { recipeService } from '../services/recipeService';

/**
 * Custom React hook para obtener una receta desde la base de datos por su ID.
 *
 * - Realiza una petición a la API usando recipeService.getRecipeById.
 * - Devuelve el objeto receta y el estado de carga.
 * - Maneja errores y asegura que no se actualice el estado si el componente está desmontado.
 *
 * @param {string|number} id - ID de la receta a buscar.
 * @returns {{ recipe: object|null, loading: boolean }}
 * @author Ángel Aragón
 * @modifiedby Noemi Casaprima
 * @modified Ahora obtiene la receta desde la base de datos real usando recipeService.
 */
export default function useRecipe(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const found = await recipeService.getRecipeById(Number(id));
        if (isMounted) setRecipe(found || null);
      } catch (err) {
        console.error(err);
        if (isMounted) setRecipe(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => { isMounted = false; };
  }, [id]);

  return { recipe, loading };
}