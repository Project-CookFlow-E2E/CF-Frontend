// /src/data/mockData.js

// ========= Search‐related mock data =========
export const popularRecipes = [
  {
    id: 1,
    image: "/pasta.jpg",
    name: "Pasta Carbonara",
    category: "comida",
    origin: "italia",
    type: "cocido",
    time: "30",
  },
  {
    id: 2,
    image: "/salad.jpg",
    name: "Ensalada rica",
    category: "cena",
    origin: "grecia",
    type: "frito",
    time: "15",
  },
  {
    id: 3,
    image: "/soup.jpg",
    name: "Sopa de calabaza",
    category: "cena",
    origin: "españa",
    type: "sopa",
    time: "20",
  },
  {
    id: 4,
    image: "/pancakes.jpg",
    name: "Tortitas",
    category: "desayuno",
    origin: "americana",
    type: "plancha",
    time: "25",
  },
  {
    id: 5,
    image: "/tortilla.jpg",
    name: "Tortilla de patata",
    category: "comida",
    origin: "españa",
    type: "frito",
    time: "45",
  },
  {
    id: 6,
    image: "/sushi.jpeg",
    name: "Sushi",
    category: "cena",
    origin: "japonesa",
    type: "crudo",
    time: "55",
  },
];

export const mockCategories = [
  { id: "comida", label: "Comida", available: true },
  { id: "desayuno", label: "Desayuno", available: true },
  { id: "cena", label: "Cena", available: true },
  { id: "merienda", label: "Merienda", available: true },
  { id: "snack", label: "Snack", available: true },
];

export const mockOrigin = [
  { id: "italia", label: "Italiana", available: true },
  { id: "grecia", label: "Griega", available: true },
  { id: "españa", label: "Española", available: true },
  { id: "japon", label: "Japonesa", available: true },
  { id: "americana", label: "Americana", available: true },
];

export const mockTypeCooking = [
  { id: "cocido", label: "Cocido", available: true },
  { id: "vapor", label: "Al vapor", available: true },
  { id: "hervido", label: "Hervido", available: true },
  { id: "guiso", label: "Guiso", available: true },
  { id: "frito", label: "Frito", available: true },
  { id: "plancha", label: "A la plancha", available: true },
  { id: "asado", label: "Asado", available: true },
  { id: "sopa", label: "Sopas", available: true },
  { id: "crudo", label: "Crudo", available: true },
];

// ========= Other existing mocks (unchanged) =========
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
  { id: 1, name: "Sal", checked: false },
  { id: 2, name: "Pimienta", checked: false },
  { id: 3, name: "Harina", checked: false },
];

// /src/data/mockData.js

// … (other exports above stay the same) …

export const mockRecipes = [
  {
    id: 1,
    name: "Mediterranean Quinoa Bowl",
    description:
      "A healthy and colorful bowl packed with fresh vegetables, quinoa, and Mediterranean flavors",
    user_id: 1,
    category_id: 1,
    duration_minutes: 25,
    commensals: 2,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    // Additional fields for frontend
    image_url:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    // category is uppercase, but getFilteredRecipes does `.toLowerCase()`
    category: "COMIDA",
    origin: "italia", // <— added
    type: "cocido", // <— added
    is_favorite: false,
    isCreatedByUser: true,
    ingredients: [
      { id: 1, name: "Quinoa", quantity: 1, unit: "cup" },
      { id: 2, name: "Cherry Tomatoes", quantity: 200, unit: "g" },
      { id: 3, name: "Cucumber", quantity: 1, unit: "piece" },
      { id: 4, name: "Feta Cheese", quantity: 100, unit: "g" },
    ],
  },
  {
    id: 2,
    name: "Spicy Thai Basil Stir-fry",
    description:
      "Quick and flavorful stir-fry with fresh basil and a perfect balance of heat",
    user_id: 2,
    category_id: 2,
    duration_minutes: 15,
    commensals: 3,
    created_at: "2024-01-16T14:20:00Z",
    updated_at: "2024-01-16T14:20:00Z",
    image_url:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop",
    category: "CENA",
    origin: "asiatica", // <— added (for example, you might add “asiatica” to your mockOrigin array if you want)
    type: "plancha", // <— added
    is_favorite: true,
    isCreatedByUser: false,
    ingredients: [
      { id: 5, name: "Chicken Breast", quantity: 300, unit: "g" },
      { id: 6, name: "Thai Basil", quantity: 1, unit: "bunch" },
      { id: 7, name: "Garlic", quantity: 3, unit: "cloves" },
      { id: 8, name: "Soy Sauce", quantity: 2, unit: "tbsp" },
    ],
  },
  {
    id: 3,
    name: "Classic Margherita Pizza",
    description:
      "Traditional Italian pizza with fresh mozzarella, tomatoes, and basil",
    user_id: 1,
    category_id: 2,
    duration_minutes: 45,
    commensals: 4,
    created_at: "2024-01-17T18:00:00Z",
    updated_at: "2024-01-17T18:00:00Z",
    image_url:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    category: "CENA",
    origin: "italia", // <— added
    type: "asado", // <— added
    is_favorite: false,
    isCreatedByUser: true,
    ingredients: [
      { id: 9, name: "Pizza Dough", quantity: 1, unit: "piece" },
      { id: 10, name: "Mozzarella", quantity: 200, unit: "g" },
      { id: 11, name: "Tomato Sauce", quantity: 150, unit: "ml" },
      { id: 12, name: "Fresh Basil", quantity: 10, unit: "leaves" },
    ],
  },
  {
    id: 4,
    name: "Creamy Mushroom Risotto",
    description:
      "Rich and creamy Italian risotto with mixed mushrooms and parmesan",
    user_id: 3,
    category_id: 2,
    duration_minutes: 35,
    commensals: 2,
    created_at: "2024-01-18T19:30:00Z",
    updated_at: "2024-01-18T19:30:00Z",
    image_url:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop",
    category: "CENA",
    origin: "italia", // <— added
    type: "hervido", // <— added
    is_favorite: false,
    isCreatedByUser: false,
    ingredients: [
      { id: 13, name: "Arborio Rice", quantity: 200, unit: "g" },
      { id: 14, name: "Mixed Mushrooms", quantity: 300, unit: "g" },
      { id: 15, name: "Vegetable Stock", quantity: 1, unit: "L" },
      { id: 16, name: "Parmesan", quantity: 50, unit: "g" },
    ],
  },
  {
    id: 5,
    name: "Chocolate Chip Cookies",
    description:
      "Soft and chewy homemade cookies with plenty of chocolate chips",
    user_id: 2,
    category_id: 3,
    duration_minutes: 30,
    commensals: 6,
    created_at: "2024-01-19T16:45:00Z",
    updated_at: "2024-01-19T16:45:00Z",
    image_url:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
    category: "POSTRE",
    origin: "americana", // <— added
    type: "horno", // <— added (assuming “horno” exists in your mockTypeCooking)
    is_favorite: true,
    isCreatedByUser: true,
    ingredients: [
      { id: 17, name: "Flour", quantity: 250, unit: "g" },
      { id: 18, name: "Chocolate Chips", quantity: 150, unit: "g" },
      { id: 19, name: "Butter", quantity: 100, unit: "g" },
      { id: 20, name: "Brown Sugar", quantity: 100, unit: "g" },
    ],
  },
  {
    id: 6,
    name: "Green Smoothie Bowl",
    description:
      "Nutritious breakfast bowl with spinach, banana, and fresh toppings",
    user_id: 1,
    category_id: 4,
    duration_minutes: 10,
    commensals: 1,
    created_at: "2024-01-20T08:15:00Z",
    updated_at: "2024-01-20T08:15:00Z",
    image_url:
      "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop",
    category: "DESAYUNO",
    origin: "españa", // <— added
    type: "crudo", // <— added
    is_favorite: false,
    isCreatedByUser: false,
    ingredients: [
      { id: 21, name: "Spinach", quantity: 100, unit: "g" },
      { id: 22, name: "Banana", quantity: 2, unit: "pieces" },
      { id: 23, name: "Almond Milk", quantity: 200, unit: "ml" },
      { id: 24, name: "Chia Seeds", quantity: 1, unit: "tbsp" },
    ],
  },
  {
    id: 7,
    name: "Beef Tacos",
    description: "Flavorful ground beef tacos with fresh toppings and lime",
    user_id: 3,
    category_id: 1,
    duration_minutes: 20,
    commensals: 4,
    created_at: "2024-01-21T12:30:00Z",
    updated_at: "2024-01-21T12:30:00Z",
    image_url:
      "https://cdn.pixabay.com/photo/2023/08/08/08/46/tacos-8176774_1280.jpg",
    category: "COMIDA",
    origin: "americana", // <— added
    type: "frito", // <— added
    is_favorite: true,
    isCreatedByUser: true,
    ingredients: [
      { id: 25, name: "Ground Beef", quantity: 400, unit: "g" },
      { id: 26, name: "Taco Shells", quantity: 8, unit: "pieces" },
      { id: 27, name: "Lettuce", quantity: 1, unit: "head" },
      { id: 28, name: "Lime", quantity: 2, unit: "pieces" },
    ],
  },
  {
    id: 8,
    name: "Swamp Soup",
    description: "A mysterious and hearty soup with green vegetables and herbs",
    user_id: 2,
    category_id: 1,
    duration_minutes: 40,
    commensals: 4,
    created_at: "2024-01-22T17:00:00Z",
    updated_at: "2024-01-22T17:00:00Z",
    image_url: "https://static.wixstatic.com/media/ad2ede_23c1f196a09f4b36b0846c2c88bf53b0~mv2.jpg/v1/fill/w_402,h_537,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ad2ede_23c1f196a09f4b36b0846c2c88bf53b0~mv2.jpg",
    category: "COMIDA",
    origin: "españa", // <— added
    type: "sopa", // <— added
    is_favorite: false,
    isCreatedByUser: false,
    ingredients: [
      { id: 29, name: "Broccoli", quantity: 300, unit: "g" },
      { id: 30, name: "Spinach", quantity: 200, unit: "g" },
      { id: 31, name: "Vegetable Broth", quantity: 1, unit: "L" },
      { id: 32, name: "Herbs", quantity: 2, unit: "tbsp" },
    ],
  },
];

// Mock users data
export const mockUsers = [
  {
    id: 1,
    username: "chef_maria",
    email: "maria@example.com",
    name: "Maria",
    surname: "Rodriguez",
    is_admin: false,
    biography: "Home cook passionate about Mediterranean cuisine",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    username: "asian_fusion",
    email: "alex@example.com",
    name: "Alex",
    surname: "Chen",
    is_admin: false,
    biography: "Specializing in Asian fusion dishes",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    username: "italian_nonna",
    email: "giulia@example.com",
    name: "Giulia",
    surname: "Rossi",
    is_admin: true,
    biography: "Traditional Italian recipes passed down through generations",
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
  },
];
