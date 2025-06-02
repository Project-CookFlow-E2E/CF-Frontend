import React from "react";
import Card from "../components/Card";

const config = {
  categories: ["Breakfast", "Brunch", "Lunch", "Dinner", "Dessert", "Snack"],
  latestRecipes: [
    {
      id: 1,
      image: "https://via.placeholder.com/300x200",
      name: "Swamp Soup",
      category: "Lunch",
      time: "20 min",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/300x200",
      name: "Cherry Pie",
      category: "Dessert",
      time: "30 min",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/300x200",
      name: "Vegan Patty Melt",
      category: "Dinner",
      time: "15 min",
    },
  ],
};

const CheckboxCategoria = ({ name }) => (
  <button className="px-4 py-2 bg-accent text-white rounded-full text-sm hover:opacity-90 transition-opacity">
    {name}
  </button>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-background w-full">

      {/* Hero Section */}
      <div className="w-full bg-background pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
            <p className="text-gray-600 mb-2">Having trouble deciding?</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What are you<br />in the mood for?
            </h1>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {config.categories.map((category) => (
                <CheckboxCategoria key={category} name={category} />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.latestRecipes.map((recipe) => (
              <Card key={recipe.id} {...recipe} />
            ))}
          </div>
        </div>
      </div>

      {/* Inspire Me */}
      <div className="w-full bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            You don't know what to make yet?
          </h2>
          <button className="w-40 h-40 md:w-48 md:h-48 bg-accent rounded-full text-white font-semibold text-lg hover:opacity-90 mx-auto">
            Inspire me
          </button>
        </div>
      </div>

    </div>
  );
};

export default Home;
