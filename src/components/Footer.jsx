import { PlusCircle, ShoppingBasket, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { isTokenValid } from "../services/authService";

/**
 * Footer es un componente de navegación inferior fijo.
 *
 * Muestra tres accesos principales:
 * - Buscar recetas
 * - Añadir nueva receta
 * - Acceder a la lista de la compra
 *
 * El icono activo se resalta según la ruta actual.
 *
 * @component
 * @returns {JSX.Element} Barra de navegación inferior fija con iconos.
 * @author Nico
 * @modified by Ana Castro
 * @modified añadido condicional discriminando si el usuario está logueado o no.
 */

const Footer = () => {
    const isLoggedIn = isTokenValid();
    const location = useLocation();

    return (
        <footer
            className={`w-full bg-footer border-t border-gray-200 py-2 z-50 ${
                isLoggedIn ? "fixed bottom-0 left-0 flex justify-around" : "mt-auto text-center"
            }`}
            data-testid="footer"
        >
            {isLoggedIn ? (
                <>
                    <Link
                        to="/search"
                        className={`flex flex-col items-center ${
                            location.pathname === "/search" ? "text-primary" : "text-gray-100"
                        }`}
                        data-testid="footer-link-search"
                    >
                        <Search className="w-6 h-6" data-testid="footer-icon-search" />
                        <span className="text-sm font-semibold" data-testid="footer-label-search">
                            Buscar
                        </span>
                    </Link>

                    <Link
                        to="/add-recipe"
                        className={`flex flex-col items-center ${
                            location.pathname === "/add-recipe" ? "text-primary" : "text-gray-100"
                        }`}
                        data-testid="footer-link-add-recipe"
                    >
                        <PlusCircle className="w-6 h-6" data-testid="footer-icon-add-recipe" />
                        <span className="text-sm font-semibold" data-testid="footer-label-add-recipe">
                            Nueva Receta
                        </span>
                    </Link>

                    <Link
                        to="/shopping-list"
                        className={`flex flex-col items-center ${
                            location.pathname === "/shopping-list" ? "text-primary" : "text-gray-100"
                        }`}
                        data-testid="footer-link-shopping-list"
                    >
                        <ShoppingBasket className="w-6 h-6" data-testid="footer-icon-shopping-list" />
                        <span className="text-sm font-semibold" data-testid="footer-label-shopping-list">
                            Cesta
                        </span>
                    </Link>
                </>
            ) : (
                <div className="w-full bg-footer text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
                    <div className="text-center md:text-left">
                        <p>
                            © 2025 <span className="font-semibold">CookFlow</span>
                        </p>
                        <p>Desarrollado con 💚 por RuralCamp</p>
                    </div>
                    <div className="text-center md:text-right">
                        <p>
                            Contacto:{" "}
                            <a href="mailto:contacto@cookflow.com" className="underline">
                                contacto@cookflow.com
                            </a>
                        </p>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;
