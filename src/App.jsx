import { AddRecipe, AdminDashboard, Home, InspireMe, Login, Profile, Recipe, Search, SignUp, ShoppingList, Landing } from './pages'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from './components';
import { Header } from './components';
import {useAuthStore} from './store/useAuthStore';


function App() {

  return (
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
          <Route path="/main" element={<Landing/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
  )
}

export default App