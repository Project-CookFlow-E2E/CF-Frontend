import api from "./api";

export const getRecipes = async () => {
  try {
    const res = await api.post("/api/recipes");
    return res.data;
  } catch (error) {
    console.error(`Error fetching recipes: ${error.message}`);
    throw error;
  }
};