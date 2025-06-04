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
    <div className="flex items-center justify-between w-full px-4 cursor-pointer mb-3" onClick={toggleOpen}>
      <h4 className="text-lg sm:text-xl font-semibold m-0">
      Filtros
      </h4>

     {isOpen ? (
        <Minus className="w-5 h-5" />
      ) : (
        <Plus className="w-5 h-5" />
      )}
    </div>
  );
}


  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-[#FDF3E8] px-4 pt-50">
      
      <div className="w-full max-w-screen-lg mx-auto px-4">
        <h4 className="text-xl font-bold text-black mb-2">¿Qué quieres cocinar?</h4>
        <div className="w-full border border-black rounded-lg mb-15">
          <Input placeholder="Correo electrónico" type="email" icon={SearchIcon} className="w-full"/>
        </div>
      </div>

      {/* Pasa estado y función al toggle */}
      <FiltroToggle
        isOpen={isOpen}
        toggleOpen={() => setIsOpen(!isOpen)}
      />

      {/*Categorias filtros*/}
      <div> 
        {/* Muestra CategoryFilter solo si isOpen es true */}
      {isOpen && (
        <CategoryFilter
          categories={mockCategories}
          initialSelected={selectedCategories}
          onSelectionChange={handleCategoryChange}
          title="Categories"
          maxRowsWhenCollapsed={4}
          itemsPerRow={2}
          className= "mb-6"
        /> 
      )}

      {isOpen && (
        <CategoryFilter
          categories={mockTypeCooking}
          initialSelected={selectedCategories}
          onSelectionChange={handleCategoryChange}
          title="Tipo de cocina"
          maxRowsWhenCollapsed={4}
          itemsPerRow={2}
          className= "mb-6"
        /> 
      )}

      {isOpen && (
        <CategoryFilter
          categories={mockOrigin}
          initialSelected={selectedCategories}
          onSelectionChange={handleCategoryChange}
          title="Origen"
          maxRowsWhenCollapsed={4}
          itemsPerRow={2}
          className= "mb-6"
        /> 
      )}
      </div>

      <div className="w-full max-w-screen-lg mx-auto px-4">
        <h4 className="text-xl font-bold text-black mb-2">Recetas populares</h4>
        
      </div>
    </div>
    
  );
};

export default Search;
