import { useState, useEffect } from "react";
import { categoryService } from "../services/categoryService"; // Servicio para obtener categorías
import { useNavigate } from "react-router-dom";

/**
 * Hook personalizado para gestionar las categorías seleccionadas y obtenerlas de la API.
 *
 * @param {number} parentCategoryId - El ID de la categoría principal que queremos cargar (por ejemplo, 0 para categorías principales).
 * 
 * @returns {Object} Objeto con las categorías disponibles, las categorías seleccionadas,
 *                   y funciones para seleccionar/deseleccionar categorías.
 */
const useCategories = (parentCategoryId = 0) => {
    const [categories, setCategories] = useState([]); // Estado para las categorías disponibles
    const [selectedCategories, setSelectedCategories] = useState([]); // Estado para las categorías seleccionadas
    const [loading, setLoading] = useState(true); // Estado de carga mientras obtenemos las categorías
    const [error, setError] = useState(null); // Estado para manejar errores de la API
    const navigate = useNavigate(); // Navegación para redirigir a la búsqueda

    // Función para obtener las categorías desde el servicio API o mock
    const TakeCategories = async () => {
        setLoading(true); // Indicamos que se está cargando
        try {
            let data;
            if (parentCategoryId === 0) {
                // Si es 0, traemos las categorías principales
                data = await categoryService.getAllParentCategories();
            } else {
                // Si es otro valor, traemos las subcategorías de ese parent_category_id
                data = await categoryService.getChildCategoriesOfSpecificParent(parentCategoryId);
            }
            setCategories(data); // Guardamos las categorías
        } catch (err) {
            setError(err); // Manejo de errores
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false); // Finalizamos la carga
        }
    };

    // Efecto para cargar las categorías al montar el hook
    useEffect(() => {
        TakeCategories(); // Llama a la función para cargar las categorías
    }, [parentCategoryId]); // Vuelve a ejecutar si cambia el parentCategoryId

    // Función para manejar la selección de categorías
    const toggleCategory = (categoryName) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryName) // Si ya está seleccionada, la deseleccionamos
                ? prev.filter((category) => category !== categoryName)
                : [...prev, categoryName] // Si no está seleccionada, la añadimos
        );
    };

    // Función para manejar el clic en "Buscar" (filtrar por categorías seleccionadas)
    const handleSearchClick = () => {
        if (selectedCategories.length === 0) return;

        const mapped = selectedCategories.map((selectedName) => {
            const matched = categories.find((cat) => cat.name === selectedName);
            return matched?.slug || selectedName.toLowerCase(); // Usamos el slug o el nombre directamente
        });

        const uniqueMapped = [...new Set(mapped)]; // Aseguramos que las categorías no se repitan
        navigate(`/search?category=${uniqueMapped.join(",")}`); // Navegamos a la página de búsqueda con las categorías seleccionadas
    };

    return {
        categories, // Las categorías disponibles
        selectedCategories, // Las categorías seleccionadas
        toggleCategory, // Función para seleccionar/deseleccionar
        loading, // Indicador de carga
        error, // Error en caso de que ocurra
        handleSearchClick, // Función para buscar recetas con las categorías seleccionadas
    };
};

export default useCategories;
