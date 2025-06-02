// src/components/CategoryCheckbox.jsx

import React, { useState, useMemo, startTransition } from 'react';

export default function CategoryCheckbox({
  categories = [],
  initialSelected = [],
  onSelectionChange,
  className = "",
  loading = false,
  title = "Categories",
  maxRowsWhenCollapsed = 4,
  itemsPerRow = 2
}) {
  // Media Query Hook to detect mobile (<768px)
  const useMediaQuery = (query) => {
    return useSyncExternalStore(
      (callback) => {
        const mediaQuery = window.matchMedia(query);
        mediaQuery.addEventListener('change', callback);
        return () => mediaQuery.removeEventListener('change', callback);
      },
      () => window.matchMedia(query).matches
    );
  };

  // Importing useSyncExternalStore from React
  const useSyncExternalStore = React.useSyncExternalStore;

  const [checkedIds, setCheckedIds] = useState(new Set(initialSelected));
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Filter available categories once and maintain order
  const availableCategories = useMemo(
    () => categories.filter(cat => cat.available),
    [categories]
  );

  // Calculate collapse logic
  const maxItemsWhenCollapsed = maxRowsWhenCollapsed * itemsPerRow;
  const needsExpansion = availableCategories.length > maxItemsWhenCollapsed;

  // Determine how many items to show when collapsed
  const itemsToShow = useMemo(() => {
    if (!needsExpansion || isExpanded) return availableCategories.length;
    return maxItemsWhenCollapsed;
  }, [availableCategories.length, isExpanded, needsExpansion, maxItemsWhenCollapsed]);

  // Toggle selection handler
  const handleChange = (id) => {
    startTransition(() => {
      const newChecked = new Set(checkedIds);
      if (newChecked.has(id)) newChecked.delete(id);
      else newChecked.add(id);

      setCheckedIds(newChecked);
      onSelectionChange?.(Array.from(newChecked));
    });
  };

  // Expand/collapse handler
  const handleToggleExpand = () => {
    startTransition(() => {
      setIsExpanded(prev => !prev);
    });
  };

  // Loading skeleton (same for mobile/desktop)
  const renderLoading = () => (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="h-5 bg-gray-200 rounded w-3/4" />
      ))}
    </div>
  );

  // If no categories available
  if (!loading && availableCategories.length === 0) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500 italic">No categories available</p>
      </div>
    );
  }

  // Render content for mobile view (chips)
  const renderMobile = () => {
    if (loading) return renderLoading();

    return (
      <>
        <div className="flex flex-wrap gap-2">
          {availableCategories
            .slice(0, itemsToShow)
            .map(cat => {
              const isChecked = checkedIds.has(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleChange(cat.id)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium transition
                    ${isChecked
                      ? 'bg-gray-500 border border-gray-500 text-white'
                      : 'bg-white border border-black text-black hover:bg-gray-100'}
                  `}
                  aria-pressed={isChecked}
                >
                  {cat.label}
                </button>
              );
            })}
        </div>

        {needsExpansion && (
          <div className="flex justify-center pt-2 border-t border-gray-100">
            <button
              onClick={handleToggleExpand}
              className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
              aria-label={isExpanded ? "Show less categories" : "Show more categories"}
            >
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </>
    );
  };

  // Render content for desktop view (checkbox grid)
  const renderDesktop = () => {
    if (loading) return renderLoading();

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableCategories.slice(0, itemsToShow).map(cat => {
            const isChecked = checkedIds.has(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center gap-3 cursor-pointer group p-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleChange(cat.id)}
                    className="sr-only peer"
                    aria-describedby={`category-${cat.id}`}
                  />
                  <div className={`
                    w-5 h-5 border-2 rounded-sm transition-all duration-200 ease-in-out
                    flex items-center justify-center
                    ${isChecked
                      ? 'bg-white border-black shadow-sm'
                      : 'bg-white border-gray-300 group-hover:border-gray-400'
                    }
                    peer-focus:ring-2 peer-focus:ring-gray-500 peer-focus:ring-offset-2
                    group-hover:shadow-sm
                  `}>
                    <svg
                      className={`
                        w-3 h-3 text-black
                        transition-all duration-200 ease-in-out
                        ${isChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                      `}
                      viewBox="0 0 12 10"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 5l3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <span
                  id={`category-${cat.id}`}
                  className="text-gray-800 font-medium select-none group-hover:text-gray-900 transition-colors duration-200"
                >
                  {cat.label}
                </span>
              </label>
            );
          })}
        </div>

        {needsExpansion && (
          <div className="flex justify-center pt-2 border-t border-gray-100">
            <button
              onClick={handleToggleExpand}
              className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
              aria-label={isExpanded ? "Show less categories" : "Show more categories"}
            >
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Title and Selection Count */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        {title}
        {availableCategories.length > 0 && (
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {checkedIds.size} of {availableCategories.length} selected
          </span>
        )}
      </h3>

      {/* Render Mobile or Desktop */}
      {isMobile ? renderMobile() : renderDesktop()}
    </div>
  );
}
