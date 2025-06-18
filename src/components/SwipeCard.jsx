// src/components/SwipeCard.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import TimerBadge from "./TimerBadge";
import Button from "./Button";
import { IoMdClose } from "react-icons/io";
import { BsBookmarkFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

/**
 * Componente SwipeCard para mostrar una tarjeta de receta con opciones de interacción.
 * Permite marcar como favorito, saltar a la siguiente receta y ver detalles de la receta.
 * Incorpora funcionalidad de swipe para interactuar con las recetas (favorito/saltar).
 * Muestra múltiples categorías recibidas como array de objetos {id, name}.
 * @component
 * @param {Object} props - Props del componente.
 * @param {Object} props.recipe - Objeto de receta con detalles como id, nombre, imagen, duración, descripción, y un array de objetos de categorías ({id, name}).
 * @param {Function} props.onToggleFavorite - Función para manejar el cambio de estado de favorito.
 * @param {Function} props.onSkip - Función para manejar el salto a la siguiente receta.
 * @returns {JSX.Element} Tarjeta de receta con imagen, título, descripción, categorías y botones de acción.
 * @author Hema Priya
 *
 * @modifiedby Ángel Aragón
 * @modified
 * - Creada documentación.
 * - Cambiado el componente de FavoriteButton por el componente reutilizable Button e implementado ReactIcons para los íconos de favorito y cerrar.
 * - Cambiado el componente de SkipButton por el componente reutilizable Button e implementado ReactIcons para el ícono de cerrar.
 * - Agregado botón para ver detalles de la receta que redirige a la página de detalles de la receta usando Navigate de react-router-dom.
 * @modifiedby Saturnino Mendez
 * @modified
 * - Añadida funcionalidad de swipe para rechazar (izquierda) o añadir a favoritos (derecha).
 * - Implementado el renderizado de múltiples categorías (asumiendo `recipe.categories` es un array de objetos `{id, name}`).
 * - Refactorizado el HTML para usar `useRef` y manipular el estilo directamente para las animaciones de swipe.
 */
const SwipeCard = ({ recipe, onToggleFavorite, onSkip }) => {
    const navigate = useNavigate();
    const cardRef = useRef(null);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [initialTransform, setInitialTransform] = useState({ x: 0, rotate: 0 });
    const [isSwipingOut, setIsSwipingOut] = useState(false);

    const THRESHOLD = 100;
    const ROTATION_FACTOR = 0.08;

    useEffect(() => {
        if (cardRef.current) {
            cardRef.current.style.transition = 'transform 0.3s ease-out';
            cardRef.current.style.transform = `translateX(0px) rotate(0deg)`;
            setIsSwipingOut(false);
        }
        setInitialTransform({ x: 0, rotate: 0 });
    }, [recipe.id]);

    const handlePointerDown = useCallback((e) => {
        if (isSwipingOut) return;

        setIsDragging(true);
        setStartX(e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0));
        setCurrentX(e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0));

        if (cardRef.current) {
            const style = window.getComputedStyle(cardRef.current);
            const matrix = new DOMMatrixReadOnly(style.transform);
            const rotateMatch = style.transform.match(/rotate\(([^deg]+)deg\)/);
            const currentRotation = rotateMatch ? parseFloat(rotateMatch[1]) : 0;

            setInitialTransform({ x: matrix.m41, rotate: currentRotation });
            cardRef.current.style.transition = 'none';
        }
    }, [isSwipingOut]);

    const handlePointerMove = useCallback((e) => {
        if (!isDragging || isSwipingOut) return;

        e.preventDefault(); 

        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        setCurrentX(clientX);

        const deltaX = clientX - startX;
        const rotate = deltaX * ROTATION_FACTOR;

        if (cardRef.current) {
            cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
        }
    }, [isDragging, startX, isSwipingOut]);

    const handlePointerUp = useCallback(() => {
        if (!isDragging || isSwipingOut) return;
        setIsDragging(false);

        const deltaX = currentX - startX;

        if (Math.abs(deltaX) > THRESHOLD) {
            setIsSwipingOut(true);
            if (deltaX > 0) {
                if (cardRef.current) {
                    cardRef.current.style.transition = 'transform 0.5s ease-out';
                    cardRef.current.style.transform = `translateX(100vw) rotate(30deg)`;
                }
                setTimeout(() => {
                    onToggleFavorite(recipe.id);
                }, 300);
            } else {
                if (cardRef.current) {
                    cardRef.current.style.transition = 'transform 0.5s ease-out';
                    cardRef.current.style.transform = `translateX(-100vw) rotate(-30deg)`;
                }
                setTimeout(() => {
                    onSkip();
                }, 300); 
            }
        } else {
            if (cardRef.current) {
                cardRef.current.style.transition = 'transform 0.3s ease-out';
                cardRef.current.style.transform = `translateX(0px) rotate(0deg)`;
            }
        }
    }, [isDragging, currentX, startX, recipe.id, onToggleFavorite, onSkip, isSwipingOut]);

    useEffect(() => {
        const cardElement = cardRef.current;
        if (!cardElement) return;

        cardElement.addEventListener('pointerdown', handlePointerDown);

        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
        document.addEventListener('pointercancel', handlePointerUp);
        document.addEventListener('pointerleave', handlePointerUp); 

        return () => {
            cardElement.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
            document.removeEventListener('pointercancel', handlePointerUp);
            document.removeEventListener('pointerleave', handlePointerUp);
        };
    }, [handlePointerDown, handlePointerMove, handlePointerUp]);

    const handleFavoriteToggle = () => {
        onToggleFavorite(recipe.id);
    };

    const handleSkipClick = () => {
        onSkip();
    };

    const categoriesToDisplay = Array.isArray(recipe.categories) ? recipe.categories : [];

    return (
        <div
            ref={cardRef}
            className="flex flex-col items-center w-full px-4 pb-6 bg-[#FDF3E8] rounded-lg shadow-lg relative"
            style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                transition: isSwipingOut ? 'transform 0.5s ease-out' : 'none',
                touchAction: 'none'
            }}
            data-testid="swipe-card"
        >
            <div
                className="relative w-full mb-4 aspect-[4/3] max-h-80"
                data-testid="recipe-image-container"
            >
                <div className="bg-gray-100 rounded-xl w-full h-full flex items-center justify-center overflow-hidden shadow-sm">
                    {recipe.image_url ? (
                        <img
                            src={recipe.image_url}
                            alt={recipe.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            data-testid="recipe-image"
                        />
                    ) : (
                        <div
                            className="border border-gray-200 rounded-xl w-full h-full flex items-center justify-center bg-white"
                            data-testid="no-image-placeholder"
                        >
                            <span className="text-gray-400">Recipe Image</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full mb-6 px-2" data-testid="recipe-content">
                <div className="hidden sm:flex justify-between items-start mb-1">
                    <h2
                        className="text-xl font-semibold text-gray-900 flex-1 mr-4"
                        data-testid="recipe-title"
                    >
                        {recipe.name}
                    </h2>
                    <TimerBadge minutes={recipe.duration_minutes} />
                </div>

                <div className="hidden sm:block">
                    {recipe.description && (
                        <p
                            className="text-gray-600 text-base mb-3"
                            data-testid="recipe-description"
                        >
                            {recipe.description}
                        </p>
                    )}
                    {categoriesToDisplay.length > 0 && (
                        <div className="mb-3">
                            <h3 className="text-sm font-medium text-gray-700 mb-1">Categorías:</h3>
                            <div className="flex flex-wrap gap-2">
                                {categoriesToDisplay.map((category) => (
                                    <span
                                        key={category.id}
                                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                    >
                                        {category.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="sm:hidden">
                    <h2
                        className="text-lg font-semibold text-gray-900 mb-2 text-center"
                        data-testid="recipe-title-mobile"
                    >
                        {recipe.name}
                    </h2>

                    {recipe.description && (
                        <p
                            className="text-gray-600 text-sm mb-3 text-center"
                            data-testid="recipe-description-mobile"
                        >
                            {recipe.description}
                        </p>
                    )}

                    {categoriesToDisplay.length > 0 && (
                        <div className="flex justify-center flex-wrap gap-2 mb-3">
                             {categoriesToDisplay.map((category) => (
                                 <span
                                     key={category.id}
                                     className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                 >
                                     {category.name}
                                 </span>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <span />
                        <TimerBadge minutes={recipe.duration_minutes} />
                    </div>
                </div>
            </div>

            <div className="flex justify-center w-full mb-8 gap-20">
                <Button
                    onClick={handleSkipClick}
                    aria-label="Saltar receta"
                    hoverColor="hover:bg-gray-300"
                    className="px-2 py-2 rounded-full hover:border-gray-500 bg-white shadow-md hover:shadow-lg transition-shadow duration-200 border-1 border-gray-300"
                >
                    <IoMdClose size={28} color="#6B7280" />
                </Button>
                <Button
                    onClick={handleFavoriteToggle}
                    aria-label="Agregar a Favoritos"
                    hoverColor="hover:bg-rose-100"
                    className="px-3 py-2 rounded-full bg-white shadow-md hover:shadow-lg hover:border-accent transition-shadow duration-200 border-1 border-gray-300"
                >
                    <BsBookmarkFill size={20} color="#F37A7E" />
                </Button>
            </div>

            <div
                className="w-full sm:max-w-[140px] mx-auto mb-2"
                data-testid="open-recipe-button-wrapper"
            >
                <Button
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                    type="button"
                    className="w-full px-4 py-2 rounded-lg"
                    aria-label="Ver receta"
                >
                    Ver receta
                </Button>
            </div>
        </div>
    );
};

export default SwipeCard;