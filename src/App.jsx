import { AddRecipe, AdminDashboard, Home, InspireMe, Login, Profile, Recipe, Search, SignUp, ShoppingList, Landing } from './pages'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { setGlobalNavigateFunction } from './main';
import { Footer } from './components';
import { Header } from './components';
import { useEffect } from 'react';

const NavigationSetter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setGlobalNavigateFunction(navigate);
  }, [navigate]);

  return null;
};

function App() {
  return (
    <BrowserRouter data-testid="app-browser-router">
      <Header data-testid="app-header" />
      <Routes data-testid="app-routes">
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
        <Route path="/main" element={<Landing />} />
      </Routes>
      <Footer data-testid="app-footer" />
    </BrowserRouter>
  );
}

export default App;
