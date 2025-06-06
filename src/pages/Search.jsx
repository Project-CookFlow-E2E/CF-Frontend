// /src/pages/Search.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { Button, Card, CategoryFilter } from "../components";
import useRecipe from "../hooks/useRecipe";
import {
  mockCategories,
  mockOrigin,
  mockTypeCooking,
  mockRecipes,
} from "../data/mockData";

const Search = () => {
  const location = useLocation();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState([]);
  const [selectedType, setSelectedType] = useState([]);

  const [tempCategory, setTempCategory] = useState([]);
  const [tempOrigin, setTempOrigin] = useState([]);
  const [tempType, setTempType] = useState([]);

  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("favorites")) || [],
  );

  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat) {
      const catList = cat.split(",").map((c) => c.trim());
      setSelectedCategory(catList);
      setTempCategory(catList);
      setFiltersOpen(true);
      setShowAll(true);
    }
  }, [location.search]);

  const matchesFilter = (recipe) => {
    const match = (sel, val) =>
      sel.length === 0 || sel.includes(val?.toLowerCase());
    return (
      match(selectedCategory, recipe.category) &&
      match(selectedOrigin, recipe.origin) &&
      match(selectedType, recipe.type) &&
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  };

  const filteredRecipes = mockRecipes.filter(matchesFilter);

  const handleSearch = () => setShowAll(true);

  const handleToggleFavorite = (id) => {
    const idStr = String(id);
    const updated = favorites.includes(idStr)
      ? favorites.filter((f) => f !== idStr)
      : [...favorites, idStr];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const handleDragStart = (x) => {
    setIsDragging(true);
    setStartX(x - carouselRef.current.offsetLeft);
    setScrollLeftStart(carouselRef.current.scrollLeft);
  };

  const handleDragMove = (x) => {
    if (!isDragging) return;
    const walk = (x - startX) * 1;
    carouselRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const RecipeCard = ({ id }) => {
    const { recipe, loading } = useRecipe(id);
    if (loading)
      return <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />;
    if (!recipe) return null;

    return (
      <Card
        id={recipe.id}
        image={recipe.image_url}
        name={recipe.name}
        category={recipe.category}
        time={`${recipe.duration_minutes} m`}
        isFavorite={favorites.includes(String(id))}
        onToggleFavorite={() => handleToggleFavorite(id)}
      />
    );
  };

  const FiltersSection = () =>
    filtersOpen && (
      <>
        <CategoryFilter
          categories={mockCategories}
          initialSelected={tempCategory}
          onSelectionChange={setTempCategory}
          title="Categorías"
          className="mb-6"
        />
        <CategoryFilter
          categories={mockTypeCooking}
          initialSelected={tempType}
          onSelectionChange={setTempType}
          title="Tipo de cocina"
          className="mb-6"
        />
        <CategoryFilter
          categories={mockOrigin}
          initialSelected={tempOrigin}
          onSelectionChange={setTempOrigin}
          title="Origen"
          className="mb-6"
        />
        <div className="flex justify-center">
          <Button
            className="mb-3 w-40"
            onClick={() => {
              setSelectedCategory(tempCategory);
              setSelectedOrigin(tempOrigin);
              setSelectedType(tempType);
              setShowAll(true);
            }}
          >
            Buscar
          </Button>
        </div>
      </>
    );

  return (
    <div className="min-h-screen bg-background px-4 pt-26 lg:px-10">
      {/* Search Input */}
      <div className="max-w-screen-lg lg:pl-4">
        <h4 className="text-xl font-bold mb-2">¿Qué quieres cocinar?</h4>
        <div className="max-w-2xl border border-black rounded-lg mb-10">
          <div className="flex items-center bg-white border border-gray-300 px-4 py-3 rounded-lg">
            <input
              type="text"
              placeholder="Buscar receta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="outline-none w-full bg-transparent"
            />
            <button onClick={handleSearch}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="lucide lucide-search"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.34-4.34" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filters + Results */}
      <div className="flex flex-col lg:flex-row gap-8 lg:pl-4">
        {/* Filters */}
        <div className="w-full lg:w-1/3">
          <div
            className="flex items-center justify-between px-4 mb-3 cursor-pointer"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <h4 className="text-lg font-semibold">Filtros</h4>
            {filtersOpen ? (
              <Minus className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </div>
          <FiltersSection />
        </div>

        {/* Results */}
        <div className="w-full lg:w-2/3">
          <div className="flex justify-between items-center px-1 sm:px-2 mb-5">
            <h4 className="text-xl font-bold">Recetas populares</h4>
            <h4
              className="text-gray-500 cursor-pointer"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Ver menos" : "Ver todas"}
            </h4>
          </div>

          {showAll ? (
            filteredRecipes.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-30">
                {filteredRecipes.map((r) => (
                  <RecipeCard key={r.id} id={r.id} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 text-lg mt-10 mb-40">
                Lo siento, no tenemos resultados para esa receta.
              </div>
            )
          ) : (
            <div className="relative">
              <div
                ref={carouselRef}
                className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth py-2 cursor-grab"
                style={{ scrollSnapType: "x mandatory" }}
                onMouseDown={(e) => handleDragStart(e.pageX)}
                onMouseMove={(e) => handleDragMove(e.pageX)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={(e) => handleDragStart(e.touches[0].pageX)}
                onTouchMove={(e) => handleDragMove(e.touches[0].pageX)}
                onTouchEnd={() => setIsDragging(false)}
              >
                {filteredRecipes.map((r) => (
                  <div key={r.id} style={{ scrollSnapAlign: "start" }}>
                    <RecipeCard id={r.id} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
