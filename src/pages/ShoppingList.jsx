// src/pages/ShoppingList.jsx

import React, { useState } from "react";
import { shoppingListItemsMock } from "../data/mockData";

const ShoppingList = () => {
  const [items, setItems] = useState(shoppingListItemsMock);

  const handleToggleCheck = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
  };

  return (
    <div className="relative bg-background flex flex-col items-center min-h-screen">
      <header className="w-full flex justify-between items-center p-4 relative z-20 px-6"></header>

      <div className="w-full max-w-md text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          
          Lista de la Compra
        </h1>
      </div>

      <div className="flex-grow w-full max-w-md px-4 py-2 flex flex-col justify-between pb-8">
        <main className="w-full">
          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-primary rounded-lg shadow-sm"

                >
                  <div className="flex-grow flex items-center">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleToggleCheck(item.id)}
                      className="w-6 h-6 border-2 rounded cursor-pointer"
                    />
                    <span
                      className={`ml-3 text-lg ${
                        item.checked
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {item.name}
                    </span>
                    {/* <span className="ml-auto text-lg text-gray-600 font-medium">
                      {item.quantity}
                    </span> */}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    className="ml-4 p-1 text-gray-500 hover:text-gray-700"
                    aria-label={`Eliminar ${item.name}`}
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
              <button
                className="block mx-auto mt-6 py-2 px-6 border-2 border-gray-400 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition duration-200"
                onClick={handleClearAll}
              >
               
                Eliminar Todo
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg py-8">
              Tu lista de la compra está vacía.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShoppingList;