// src/pages/ShoppingList.jsx

import React, { useState } from 'react';
// IMPORTANTE: Ahora importamos Badge desde la carpeta 'components'
// gracias a tu archivo src/components/index.js
import { Badge } from '../components';
import { shoppingListItemsMock } from '../data/mockData';

const ShoppingList = () => {
  const items = shoppingListItemsMock; 

  const handleToggleCheck = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
  };

  const handleLetsCook = () => {
    console.log("¡Botón 'Let's Cook!' clickeado!");
    alert("¡A cocinar!");
  };

  return (
    <div className="border">
      <header className="">
        <button className="" onClick={() => console.log("Botón de volver clickeado")}>&lt;</button>
        <h1>Grocery List</h1>
        <div className=""></div>
      </header>

      <main className="">
        {items.length > 0 ? (
          <div className="">
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => handleToggleCheck(item.id)}
                onDelete={() => handleDeleteItem(item.id)}
                isChecked={item.checked}
              >
                <span className="">{item}</span>
                <span className="">{item.quantity}</span>

              </div>
            ))}
            <button className="" onClick={handleClearAll}>Clear all</button>
          </div>
        ) : (
          <p className="">Tu lista de la compra está vacía.</p>
        )}
      </main>

      <footer className="">
        <button className="" onClick={handleLetsCook}>Let's Cook!</button>
      </footer>

      <nav className="">
        <button className="">
          <span role="img" aria-label="recipe">🍽️</span>
          Recipe
        </button>
        <button className="">
          <span>+</span>
          Add Recipe
        </button>
        <button className="">
          <span role="img" aria-label="profile">👤</span>
          Profile
        </button>
      </nav>
    </div>
  );
};

export default ShoppingList;