import { useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import { Input, Boton } from '../components';
import { Plus, Minus } from "lucide-react";

// Mock data for CategoryFilter component
const mockCategories = [
  { id: 'comida', label: 'Comida', available: true },
  { id: 'desayuno', label: 'Desayuno', available: true },
  { id: 'cena', label: 'Cena', available: true },
  { id: 'merienda', label: 'Merienda', available: true },
  { id: 'snack', label: 'Snack', available: true }

];

// const mockOrigin = [
//   { id: 'italia', label: 'Italiana', available: true },
//   { id: 'grecia', label: 'Griega', available: true },
//   { id: 'españa', label: 'Española', available: true },
//   { id: 'corea', label: 'Coreana', available: true },
//   { id: 'inglaterra', label: 'Inglesa', available: true }

// ];

// const mockTypeCooking = [
//   { id: 'cocido', label: 'Cocido', available: true },
//   { id: 'vapor', label: 'Al vapor', available: true },
//   { id: 'hervido', label: 'Hervido', available: true },
//   { id: 'guiso', label: 'Guiso', available: true },
//   { id: 'frito', label: 'Frito', available: true },
//   { id: 'plancha', label: 'A la plancha', available: true },
//   { id: 'asado', label: 'Asado', available: true }

// ];

const Search = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Estado para toggle filtros

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
    console.log('Selected categories:', categories);
  };

  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
  );


  function FiltroToggle({ isOpen, toggleOpen }) {
    return (
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={toggleOpen}
      >
        <h4 className="text-lg sm:text-xl font-semibold m-0">
          Filtros
        </h4>

        {isOpen ? (
          <Minus className="w-5 h-5 -mt-1 ml-auto" />
        ) : (
          <Plus className="w-5 h-5 -mt-1 ml-auto" />
        )}
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h4 className="text-2xl mb-4 font-bold text-black">¿Qué quieres cocinar?</h4>

      <div className="peer border border-black rounded-lg mb-15">
        <Input placeholder="Correo electrónico" type="email" icon={SearchIcon} />
      </div>

      {/* Pasa estado y función al toggle */}
      <FiltroToggle
        isOpen={isOpen}
        toggleOpen={() => setIsOpen(!isOpen)}
      />

      {/* Muestra CategoryFilter solo si isOpen es true */}
      {isOpen && (
        <CategoryFilter
          categories={mockCategories}
          initialSelected={selectedCategories}
          onSelectionChange={handleCategoryChange}
          title="Categories"
          maxRowsWhenCollapsed={4}
          itemsPerRow={2}
        />
        
      )}
    </div>
  );
};

export default Search;
