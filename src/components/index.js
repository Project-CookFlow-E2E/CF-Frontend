/**
 * @file index.js
 * @description Barrel file que centraliza las exportaciones de todos los componentes de la aplicación.
 * Permite importar componentes desde una única ruta (`components`) en lugar de especificar la ruta completa.
 *
 * Ejemplo de uso:
 * import { Button, Header, Footer } from '../components';
 */

// Componentes individuales
export { default as Button } from "./Button";
export { default as AutocompleteInput } from "./AutocompleteInput";
export { default as Card } from "./Card";
export { default as CategoryFilter } from "./CategoryFilter";
export { default as Footer } from "./Footer";
export { default as Header } from "./Header";
export { default as Image } from "./Image";
export { default as Input } from "./Input";
export { default as RecipeIngredientsChecklist } from "./RecipeIngredientsChecklist";
export { default as Badge } from "./Badge";
export { default as CheckedLineItem } from "./CheckedLineItem";

// Subcarpeta: UI
export { default as Pagination } from "./ui/Pagination";
