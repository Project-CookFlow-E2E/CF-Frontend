import { Button, Card } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { useEffect } from "react";
import { isTokenValid } from "../services/authService";

const Landing = () => {
  const navigate = useNavigate();
  const mediaUrl = import.meta.env.VITE_MEDIA_URL;

  useEffect(() => {
    if (isTokenValid()) {
      navigate("/main", { replace: true });
    }
  }, [navigate]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full font-sans"
      data-testid="landing-page"
      id="landing-page-container"
    >
      <div
        className="w-full h-[500px] bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
        style={{ backgroundImage: "url('/landing.png')" }}
        data-testid="hero-section"
        id="hero-section"
      >
        <h1
          className="text-5xl font-serif font-bold text-black mb-4"
          data-testid="hero-title"
          id="hero-title"
        >
          CookFlow
        </h1>
        <p
          className="text-lg text-black mb-6"
          data-testid="hero-subtitle"
          id="hero-subtitle"
        >
          Redescubre el placer de cocinar
        </p>
        <Link to="/login" data-testid="hero-register-link" id="hero-register-link">
          <Button>Empezar →</Button>
        </Link>
      </div>

      <div
        className="bg-[#e9e6d7] w-full py-16 text-center"
        data-testid="problem-section"
        id="problem-section"
      >
        <h2
          className="text-2xl font-semibold mb-12"
          data-testid="problem-title"
          id="problem-title"
        >
          De la frustración a la diversión
        </h2>
        <div
          className="flex flex-col md:flex-row justify-center gap-6 md:gap-4 px-4"
          data-testid="problem-cards-container"
          id="problem-cards-container"
        >
          <div
            className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto"
            data-testid="problem-card-1"
            id="problem-card-1"
          >
            <div className="text-2xl mb-2 flex justify-center">
              <FaGear />
            </div>
            <h3 className="font-semibold text-lg mb-2">¿Que cocinamos hoy?</h3>
            <p className="text-gray-600 text-sm">
              Despídete del estrés diario de decidir qué comer. Planifica tus
              comidas de forma fácil, rápida y sin frustraciones
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto"
            data-testid="problem-card-2"
            id="problem-card-2"
          >
            <div className="text-2xl mb-2 flex justify-center">
              <FaGear />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              No planifiques. Solo cocina.
            </h3>
            <p className="text-gray-600 text-sm">
              Recetas que se pierden, compras a última hora y cenas caóticas.
              ¿Te suena? Te ayudamos a recuperar el control.
            </p>
          </div>
        </div>
      </div>

      <div
        className="bg-[#fdf2f2] w-full py-16 px-4 text-center"
        data-testid="solution-section"
        id="solution-section"
      >
        <h2
          className="text-2xl font-semibold mb-4"
          data-testid="solution-title"
          id="solution-title"
        >
          La solución CookFlow
        </h2>
        <p
          className="max-w-2xl mx-auto text-gray-700 mb-8 text-sm"
          data-testid="solution-description"
          id="solution-description"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div
          className="pb-20"
          data-testid="register-button-container"
          id="register-button-container"
        >
          <Link to="/login" data-testid="register-link" id="register-link">
            <Button data-testid="acocinar-button">A cocinar</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
