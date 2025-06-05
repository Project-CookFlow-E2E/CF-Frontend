import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import { Plus, Minus } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import useRecipe from "../hooks/useRecipe";

import {
  popularRecipes,
  mockCategories,
  mockOrigin,
  mockTypeCooking,
} from "../data/mockData";

const Search = () => {
  // Filter State
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState([]);
  const [selectedCookingType, setSelectedCookingType] = useState([]);

  // Temporary state while user is picking filters
  const [tempSelectedCategory, setTempSelectedCategory] = useState([]);
  const [tempSelectedOrigin, setTempSelectedOrigin] = useState([]);
  const [tempSelectedCookingType, setTempSelectedCookingType] = useState([]);

  // Toggle “Filtros” panel
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // For the horizontal carousel
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  // Search input
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Grab URL params if “category” is passed via query string
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");

    if (categoryParam) {
      const categories = categoryParam.split(",").map((c) => c.trim());
      setSelectedCategory(categories);
      setIsOpen(true);
      setShowAll(true);
    }
  }, [location.search]);

  // Filter logic: returns an array of IDs that match all filters + search
  const getFilteredRecipeIds = () => {
    return popularRecipes
      .filter((recipe) => {
        const matchCategory =
          selectedCategory.length === 0 ||
          selectedCategory.includes(recipe.category);
        const matchOrigin =
          selectedOrigin.length === 0 ||
          selectedOrigin.includes(recipe.origin);
        const matchType =
          selectedCookingType.length === 0 ||
          selectedCookingType.includes(recipe.type);

        const matchSearch = recipe.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        return matchCategory && matchOrigin && matchType && matchSearch;
      })
      .map((recipe) => recipe.id);
  };

  const filteredRecipeIds = getFilteredRecipeIds();

  // Handler for pressing “Enter” or clicking the search icon
  const handleSearch = () => {
    setSearchTerm(searchQuery.trim());
    setShowAll(true);
  };

  // Mouse + Touch handlers for horizontal scroll
  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftStart(carouselRef.current.scrollLeft);
  };
  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    carouselRef.current.scrollLeft = scrollLeftStart - walk;
  };
  const onTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeftStart(carouselRef.current.scrollLeft);
  };
  const onTouchEnd = () => setIsDragging(false);
  const onTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    carouselRef.current.scrollLeft = scrollLeftStart - walk;
  };

  // fetch recipe by ID & render <Card /> when done
  function RecipeCardWithHook({ id }) {
    const { recipe, loading } = useRecipe(id);

    if (loading)
      return (
        <div className="animate-pulse bg-gray-200 h-64 w-48 rounded-lg"></div>
      );
    if (!recipe) return null;

    const isFavorite = favorites.includes(String(id));

    const handleToggleFavorite = () => {
      const idStr = String(id);
      let updated;
      if (isFavorite) {
        updated = favorites.filter((fav) => fav !== idStr);
      } else {
        updated = [...favorites, idStr];
      }
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
    };

    return (
      <Card
        key={recipe.id}
        id={recipe.id}
        image={recipe.image_url}
        name={recipe.name}
        category={recipe.category}
        time={`${recipe.duration_minutes} m`}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  }

  // Toggle arrow + label for “Filtros”
  function FiltroToggle({ isOpen, toggleOpen }) {
    return (
      <div
        className="flex items-center justify-between w-full px-4 cursor-pointer mb-3"
        onClick={toggleOpen}
      >
        <h4 className="text-lg sm:text-xl font-semibold m-0">Filtros</h4>
        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-start items-start bg-background px-4 pt-26 lg:px-10">
      {/* Search Input */}
      <div className="w-full max-w-screen-lg px-0 lg:pl-4">
        <h4 className="text-xl font-bold text-black mb-2">
          ¿Qué quieres cocinar?
        </h4>
        <div className="w-full max-w-xl lg:max-w-2xl border border-black rounded-lg mb-10 mt-0 lg:mt-4">
          <div className="flex items-center bg-white rounded-lg border border-gray-300 px-4 py-3 w-full">
            <input
              type="text"
              placeholder="Buscar receta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="outline-none w-full bg-transparent"
            />
            <button onClick={handleSearch}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-8 px-0 lg:pl-4">
        {/* Filters column */}
        <div className="w-full lg:w-1/3">
          <FiltroToggle
            isOpen={isOpen}
            toggleOpen={() => setIsOpen(!isOpen)}
          />
          {isOpen && (
            <>
              <CategoryFilter
                categories={mockCategories}
                initialSelected={tempSelectedCategory}
                onSelectionChange={setTempSelectedCategory}
                title="Categorías"
                maxRowsWhenCollapsed={4}
                itemsPerRow={2}
                className="mb-6"
              />
              <CategoryFilter
                categories={mockTypeCooking}
                initialSelected={tempSelectedCookingType}
                onSelectionChange={setTempSelectedCookingType}
                title="Tipo de cocina"
                maxRowsWhenCollapsed={4}
                itemsPerRow={2}
                className="mb-6"
              />
              <CategoryFilter
                categories={mockOrigin}
                initialSelected={tempSelectedOrigin}
                onSelectionChange={setTempSelectedOrigin}
                title="Origen"
                maxRowsWhenCollapsed={4}
                itemsPerRow={2}
                className="mb-6"
              />
              <div className="flex justify-center">
                <Button
                  className="mb-3 w-40 px-1"
                  onClick={() => {
                    setSelectedCategory(tempSelectedCategory);
                    setSelectedOrigin(tempSelectedOrigin);
                    setSelectedCookingType(tempSelectedCookingType);
                    setShowAll(true);
                  }}
                >
                  Buscar
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Results column */}
        <div className="w-full lg:w-2/3">
          <div className="flex justify-between items-center px-1 sm:px-2 mb-5">
            <h4 className="text-xl font-bold text-black">
              Recetas populares
            </h4>
            <h4
              className="text-l text-gray-500 cursor-pointer"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Ver menos" : "Ver todas"}
            </h4>
          </div>

          {showAll ? (
            filteredRecipeIds.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-30">
                {filteredRecipeIds.map((id) => (
                  <RecipeCardWithHook key={id} id={id} />
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
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onTouchMove={onTouchMove}
              >
                {filteredRecipeIds.map((id) => (
                  <div key={id} style={{ scrollSnapAlign: "start" }}>
                    <RecipeCardWithHook id={id} />
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
