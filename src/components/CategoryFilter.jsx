import { useState, useMemo, startTransition } from 'react';

export default function CategoryFilter({
  categories = [],
  initialSelected = [],
  onSelectionChange,
  className = "",
  loading = false,
  title = "Categories",
  maxRowsWhenCollapsed = 4,
  itemsPerRow = 2
}) {
  const [checkedIds, setCheckedIds] = useState(new Set(initialSelected));
  const [isExpanded, setIsExpanded] = useState(false);

  const availableCategories = useMemo(
    () => categories.filter(cat => cat.available),
    [categories]
  );

  const maxItemsWhenCollapsed = maxRowsWhenCollapsed * itemsPerRow;
  const needsExpansion = availableCategories.length > maxItemsWhenCollapsed;

  const itemsToShow = useMemo(() => {
    if (!needsExpansion || isExpanded) return availableCategories.length;
    return maxItemsWhenCollapsed;
  }, [availableCategories.length, isExpanded, needsExpansion, maxItemsWhenCollapsed]);

  const handleChange = (id) => {
    startTransition(() => {
      const newChecked = new Set(checkedIds);
      if (newChecked.has(id)) {
        newChecked.delete(id);
      } else {
        newChecked.add(id);
      }

      setCheckedIds(newChecked);
      onSelectionChange?.(Array.from(newChecked));
    });
  };

  const handleToggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  const renderLoading = () => (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: maxItemsWhenCollapsed }, (_, i) => (
        <div key={i} className="h-5 bg-gray-200 rounded w-3/4" />
      ))}
    </div>
  );

  if (!loading && availableCategories.length === 0) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-500 italic">No categories available</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {needsExpansion && (
          <button
            type="button"
            onClick={handleToggleExpand}
            className="flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={isExpanded ? "Collapse categories" : "Expand categories"}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      <div className={`px-4 pb-4 transition-all duration-300 ${
        isExpanded ? 'max-h-[1000px]' : 'max-h-[140px] overflow-hidden'
      }`}>
        {loading ? renderLoading() : (
          <div className="flex flex-wrap gap-2">
            {availableCategories.slice(0, itemsToShow).map(cat => {
              const isChecked = checkedIds.has(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleChange(cat.id)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${isChecked
                      ? 'bg-[#F37A7E] border border-[#F37A7E] text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-gray-50'}
                  `}
                  aria-pressed={isChecked}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
