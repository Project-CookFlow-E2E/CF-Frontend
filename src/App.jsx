import { AddRecipe, AdminDashboard, Home, InspireMe, Login, Profile, Recipe, Search, SignUp, ShoppingList } from './pages'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from './components';
import { Header } from './components';
import { FavoritesProvider } from './contexts/FavoritesProvider';


function App() {

  return (
    <FavoritesProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recipe/:id" element={<Recipe />} />
          <Route path="/search" element={<Search />} />
          <Route path="/inspire-me" element={<InspireMe />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </FavoritesProvider>
  )
}

export default App
