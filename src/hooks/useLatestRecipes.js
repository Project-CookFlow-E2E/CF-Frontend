/**
 * Custom hook to fetch the latest recipes from the API, sort them by creation date, and return them.
 *
 * @module useLatestRecipes
 * @author Ana Castro
 *
 * @returns {Object} The object containing:
 * - `latestRecipes` {Array}: Sorted list of the latest recipes (up to 3).
 * - `loading` {boolean}: Flag indicating whether the data is still being fetched.
 */

import { useEffect, useState } from "react";
import api from "../services/api";

const useLatestRecipes = () => {
    const [latestRecipes, setLatestRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const { data } = await api.get("/recipes/recipes/");
                const recipes = Array.isArray(data.results) ? data.results : data;

                if (recipes.length) {
                    const sortedRecipes = recipes
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .slice(0, 3);
                    setLatestRecipes(sortedRecipes);
                } else {
                    console.warn("⚠️ No recipes available");
                }
            } catch (error) {
                console.error("🚨 Error fetching recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    return { latestRecipes, loading };
};

export default useLatestRecipes;
