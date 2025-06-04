const mockRecipes = [
  {
    id: 1,
    name: "Spicy Carbonara",
    description: "Creamy pasta with a spicy kick",
    duration_minutes: 20,
    commensals: 4,
    category_id: 5,
    user_id: 1,
    created_at: "2023-06-01T12:00:00Z",
    updated_at: "2023-06-01T12:00:00Z",
    // Image data from images table
    image_url: "https://images.unsplash.com/photo-1598866594230-a7c12756260f",
    // Favorites data placeholder
    is_favorite: false
  },
  {
    id: 2,
    name: "Veggie Tacos",
    description: "Fresh vegetable tacos with lime",
    duration_minutes: 15,
    commensals: 2,
    category_id: 3,
    user_id: 2,
    created_at: "2023-06-02T10:30:00Z",
    updated_at: "2023-06-02T10:30:00Z",
    image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
    is_favorite: false
  },
  {
    id: 3,
    name: "Chocolate Soufflé",
    description: "Decadent chocolate dessert",
    duration_minutes: 30,
    commensals: 6,
    category_id: 8,
    user_id: 3,
    created_at: "2023-06-03T14:15:00Z",
    updated_at: "2023-06-03T14:15:00Z",
    image_url: "https://images.unsplash.com/photo-1603532648955-a039f2ecc170",
    is_favorite: false
  }
];

export default mockRecipes;