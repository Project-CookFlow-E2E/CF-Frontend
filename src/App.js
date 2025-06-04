// src/App.js
import React, { useState } from "react";
// IMPORTANTE: Ahora importamos Home, Search y ShoppingList desde la carpeta 'pages'
// gracias a tu archivo src/pages/index.js
import { Home, Search, ShoppingList } from "./pages"; // ¡Importa desde el index de pages!
import "./App.css";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cook Flow</h1>
        <nav>
          <button
            onClick={() => setCurrentPage("home")}
            className={currentPage === "home" ? "active" : ""}
          >
            Inicio
          </button>
          <button
            onClick={() => setCurrentPage("search")}
            className={currentPage === "search" ? "active" : ""}
          >
            Buscar Recetas
          </button>
          <button
            onClick={() => setCurrentPage("shoppingList")}
            className={currentPage === "shoppingList" ? "active" : ""}
          >
            Lista de Compras
          </button>
        </nav>
      </header>

      <main className="App-content">
        {currentPage === "home" && <Home />}
        {currentPage === "search" && <Search />}
        {currentPage === "shoppingList" && <ShoppingList />}
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 Cook Flow - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default App;