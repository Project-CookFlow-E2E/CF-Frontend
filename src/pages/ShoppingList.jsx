// src/pages/ShoppingList.jsx
/**
 * @file ShoppingList.jsx
 * @description Página de Lista de la Compra. Permite visualizar, marcar, eliminar y limpiar productos de una lista.
 * Utiliza datos mock para simular los elementos de compra.
 *
 * Funcionalidades:
 * - Marcar elementos como completados (checkbox).
 * - Eliminar elementos individualmente.
 * - Vaciar completamente la lista.
 * - Renderizado condicional según si la lista está vacía o no.
 *
 * Componentes utilizados:
 * - HTML nativo + clases utilitarias de TailwindCSS.
 * - Icono SVG para el botón de eliminación.
 *
 * Datos usados:
 * - shoppingListItemsMock: datos simulados importados desde `../data/mockData`.
 */

import React, { useState } from "react";


/**
 * Componente principal de la página de Lista de la Compra.
 *
 * @returns {JSX.Element} La interfaz completa para visualizar y gestionar la lista de la compra.
 */
const ShoppingList = () => {
  const [items, setItems] = useState(() => {
  const saved = localStorage.getItem("shoppingList");
  return saved ? JSON.parse(saved) : [];
});

  /**
   * Alterna el estado de "checked" de un ítem (completado o no).
   *
   * @param {number} id - ID del ítem a actualizar.
   */
  const handleToggleCheck = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  /**
   * Elimina un ítem de la lista por su ID.
   *
   * @param {number} id - ID del ítem a eliminar.
   */
  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  /**
   * Elimina todos los ítems de la lista.
   */
 const handleClearAll = () => {
  setItems([]);
  localStorage.removeItem("shoppingList");
};

  return (
    <div
      className="relative bg-background flex flex-col items-center min-h-screen"
      data-testid="shoppinglist-container"
    >
      <header
        className="w-full flex justify-between items-center p-4 relative z-20 px-6"
        data-testid="shoppinglist-header"
      ></header>

      <div className="w-full max-w-md text-center mb-6" data-testid="shoppinglist-title-container">
        <h1
          className="text-2xl sm:text-3xl font-semibold text-gray-800"
          data-testid="shoppinglist-title"
        >
          Lista de la Compra
        </h1>
      </div>

      <div
        className="flex-grow w-full max-w-md px-4 py-2 flex flex-col justify-between pb-8"
        data-testid="shoppinglist-main-container"
      >
        <main className="w-full" data-testid="shoppinglist-main">
          {items.length > 0 ? (
            <div className="space-y-3" data-testid="shoppinglist-items-container">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-primary rounded-lg shadow-sm"
                  data-testid={`shoppinglist-item-${item.id}`}
                >
                  <div className="flex-grow flex items-center">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleToggleCheck(item.id)}
                      className="w-6 h-6 border-2 rounded cursor-pointer"
                      data-testid={`shoppinglist-checkbox-${item.id}`}
                    />
                    <span
                      className={`ml-3 text-lg ${
                        item.checked
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                      data-testid={`shoppinglist-item-name-${item.id}`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    className="ml-4 p-1 text-gray-500 hover:text-gray-700"
                    aria-label={`Eliminar ${item.name}`}
                    data-testid={`shoppinglist-delete-btn-${item.id}`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              ))}

              {/* Botón para eliminar todo */}
              <button
                className="block mx-auto mt-6 py-2 px-6 border-2 border-gray-400 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition duration-200"
                onClick={handleClearAll}
                data-testid="shoppinglist-clearall-btn"
              >
                Eliminar Todo
              </button>
            </div>
          ) : (
            <p
              className="text-center text-gray-500 text-lg py-8"
              data-testid="shoppinglist-empty-message"
            >
              Tu lista de la compra está vacía.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShoppingList;
