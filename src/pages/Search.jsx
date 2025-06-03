import { useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';

// Mock data for CategoryFilter component
const mockCategories = [
  { id: 'tech', label: 'Technology', available: true },
  { id: 'design', label: 'Design', available: true },
  { id: 'business', label: 'Business', available: true },
  { id: 'marketing', label: 'Marketing', available: true },
  { id: 'finance', label: 'Finance', available: true },
  { id: 'health', label: 'Health & Wellness', available: true },
  { id: 'education', label: 'Education', available: true },
  { id: 'science', label: 'Science', available: true },
  { id: 'arts', label: 'Arts & Culture', available: true },
  { id: 'sports', label: 'Sports', available: true },
  { id: 'food', label: 'Food & Cooking', available: true },
  { id: 'travel', label: 'Travel', available: true },
  { id: 'lifestyle', label: 'Lifestyle', available: true },
  { id: 'entertainment', label: 'Entertainment', available: true },
  { id: 'news', label: 'News & Politics', available: true },
  { id: 'photography', label: 'Photography', available: true },
  { id: 'music', label: 'Music', available: true },
  { id: 'gaming', label: 'Gaming', available: true },
  { id: 'automotive', label: 'Automotive', available: true },
  { id: 'fashion', label: 'Fashion', available: true }
];

const Search = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
    console.log('Selected categories:', categories);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <CategoryFilter
        categories={mockCategories}
        initialSelected={selectedCategories}
        onSelectionChange={handleCategoryChange}
        title="Categories"
        maxRowsWhenCollapsed={4}
        itemsPerRow={2}
      />
    </div>
  );
};

export default Search;