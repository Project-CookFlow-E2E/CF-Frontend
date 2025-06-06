// /src/pages/Search.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AutocompleteInput from "../components/AutocompleteInput";

const popularRecipes = [
  {
    id: 1,
    image: "/pasta.jpg",
    name: "Pasta Carbonara",
    category: "comida",
    origin: "italia",
    type: "cocido",
    time: "30 m",
  },
  {
    id: 2,
    image: "/salad.jpg",
    name: "Ensalada rica",
    category: "cena",
    origin: "grecia",
    type: "frito",
    time: "15 m",
  },
  {
    id: 3,
    image: "/soup.jpg",
    name: "Sopa de calabaza",
    category: "cena",
    origin: "españa",
    type: "sopa",
    time: "20 m",
  },
  {
    id: 4,
    image: "/pancakes.jpg",
    name: "Tortitas",
    category: "desayuno",
    origin: "americana",
    type: "plancha",
    time: "25 m",
  },
  {
    id: 5,
    image: "/tortilla.jpg",
    name: "Tortilla de patata",
    category: "comida",
    origin: "españa",
    type: "frito",
    time: "45 m",
  },
  {
    id: 6,
    image: "/sushi.jpeg",
    name: "Sushi",
    category: "cena",
    origin: "japonesa",
    type: "crudo",
    time: "55 m",
  },
];

const mockCategories = [
  { id: "comida", label: "Comida", available: true },
  { id: "desayuno", label: "Desayuno", available: true },
  { id: "brunch", label: "Brunch", available: true },
  { id: "cena", label: "Cena", available: true },
  { id: "postre", label: "Postre", available: true },
  { id: "merienda", label: "Merienda", available: true },
  { id: "snack", label: "Snack", available: true },
];

const mockOrigin = [
  { id: "italia", label: "Italiana", available: true },
  { id: "grecia", label: "Griega", available: true },
  { id: "españa", label: "Española", available: true },
  { id: "japonesa", label: "Japonesa", available: true },
  { id: "americana", label: "Americana", available: true },
];

const mockTypeCooking = [
  { id: "cocido", label: "Cocido", available: true },
  { id: "vapor", label: "Al vapor", available: true },
  { id: "hervido", label: "Hervido", available: true },
  { id: "guiso", label: "Guiso", available: true },
  { id: "frito", label: "Frito", available: true },
  { id: "plancha", label: "A la plancha", available: true },
  { id: "asado", label: "Asado", available: true },
  { id: "sopa", label: "Sopas", available: true },
  { id: "crudo", label: "Crudo", available: true },
];

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
    const categoryParam = params.get("category");

    if (categoryParam) {
      const categories = categoryParam.split(",").map((c) => c.trim());
      setSelectedCategory(categories);
      setTempSelectedCategory(categories);
      setIsOpen(true);
      setShowAll(true);
    }
  }, [location.search]);

  const getFilteredRecipes = () => {
    return popularRecipes.filter((recipe) => {
      const matchCategory =
        selectedCategory.length === 0 ||
        selectedCategory.includes(recipe.category);
      const matchOrigin =
        selectedOrigin.length === 0 || selectedOrigin.includes(recipe.origin);
      const matchType =
        selectedCookingType.length === 0 ||
        selectedCookingType.includes(recipe.type);
      const matchSearch = recipe.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchCategory && matchOrigin && matchType && matchSearch;
    });
  };

  const filteredRecipes = getFilteredRecipes();

  const handleSearch = () => {
    setSearchTerm(searchQuery.trim());
    setSelectedCategory(tempSelectedCategory);
    setSelectedOrigin(tempSelectedOrigin);
    setSelectedCookingType(tempSelectedCookingType);
    setShowAll(true);
  };

  function FiltroToggle({ isOpen, toggleOpen }) {
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
    <div className="min-h-screen flex flex-col justify-start items-start bg-background px-4 pt-15 lg:px-10">
      <div className="w-full lg:w-1/2 pr-4">
        <h4 className="text-xl font-bold text-black mb-2">
          ¿Qué quieres cocinar?
        </h4>
        <div className="w-full max-w-xl lg:max-w-2xl border border-black rounded-lg mb-10 mt-0 lg:mt-4">
          <div className="flex items-center bg-white rounded-lg border border-gray-300 px-4 py-3 lg:px-6 lg:py-4 w-full">
            <input
              type="text"
              placeholder="Buscar receta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="outline-none w-full bg-transparent text-base lg:text-lg"
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

      <div className="w-full flex flex-col md:flex-row items-start gap-8 px-0 md:px-4">
        <div className="w-full md:w-1/2">
          <FiltroToggle isOpen={isOpen} toggleOpen={() => setIsOpen(!isOpen)} />
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
                  onClick={handleSearch}
                >
                  Buscar
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="w-full md:w-1/2 md:pl-4 md:mt-0">
          <div className="flex justify-between items-center px-1 sm:px-2">
            <h4 className="text-xl font-bold text-black mb-1">Recetas populares</h4>
            <h4
              className="text-gray-500 cursor-pointer"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Ver menos" : "Ver todas"}
            </h4>
          </div>

          {showAll ? (
            filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-30 ">
                {filteredRecipes.map((recipe) => (
                  <Card key={recipe.id} {...recipe} />
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
                 className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth py-2 cursor-grab sm:justify-start justify-center md:hidden"
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
