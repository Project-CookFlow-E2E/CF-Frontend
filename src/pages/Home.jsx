import React from "react";
import Card from "../components/Card";
import useRecipe from "../hooks/useRecipe";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const recipeIds = [1, 2, 3];

const CategoryCheckbox = ({ name }) => (
  <button className="px-4 py-2 bg-accent text-white rounded-full text-sm hover:opacity-90 transition-opacity">
    {name}
  </button>
);

const categories = [
  "Breakfast",
  "Brunch",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
];

const RecipeCard = ({ id, favorites, setFavorites }) => {
  const { recipe, loading } = useRecipe(id);
  const isFavorite = favorites.includes(String(id));

  const handleToggleFavorite = () => {
    const idStr = String(id);
    const updated = isFavorite
      ? favorites.filter(fav => fav !== idStr)
      : [...favorites, idStr];

    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  if (loading) return <p className="text-center">Loading recipe {id}…</p>;
  if (!recipe) return <p className="text-center">Recipe {id} not found 😢</p>;

  return <Card {...recipe} isFavorite={isFavorite} onToggleFavorite={handleToggleFavorite} />;
};

const Home = () => {
  const navigate = useNavigate();

  const [favorites, setFavorites] = React.useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const handleInspireClick = () => {
    navigate("/inspire-me");
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full bg-background pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
            <p className="text-gray-600 mb-2">Having trouble deciding?</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What are you
              <br />
              in the mood for?
            </h1>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {categories.map((category) => (
                <CategoryCheckbox key={category} name={category} />
              ))}
            </div>
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

      {/* Latest Recipes */}
      <div className="w-full bg-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Latest recipes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {recipeIds.map((id) => (
              <RecipeCard key={id} id={id} favorites={favorites} setFavorites={setFavorites} />
            ))}
          </div>
        </div>
      </div>

      {/* Inspire Me */}
      <div className="w-full bg-background pt-16 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            You don't know what to make yet?
          </h2>
          <button
            onClick={handleInspireClick}
            className="w-40 h-40 md:w-48 md:h-48 bg-accent rounded-full text-white font-semibold text-lg hover:opacity-90 flex items-center justify-center mx-auto"
          >
            Inspire me
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
