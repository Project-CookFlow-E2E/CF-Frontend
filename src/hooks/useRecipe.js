import { useEffect, useState } from 'react';
import { mockRecipes } from '../data/mockData';

export default function useRecipe(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    function load() {
      try {
        // Using mock data instead of API call
        const found = mockRecipes.find(r => r.id === Number(id));
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