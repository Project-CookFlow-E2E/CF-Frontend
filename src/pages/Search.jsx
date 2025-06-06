/**
 * @file Search.jsx
 * @description Página de búsqueda de recetas. Permite filtrar por nombre, categoría, tipo de cocción y origen.
 * Muestra recetas populares en formato grid o carrusel, según el estado del filtro.
 *
 * Componentes usados:
 * - Card
 * - CategoryFilter
 * - Button
 * - AutocompleteInput (aunque no se usa en esta página)
 *
 * Datos mock:
 * - popularRecipes
 * - mockCategories
 * - mockOrigin
 * - mockTypeCooking
 */

import { useState, useRef, useEffect } from "react";
import CategoryFilter from "../components/CategoryFilter";
import { Plus, Minus } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useLocation } from "react-router-dom";
import AutocompleteInput from "../components/AutocompleteInput";

// ===================
// Datos Simulados
// ===================
const popularRecipes = [ /* ... */ ];
const mockCategories = [ /* ... */ ];
const mockOrigin = [ /* ... */ ];
const mockTypeCooking = [ /* ... */ ];

const Search = () => {
  // Estados de filtros
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState([]);
  const [selectedCookingType, setSelectedCookingType] = useState([]);

  // Estados para filtros temporales (antes de aplicar búsqueda)
  const [tempSelectedCategory, setTempSelectedCategory] = useState([]);
  const [tempSelectedOrigin, setTempSelectedOrigin] = useState([]);
  const [tempSelectedCookingType, setTempSelectedCookingType] = useState([]);

  // Búsqueda por texto
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Control de interfaz
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Scroll carrusel
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const location = useLocation();

  /**
   * Al cargar la página, si hay parámetros en la URL (?category=),
   * se preseleccionan las categorías correspondientes.
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
   * Filtra las recetas populares en base a los filtros aplicados y texto buscado.
   * @returns {Array<Object>} Recetas filtradas.
   */
  const getFilteredRecipes = () => {
    return popularRecipes.filter((recipe) => {
      const matchCategory = selectedCategory.length === 0 || selectedCategory.includes(recipe.category);
      const matchOrigin = selectedOrigin.length === 0 || selectedOrigin.includes(recipe.origin);
      const matchType = selectedCookingType.length === 0 || selectedCookingType.includes(recipe.type);
      const matchSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchOrigin && matchType && matchSearch;
    });
  };

  const filteredRecipes = getFilteredRecipes();

  /**
   * Aplica la búsqueda basada en el texto ingresado y los filtros seleccionados temporalmente.
   */
  const handleSearch = () => {
    setSearchTerm(searchQuery.trim());
    setSelectedCategory(tempSelectedCategory);
    setSelectedOrigin(tempSelectedOrigin);
    setSelectedCookingType(tempSelectedCookingType);
    setShowAll(true);
  };

  /**
   * Componente para mostrar el encabezado del filtro con toggle.
   * @param {Object} props
   * @param {boolean} props.isOpen - Si el panel de filtros está abierto.
   * @param {Function} props.toggleOpen - Función para abrir/cerrar.
   */
  function FiltroToggle({ isOpen, toggleOpen }) {
    return (
      <div className="flex items-center justify-between w-full px-4 cursor-pointer mb-3" onClick={toggleOpen}>
        <h4 className="text-lg sm:text-xl font-semibold m-0">Filtros</h4>
        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </div>
    );
  }

  // ===================
  // Eventos del Carrusel
  // ===================

  /** @param {MouseEvent} e */
  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftStart(carouselRef.current.scrollLeft);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  /** @param {MouseEvent} e */
  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    carouselRef.current.scrollLeft = scrollLeftStart - walk;
  };

  /** @param {TouchEvent} e */
  const onTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeftStart(carouselRef.current.scrollLeft);
  };

  const onTouchEnd = () => setIsDragging(false);

  /** @param {TouchEvent} e */
  const onTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    carouselRef.current.scrollLeft = scrollLeftStart - walk;
  };

  // ===================
  // Render
  // ===================

  return (
    <div className="min-h-screen flex flex-col justify-start items-start bg-background px-4 pt-15 lg:px-10">
      {/* Buscador */}
      <div className="w-full lg:w-1/2 pr-4">
        <h4 className="text-xl font-bold text-black mb-2">¿Qué quieres cocinar?</h4>
        <div className="w-full max-w-xl border border-black rounded-lg mb-10">
          <div className="flex items-center bg-white rounded-lg px-4 py-3">
            <input
              type="text"
              placeholder="Buscar receta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="outline-none w-full bg-transparent"
            />
            <button onClick={handleSearch}>
              <svg /* ícono de búsqueda */>...</svg>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="w-full flex flex-col md:flex-row items-start gap-8 px-0 md:px-4">
        {/* Filtros */}
        <div className="w-full md:w-1/2">
          <FiltroToggle isOpen={isOpen} toggleOpen={() => setIsOpen(!isOpen)} />
          {isOpen && (
            <>
              <CategoryFilter
                categories={mockCategories}
                initialSelected={tempSelectedCategory}
                onSelectionChange={setTempSelectedCategory}
                title="Categorías"
              />
              <CategoryFilter
                categories={mockTypeCooking}
                initialSelected={tempSelectedCookingType}
                onSelectionChange={setTempSelectedCookingType}
                title="Tipo de cocina"
              />
              <CategoryFilter
                categories={mockOrigin}
                initialSelected={tempSelectedOrigin}
                onSelectionChange={setTempSelectedOrigin}
                title="Origen"
              />
              <div className="flex justify-center">
                <Button className="w-40" onClick={handleSearch}>Buscar</Button>
              </div>
            </>
          )}
        </div>

        {/* Resultados */}
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-center px-1 sm:px-2">
            <h4 className="text-xl font-bold">Recetas populares</h4>
            <h4 className="text-l text-gray-500 cursor-pointer" onClick={() => setShowAll(!showAll)}>
              {showAll ? "Ver menos" : "Ver todas"}
            </h4>
          </div>

          {/* Mostrar como grid o carrusel */}
          {showAll ? (
            filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
