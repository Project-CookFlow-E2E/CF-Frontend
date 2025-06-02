// src/pages/Search.jsx

import { useState } from 'react';
import CategoryCheckbox from '../components/CategoryCheckbox';

// Please note: This page has mock data for viewing Category Checkbox Component
// Remove the mock data when connecting the backend with this

const sampleCategories = [
  { id: 'books',      label: 'Books',       available: true  },
  { id: 'electronics',label: 'Electronics', available: true  },
  { id: 'clothing',   label: 'Clothing',    available: true  },
  { id: 'furniture',  label: 'Furniture',   available: false },
  { id: 'toys',       label: 'Toys',        available: true  },
  { id: 'sports',     label: 'Sports',      available: true  },
  { id: 'beauty',     label: 'Beauty',      available: true  },
  { id: 'automotive', label: 'Automotive',  available: true  },
];

const Search = () => {
  const [selectedIds, setSelectedIds] = useState(['books', 'toys']);

  const handleSelectionChange = (newIds) => {
    setSelectedIds(newIds);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search Page (Category Filter Demo)</h1>

      <CategoryCheckbox
        categories={sampleCategories}
        initialSelected={selectedIds}
        onSelectionChange={handleSelectionChange}
        title="Product Categories"
        loading={false}
        maxRowsWhenCollapsed={2}
        itemsPerRow={2}
      />

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">Currently Selected:</h2>
        {selectedIds.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {selectedIds.map(id => {
              const cat = sampleCategories.find(c => c.id === id);
              return (
                <li key={id} className="text-gray-700">
                  {cat?.label || id}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No categories selected.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
