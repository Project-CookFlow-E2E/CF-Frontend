import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  AddRecipe,
  AdminDashboard,
  Home,
  InspireMe,
  Login,
  Profile,
  Recipe,
  Search,
  Register,
  ShoppingList,
  Landing,
} from "./pages";
import ScrollToTop from "./components/ScrollToTop";
import { Footer } from "./components";
import { Header } from "./components";
import * as authService from "./services/authService";
import { jwtDecode } from "jwt-decode";

const REFRESH_THRESHOLD_SECONDS = 240; //in seconds

// Define the fixed height for the footer when it's active (logged in)
// YOU WILL NEED TO ADJUST THIS VALUE BASED ON YOUR FOOTER'S ACTUAL HEIGHT.
// Measure your fixed footer's height in the browser developer tools and set it here.
const FIXED_FOOTER_HEIGHT_PX = '72px'; // Example: Set this to your footer's exact height

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isTokenValid()
  );
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    let refreshTimer;

    const setupTokenRefresh = () => {
      const accessToken = authService.getToken();
      if (accessToken) {
        try {
          const { exp } = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;
          const expiresIn = exp - currentTime;

          if (expiresIn > 0) {
            const timeToRefresh =
              (expiresIn - REFRESH_THRESHOLD_SECONDS) * 1000;
            const delay = Math.max(1000, timeToRefresh);

            refreshTimer = setTimeout(async () => {
              try {
                await authService.refreshAuthToken();
                setIsAuthenticated(authService.isTokenValid());
                setupTokenRefresh();
              } catch (error) {
                console.error(
                  "Fallo al refrescar token automáticamente, cerrando sesión:",
                  error
                );
                setIsAuthenticated(false);
              }
            }, delay);
          } else {
            console.warn(
              "Token ya expirado. Intentando refrescar inmediatamente o cerrando sesión."
            );
            authService.logout();
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error(
            "Error decodificando token o configurando refresh:",
            error
          );
          authService.logout();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoadingAuth(false);
    };

    const handleAuthChange = () => {
      setIsAuthenticated(authService.isTokenValid());
      clearTimeout(refreshTimer);
      setupTokenRefresh();
    };

    window.addEventListener("authchange", handleAuthChange);
    setupTokenRefresh();

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("authchange", handleAuthChange);
    };
  }, []);

  if (loadingAuth) {
    return <div>Cargando autenticación...</div>;
  }

  return (
    <BrowserRouter data-testid="app-browser-router">
      <Header data-testid="app-header" isAuthenticated={isAuthenticated} />
      <ScrollToTop />
      {/* This div is your main content area.
        When the user is authenticated, the footer is fixed, so we add padding-bottom
        equal to the footer's height to prevent content from going underneath it.
      */}
      <div 
        className="flex-grow" // Ensures this div takes up available vertical space
        style={{ paddingBottom: isAuthenticated ? FIXED_FOOTER_HEIGHT_PX : '0px' }}
      >
        <Routes data-testid="app-routes">
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/main" /> : <Login />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="/recipe/:id" element={<Recipe />} />
          <Route path="/search" element={<Search />} />
          <Route
            path="/inspire-me"
            element={isAuthenticated ? <InspireMe /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-recipe"
            element={isAuthenticated ? <AddRecipe /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin-dashboard"
            element={
              isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/shopping-list"
            element={
              isAuthenticated ? <ShoppingList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/main"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
      <Footer data-testid="app-footer" />
    </BrowserRouter>
  );
}

export default App;