import React from "react";
import useRecipe from "../hooks/useRecipe";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card } from "../components";

const recipeIds = [1, 2, 3];

const categoryMap = {
  Desayuno: "desayuno",
  Brunch: "brunch",
  Comida: "comida",
  Cena: "cena",
  Postre: "postre",
  Merienda: "merienda",
  Snack: "snack",
};

const categories = Object.keys(categoryMap);

const RecipeCard = ({ id, favorites, setFavorites }) => {
  const { recipe, loading } = useRecipe(id);
  const isFavorite = favorites.includes(String(id));

  const handleToggleFavorite = () => {
    const idStr = String(id);
    const updated = isFavorite
      ? favorites.filter((fav) => fav !== idStr)
      : [...favorites, idStr];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (loading) return <p className="text-center">Loading recipe {id}…</p>;
  if (!recipe) return <p className="text-center">Recipe {id} not found 😢</p>;

  return (
    <Card
      id={recipe.id}
      image={recipe.image_url}
      name={recipe.name}
      category={recipe.category}
      time={`${recipe.duration_minutes} m`}
      isFavorite={isFavorite}
      onToggleFavorite={handleToggleFavorite}
    />
  );
};

const Home = () => {
  const navigate = useNavigate();

  const [favorites, setFavorites] = React.useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCategories, setSelectedCategories] = React.useState([]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleSearchClick = () => {
    if (selectedCategories.length === 0) return;

    const mapped = selectedCategories.map((c) => categoryMap[c]);
    const uniqueMapped = Array.from(new Set(mapped));

    navigate(`/search?category=${uniqueMapped.join(",")}`);
  };

  const handleInspireClick = () => {
    navigate("/inspire-me");
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full bg-background pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
            <p className="text-gray-600 mb-2">¿No sabes que elegir?</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              ¿Qué te apetece?
            </h1>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <Badge
                    key={category}
                    className={`cursor-pointer ${
                      isSelected
                        ? "bg-pink-500 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                );
              })}
            </div>
            <Button onClick={handleSearchClick}>Buscar</Button>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src="/home-page.jpeg"
              alt="Delicious food"
              className="w-full max-w-lg xl:max-w-2xl h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="w-full bg-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Últimas recetas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {recipeIds.map((id) => (
              <RecipeCard
                key={id}
                id={id}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full bg-background pt-16 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            ¿Aún no sabes que hacer?
          </h2>
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-accent flex items-center justify-center mx-auto hover:bg-rose-600 transition">
            <Button
              onClick={handleInspireClick}
              className="text-white font-semibold text-lg bg-transparent hover:bg-transparent shadow-none"
            >
              Inspire me
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
