/**
 * @file Search.jsx
 * @description Componente de búsqueda de recetas con filtros por categoría, origen y tipo de cocina.
 * Permite búsqueda por nombre y visualización de recetas populares. Incluye control de scroll horizontal
 * en vista móvil y persistencia de parámetros por URL.
 * @author Saray
 * @modified by Ana Castro
 * @modified refactorizado en hooks y componentes reutilizables, para poder obtener las recetas y categorías desde la db.
 */

import { useState, useRef, useEffect } from "react";
import CategoryFilter from "../components/CategoryFilter";
import { Plus, Minus } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useLocation } from "react-router-dom";
import AutocompleteInput from "../components/AutocompleteInput";
import useRecipeFilters from "../hooks/useRecipeFilters";
import useCategories from "../hooks/useCategories";
import RecipeFiltersPanel from "../components/RecipeFiltersPanel";



/**
 * Arreglo de recetas populares utilizadas como fuente principal para los filtros y resultados.
 * @constant
 * @type {Array<Object>}
 */
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

/**
 * Categorías de recetas disponibles para filtrar.
 * @constant
 * @type {Array<Object>}
 */
const mockCategories = [
  { id: "comida", label: "Comida", available: true },
  { id: "desayuno", label: "Desayuno", available: true },
  { id: "brunch", label: "Brunch", available: true },
  { id: "cena", label: "Cena", available: true },
  { id: "postre", label: "Postre", available: true },
  { id: "merienda", label: "Merienda", available: true },
  { id: "snack", label: "Snack", available: true },
];

/**
 * Orígenes de las recetas disponibles para filtrar.
 * @constant
 * @type {Array<Object>}
 */
const mockOrigin = [
  { id: "italia", label: "Italiana", available: true },
  { id: "grecia", label: "Griega", available: true },
  { id: "españa", label: "Española", available: true },
  { id: "japonesa", label: "Japonesa", available: true },
  { id: "americana", label: "Americana", available: true },
];

/**
 * Tipos de cocina disponibles para filtrar.
 * @constant
 * @type {Array<Object>}
 */
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

/**
 * Componente principal de búsqueda de recetas.
 * @component
 * @returns {JSX.Element}
 */
const Search = () => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState([]);
  const [selectedCookingType, setSelectedCookingType] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const carouselRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [tempSelectedCategory, setTempSelectedCategory] = useState([]);
  const [tempSelectedOrigin, setTempSelectedOrigin] = useState([]);
  const [tempSelectedCookingType, setTempSelectedCookingType] = useState([]);

  const location = useLocation();

  /**
   * Efecto que sincroniza la URL con filtros iniciales.
   */
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

  /**
   * Filtra recetas según los filtros y la búsqueda.
   * @returns {Array<Object>}
   */
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

  /**
   * Ejecuta la búsqueda con los filtros seleccionados.
   */
  const handleSearch = () => {
    setSearchTerm(searchQuery.trim());
    setSelectedCategory(tempSelectedCategory);
    setSelectedOrigin(tempSelectedOrigin);
    setSelectedCookingType(tempSelectedCookingType);
    setShowAll(true);
  };

  /**
   * Componente de cabecera para mostrar/ocultar filtros.
   * @param {Object} props
   * @param {boolean} props.isOpen - Estado del panel de filtros.
   * @param {Function} props.toggleOpen - Función para alternar visibilidad.
   * @returns {JSX.Element}
   */
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

  /**
   * Inicia el arrastre del carrusel (mouse).
   * @param {MouseEvent} e
   */
  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftStart(carouselRef.current.scrollLeft);
  };

  /** Finaliza el arrastre del carrusel al salir del área. */
  const onMouseLeave = () => setIsDragging(false);
  /** Finaliza el arrastre al soltar el mouse. */
  const onMouseUp = () => setIsDragging(false);

  /**
   * Mueve el carrusel mientras se arrastra con el mouse.
   * @param {MouseEvent} e
   */
  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    carouselRef.current.scrollLeft = scrollLeftStart - walk;
  };

  /**
   * Inicia el arrastre del carrusel en pantallas táctiles.
   * @param {TouchEvent} e
   */
  const onTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeftStart(carouselRef.current.scrollLeft);
  };
  /** Finaliza el arrastre táctil. */
  const onTouchEnd = () => setIsDragging(false);

  /**
   * Mueve el carrusel mientras se arrastra con el dedo.
   * @param {TouchEvent} e
   */
  const onTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    carouselRef.current.scrollLeft = scrollLeftStart - walk;
  };

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
                <Button onClick={handleSearch}>Buscar</Button>
              </div>
            </>
          )}
        </div>

        <div className="w-full md:w-1/2 md:pl-4 md:mt-0">
          <div className="flex justify-between items-center px-1 sm:px-2">
            <h4 className="text-xl font-bold text-black mb-1">
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
            filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-30">
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
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onTouchMove={onTouchMove}
              >
                {filteredRecipes.map((recipe) => (
                  <div key={recipe.id} style={{ scrollSnapAlign: "start" }}>
                    <Card {...recipe} />
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
