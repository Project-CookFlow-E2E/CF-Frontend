/**
 * @file useRecipeFilters.js
 * @description Hook personalizado para gestionar filtros de recetas por categoría, tipo, origen y texto.
 * Si se selecciona una categoría padre, obtiene automáticamente las subcategorías asociadas desde el backend.
 *
 * @author Saray
 * @modified Ana Castro - Añadido filtrado dinámico por subcategorías y lógica de categoría inicial desde URL.
 */

import React from "react";
import Badge from "./Badge";

const RecipeFiltersPanel = ({ general = [], type = [], origin = [], selected, setSelected }) => (
    <div className="flex flex-col gap-6">
        {/* Categorías generales */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h5 className="font-semibold mb-2">Categorías</h5>
            <div className="flex flex-wrap gap-2">
                {general.length === 0 ? (
                    <span className="text-gray-400">No categories available</span>
                ) : (
                    general.map((cat) => (
                        <Badge
                            key={cat.id}
                            checked={selected.selectedCategory.includes(cat.id)}
                            onChange={() => {
                                if (selected.selectedCategory.includes(cat.id)) {
                                    setSelected.setSelectedCategory(
                                        selected.selectedCategory.filter((id) => id !== cat.id)
                                    );
                                } else {
                                    setSelected.setSelectedCategory([...selected.selectedCategory, cat.id]);
                                }
                            }}
                        >
                            {cat.name}
                        </Badge>
                    ))
                )}
            </div>
        </div>

        {/* Tipos de cocina */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h5 className="font-semibold mb-2">Tipo de cocina</h5>
            <div className="flex flex-wrap gap-2">
                {type.length === 0 ? (
                    <span className="text-gray-400">No categories available</span>
                ) : (
                    type.map((cat) => (
                        <Badge
                            key={cat.id}
                            checked={selected.selectedType.includes(cat.id)}
                            onChange={() => {
                                if (selected.selectedType.includes(cat.id)) {
                                    setSelected.setSelectedType(selected.selectedType.filter((id) => id !== cat.id));
                                } else {
                                    setSelected.setSelectedType([...selected.selectedType, cat.id]);
                                }
                            }}
                            withBorder
                        >
                            {cat.name}
                        </Badge>
                    ))
                )}
            </div>
        </div>

        {/* Origen */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h5 className="font-semibold mb-2">Origen</h5>
            <div className="flex flex-wrap gap-2">
                {origin.length === 0 ? (
                    <span className="text-gray-400">No categories available</span>
                ) : (
                    origin.map((cat) => (
                        <Badge
                            key={cat.id}
                            checked={selected.selectedOrigin.includes(cat.id)}
                            onChange={() => {
                                if (selected.selectedOrigin.includes(cat.id)) {
                                    setSelected.setSelectedOrigin(
                                        selected.selectedOrigin.filter((id) => id !== cat.id)
                                    );
                                } else {
                                    setSelected.setSelectedOrigin([...selected.selectedOrigin, cat.id]);
                                }
                            }}
                        >
                            {cat.name}
                        </Badge>
                    ))
                )}
            </div>
        </div>
    </div>
);

export default RecipeFiltersPanel;
