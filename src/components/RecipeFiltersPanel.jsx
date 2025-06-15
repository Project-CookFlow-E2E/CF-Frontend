/**
 * @file RecipeFiltersPanel.jsx
 * @description Componente que agrupa y renderiza los filtros de recetas por categoría, tipo de cocina y origen.
 * Permite seleccionar múltiples opciones por grupo y devuelve las selecciones al componente padre.
 *
 * @component RecipeFiltersPanel
 * @param {Object} props
 * @param {Array<Object>} props.general - Lista de categorías generales formateadas.
 * @param {Array<Object>} props.type - Lista de tipos de cocina formateadas.
 * @param {Array<Object>} props.origin - Lista de orígenes formateadas.
 * @param {Object} props.selected - Objeto con arrays de IDs seleccionados por grupo.
 * @param {Object} props.setSelected - Objeto con funciones setter para actualizar las selecciones.
 *
 * @returns {JSX.Element} Panel visual de filtros interactivos.
 *
 * @author Ana Castro basado en el codigo de Saray en Search.jsx
 */

import CategoryFilter from "../components/CategoryFilter";

const RecipeFiltersPanel = ({
  general = [],
  type = [],
  origin = [],
  selected,
  setSelected,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <CategoryFilter
        categories={general}
        initialSelected={selected.selectedCategory}
        onSelectionChange={setSelected.setSelectedCategory}
        title="Categorías"
        maxRowsWhenCollapsed={4}
        itemsPerRow={2}
      />

      <CategoryFilter
        categories={type}
        initialSelected={selected.selectedType}
        onSelectionChange={setSelected.setSelectedType}
        title="Tipo de cocina"
        maxRowsWhenCollapsed={4}
        itemsPerRow={2}
      />

      <CategoryFilter
        categories={origin}
        initialSelected={selected.selectedOrigin}
        onSelectionChange={setSelected.setSelectedOrigin}
        title="Origen"
        maxRowsWhenCollapsed={4}
        itemsPerRow={2}
      />
    </div>
  );
};

export default RecipeFiltersPanel;
