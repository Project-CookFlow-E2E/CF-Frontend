import { useEffect, useState } from 'react';

export default function useRecipe(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        // Para API HAY QUE CAMBUAR '/recipes.json' a `/api/recipes/${id}`
        const res = await fetch('/recipes.json');
        const data = await res.json();
        const found = data.find(r => r.id === Number(id));
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
