import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button"; // Ajusta la ruta según tu estructura
import { useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("saved"); // 'saved' o 'myRecipes'

  const handleGoToDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    // Eliminamos la clase bg-background o bg-primary-light de aquí, ya que App.jsx la maneja
    <div className="container mx-auto p-6"> 
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-5xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Emma González</h1>
          <p className="text-gray-600 mt-2">
            Emma González es editora adjunta en Cheffly, y aporta su experiencia como
            expeditora de cocina en The Los Angeles Times. También es una autora
            reconocida, con contribuciones a numerosos libros de cocina y
            publicaciones gastronómicas. Originaria del Este de Los Ángeles, Emma
            reside ahora en la ciudad de Nueva York, donde explora una amplia
            variedad de delicias culinarias.
          </p>
        </div>
        <div className="ml-auto">
          <Button
            onClick={handleGoToDashboard}
            className="px-4 py-2" // Mantiene este className para que Button.jsx aplique sus estilos por defecto, incluyendo bg-accent
          >
            Admin Dashboard
          </Button>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            className={`${
              activeTab === "saved"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab("saved")}
          >
            Recetas guardadas (0)
          </button>
          <button
            className={`${
              activeTab === "myRecipes"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab("myRecipes")}
          >
            Mis Recetas (3)
          </button>
        </nav>
      </div>

      <div>
        {activeTab === "saved" && (
          <div className="text-center py-10">
            <img
              src="/images/empty-recipes.png"
              alt="No hay recetas guardadas"
              className="mx-auto mb-4"
              style={{ maxWidth: "150px" }}
            />
            <p className="text-gray-500">No tienes recetas guardadas</p>
            <p className="text-gray-500">
              Guarda tus recetas favoritas haciendo clic en el marcador
            </p>
          </div>
        )}

        {activeTab === "myRecipes" && (
          <div className="py-10">
            <h2 className="text-2xl font-semibold mb-4">Mis Recetas</h2>
            <p className="text-gray-500">Contenido de tus recetas aparecerá aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;