import { useState, useRef } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import { Input } from '../components';
import { Plus, Minus } from "lucide-react";
import Card from '../components/Card';
import Button from '../components/Button';

// Mock data para las recetas
const popularRecipes = [
  { id: 1, image: "/pasta.jpg", name: "Pasta Carbonara", category: "Comida", time: "30 m" },
  { id: 2, image: "/salad.jpg", name: "Ensalada rica", category: "Cena", time: "15 m" },
  { id: 3, image: "/soup.jpg", name: "Sop de calabaza", category: "Cena", time: "20 m" },
  { id: 4, image: "/pancakes.jpg", name: "Tortitas", category: "Desayuno", time: "25 m" },
  { id: 5, image: "/tortilla.jpg", name: "Tortilla de patata", category: "Comida", time: "45 m" },
  { id: 6, image: "/sushi.jpeg", name: "Sushi", category: "Cena", time: "55 m" },
];

const mockCategories = [
  { id: 'comida', label: 'Comida', available: true },
  { id: 'desayuno', label: 'Desayuno', available: true },
  { id: 'cena', label: 'Cena', available: true },
  { id: 'merienda', label: 'Merienda', available: true },
  { id: 'snack', label: 'Snack', available: true }
];

const mockOrigin = [
  { id: 'italia', label: 'Italiana', available: true },
  { id: 'grecia', label: 'Griega', available: true },
  { id: 'españa', label: 'Española', available: true },
  { id: 'corea', label: 'Coreana', available: true },
  { id: 'inglaterra', label: 'Inglesa', available: true }
];

const mockTypeCooking = [
  { id: 'cocido', label: 'Cocido', available: true },
  { id: 'vapor', label: 'Al vapor', available: true },
  { id: 'hervido', label: 'Hervido', available: true },
  { id: 'guiso', label: 'Guiso', available: true },
  { id: 'frito', label: 'Frito', available: true },
  { id: 'plancha', label: 'A la plancha', available: true },
  { id: 'asado', label: 'Asado', available: true }
];

const Search = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const carouselRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
  };

  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
  );

  function FiltroToggle({ isOpen, toggleOpen }) {
    return (
      <div className="flex items-center justify-between w-full px-4 cursor-pointer mb-3" onClick={toggleOpen}>
        <h4 className="text-lg sm:text-xl font-semibold m-0">Filtros</h4>
        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </div>
    );
  }

  // Handlers para scroll en carousel
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

  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-[#FDF3E8] px-4 pt-6">
      <div className="w-full max-w-screen-lg mx-auto px-4">
        <h4 className="text-xl font-bold text-black mb-2">¿Qué quieres cocinar?</h4>
        <div className="w-full border border-black rounded-lg mb-10">
          <Input placeholder="Correo electrónico" type="email" icon={SearchIcon} className="w-full" />
        </div>
      </div>

      <FiltroToggle isOpen={isOpen} toggleOpen={() => setIsOpen(!isOpen)} />
      <div>
        {isOpen && (
          <>
            <CategoryFilter categories={mockCategories} initialSelected={selectedCategories} onSelectionChange={handleCategoryChange} title="Categories" maxRowsWhenCollapsed={4} itemsPerRow={2} className="mb-6" />
            <CategoryFilter categories={mockTypeCooking} initialSelected={selectedCategories} onSelectionChange={handleCategoryChange} title="Tipo de cocina" maxRowsWhenCollapsed={4} itemsPerRow={2} className="mb-6" />
            <CategoryFilter categories={mockOrigin} initialSelected={selectedCategories} onSelectionChange={handleCategoryChange} title="Origen" maxRowsWhenCollapsed={4} itemsPerRow={2} className="mb-6" />
            <div className="flex justify-center">
              <Button
                className="mb-3 w-40 px-1"
                onClick={() => setShowAll(true)} 
              >
                Buscar
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Recetas populares */}
      <div className="w-full max-w-screen-lg mx-auto px-4 mt-6">
        <div className="flex justify-between items-center px-1 sm:px-2 mb-1.5">
          <h4 className="text-xl font-bold text-black">Recetas populares</h4>
          <h4
            className="text-l text-gray-500 cursor-pointer"
            onClick={() => setShowAll(!showAll)} // Toggle normal para activar/desactivar
          >
            {showAll ? "Ver menos" : "Ver todas"}
          </h4>
        </div>

        {showAll ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularRecipes.map(recipe => (
                <Card key={recipe.id} {...recipe} />
              ))}
            </div>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth py-2 cursor-grab"
              style={{ scrollSnapType: 'x mandatory' }}
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onTouchMove={onTouchMove}
            >
              {popularRecipes.map(recipe => (
                <div key={recipe.id} style={{ scrollSnapAlign: 'start' }}>
                  <Card {...recipe} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
