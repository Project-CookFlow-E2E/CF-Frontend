// src/data/mockData.js

export const categoriasMock = [
  "Desayuno",
  "Almuerzo",
  "Cena",
  "Merienda",
  "Postre",
];

export const ingredientesMock = [
  "Huevos",
  "Leche",
  "Harina",
  "Azúcar",
  "Mantequilla",
  "Plátano",
  "Chocolate",
];

export const shoppingListItemsMock = [
  "Sal",
  "Pimienta",
  "Harina",
  "Zanahoria",
].map((name, index) => ({
  id: index + 1,
  name,
  checked: false,
  quantity: "1", // Puedes personalizar esto más adelante
}));
