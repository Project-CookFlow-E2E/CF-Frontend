// src/pages/ShoppingList.jsx

import React, { useState } from "react";
import { shoppingListItemsMock } from "../data/mockData";

const ShoppingList = () => {
  const [items, setItems] = useState(shoppingListItemsMock);

  const handleToggleCheck = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
  };

  const handleLetsCook = () => {
    console.log("¡Botón 'Let's Cook!' clickeado!");
    alert("¡A cocinar!");
  };

  return (
    // Contenedor principal con el fondo especificado y configuración flexbox
    <div className="relative min-h-screen bg-background flex flex-col items-center">
      {/* Barra superior de estado (simulación) */}
      {/* Esta div se mantiene según tus instrucciones anteriores */}
      {/* <div className="w-full h-8 bg-white/70 backdrop-blur-sm" /> */}

      {/* HEADER COMPLETO - ¡Ahora estará vacío como en la imagen_416678.png! */}
      {/* El header seguirá existiendo como contenedor para el espacio, pero su contenido interno se elimina */}
      <header className="w-full flex justify-between items-center p-4 relative z-20 px-6">
        {/* Aquí estaba el div con el texto "CookFlow" que vamos a eliminar */}
        {/* <div className="flex items-center space-x-2">
          <span className="text-gray-800 text-3xl font-serif italic font-bold">CookFlow</span>
        </div> */}

        {/* Aquí estaba el botón "Mi Perfil" que también vamos a eliminar */}
        {/* <button
          className="bg-rose-300 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-rose-400 transition duration-200 ease-in-out"
          onClick={() => console.log("Botón Mi Perfil clickeado")}
          aria-label="Mi Perfil"
        >
          Mi Perfil
        </button> */}
      </header>

      {/* Título "Grocery List" centrado */}
      <div className="w-full max-w-md text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Grocery List
        </h1>
      </div>

      {/* Contenedor para el contenido principal, sin el botón Let's Cook! y sin la barra de navegación inferior */}
      <div className="flex-grow w-full max-w-md px-4 py-2 flex flex-col justify-between pb-8">
        {/* Main Content (la lista de la compra y Clear all) */}
        <main className="w-full">
          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-amber-50 rounded-lg shadow-sm"
                >
                  {/* Sección de checkbox, nombre y cantidad */}
                  <div
                    onClick={() => handleToggleCheck(item.id)}
                    className="flex-grow flex items-center cursor-pointer"
                  >
                    {/* Checkbox estilizado para parecerse a la imagen */}
                    <div
                      className={`w-6 h-6 border-2 rounded flex items-center justify-center ${
                        item.checked ? "bg-gray-700 border-gray-700" : "border-gray-400"
                      }`}
                    >
                      {item.checked && (
                        <svg
                          className="w-4 h-4 text-amber-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      )}
                    </div>
                    <span
                      className={`ml-3 text-lg ${
                        item.checked ? "line-through text-gray-500" : "text-gray-800"
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="ml-auto text-lg text-gray-600 font-medium">
                      {item.quantity}
                    </span>
                  </div>
                  {/* Botón de eliminar (papelera) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Evita el toggle al hacer clic en la papelera
                      handleDeleteItem(item.id);
                    }}
                    className="ml-4 p-1 text-gray-500 hover:text-gray-700"
                    aria-label={`Eliminar ${item.name}`}
                  >
                    {/* Icono de papelera */}
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
              {/* Botón Clear all */}
              <button
                className="block mx-auto mt-6 py-2 px-6 border-2 border-gray-400 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition duration-200"
                onClick={handleClearAll}
              >
                Clear all
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg py-8">
              Tu lista de la compra está vacía.
            </p>
          )}
        </main>

        {/* Footer / Call to Action (Let's Cook!) - Ya estaba eliminado */}
      </div>

      {/* Navigation - Fijo en la parte inferior - Ya estaba eliminado */}
    </div>
  );
};

export default ShoppingList;