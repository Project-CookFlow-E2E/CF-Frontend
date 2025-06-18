/**
 * @file InspireMe.jsx
 * @description Página de inspiración culinaria tipo "Tinder de recetas".
 * Permite a los usuarios ver recetas una por una y marcarlas como favoritas o saltarlas.
 * Utiliza datos reales desde el backend para las recetas aleatorias y la gestión de favoritos.
 *
 * El componente `SwipeCard` representa visualmente cada receta con acciones de swipe.
 *
 * @module pages/InspireMe
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import SwipeCard from '../components/SwipeCard';
import { recipeService } from '../services/recipeService';
import { favoriteService } from '../services/favoriteService';

const PROCESSED_RECIPES_STORAGE_KEY = 'processedRecipeIds_inspireme_local';

const InspireMe = () => {
    const [recipes, setRecipes] = useState([]);
    const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
    const [initialLoading, setInitialLoading] = useState(true);
    const [userFavoriteEntries, setUserFavoriteEntries] = useState([]);
    const [favoritesLoading, setFavoritesLoading] = useState(true);
    const [fetchingMoreRecipes, setFetchingMoreRecipes] = useState(false);
    const [allRecipesExhausted, setAllRecipesExhausted] = useState(false);

    const [processedRecipeIds, setProcessedRecipeIdsState] = useState(() => {
        try {
            const stored = localStorage.getItem(PROCESSED_RECIPES_STORAGE_KEY);
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch (error) {
            console.error("Error al cargar processedRecipeIds de localStorage:", error);
            return new Set();
        }
    });

    const hasFetchedInitialData = useRef(false);

    const RECIPES_BATCH_SIZE = 5;
    const THRESHOLD_TO_FETCH_MORE = 1;

    useEffect(() => {
        try {
            localStorage.setItem(PROCESSED_RECIPES_STORAGE_KEY, JSON.stringify(Array.from(processedRecipeIds)));
        } catch (error) {
            console.error("Error al guardar processedRecipeIds en localStorage:", error);
        }
    }, [processedRecipeIds]);

    const updateProcessedRecipeIds = useCallback((id) => {
        setProcessedRecipeIdsState(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    }, []);

    const fetchRecipes = useCallback(async (count) => {
        if (fetchingMoreRecipes) {
            return;
        }
        setFetchingMoreRecipes(true);

        try {
            const fetched = await recipeService.getRandomRecipes(count);

            if (fetched && fetched.length > 0) {
                setRecipes(prevRecipes => {
                    const newUniqueRecipes = fetched.filter(
                        (newRecipe) =>
                            !prevRecipes.some((existingRecipe) => existingRecipe.id === newRecipe.id) &&
                            !processedRecipeIds.has(newRecipe.id)
                    );

                    if (newUniqueRecipes.length > 0) {
                        setAllRecipesExhausted(false);
                        return [...prevRecipes, ...newUniqueRecipes];
                    } else {
                        setAllRecipesExhausted(true);
                        return prevRecipes;
                    }
                });
            } else {
                setAllRecipesExhausted(true);
            }
        } catch (error) {
            console.error("InspireMe: Error al obtener recetas aleatorias:", error);
            setAllRecipesExhausted(true);
        } finally {
            setFetchingMoreRecipes(false);
        }
    }, [fetchingMoreRecipes, processedRecipeIds]);

    useEffect(() => {
        if (hasFetchedInitialData.current) {
            return;
        }

        const performInitialDataFetch = async () => {
            setInitialLoading(true);
            setFavoritesLoading(true);

            try {
                const fetchedFavoriteEntries = await favoriteService.getUserFavorites();
                setUserFavoriteEntries(fetchedFavoriteEntries);
            } catch (error) {
                console.error("InspireMe: Error al cargar los favoritos del usuario:", error);
            } finally {
                setFavoritesLoading(false);
            }

            await fetchRecipes(RECIPES_BATCH_SIZE);

            setInitialLoading(false);
        };

        performInitialDataFetch();
        hasFetchedInitialData.current = true;

    }, [fetchRecipes]);

    const displayableRecipes = recipes.filter(recipe => !processedRecipeIds.has(recipe.id));
    
    useEffect(() => {
        if (currentRecipeIndex >= displayableRecipes.length && displayableRecipes.length > 0) {
            setCurrentRecipeIndex(0);
        } else if (displayableRecipes.length === 0 && currentRecipeIndex !== 0) {
            setCurrentRecipeIndex(0);
        }
    }, [displayableRecipes.length, currentRecipeIndex]);

    useEffect(() => {
        if (!initialLoading && !favoritesLoading && !fetchingMoreRecipes && 
            displayableRecipes.length > 0 &&
            !allRecipesExhausted &&
            currentRecipeIndex >= displayableRecipes.length - THRESHOLD_TO_FETCH_MORE) {
            fetchRecipes(RECIPES_BATCH_SIZE);
        }
    }, [currentRecipeIndex, displayableRecipes.length, initialLoading, favoritesLoading, fetchingMoreRecipes, fetchRecipes, allRecipesExhausted]);

    const currentRecipe = displayableRecipes[currentRecipeIndex];

    const handleToggleFavorite = async (recipeId) => {
        const idNum = Number(recipeId);
        const favoriteEntry = userFavoriteEntries.find(entry => entry.recipe_id === idNum);
        const isFavorite = !!favoriteEntry;

        try {
            if (isFavorite) {
                await favoriteService.removeFavorite(favoriteEntry.id);
                setUserFavoriteEntries(prevEntries =>
                    prevEntries.filter(entry => entry.recipe_id !== idNum)
                );
            } else {
                const newFavorite = await favoriteService.addFavorite(idNum);
                setUserFavoriteEntries(prevEntries => [...prevEntries, newFavorite]);
            }
            updateProcessedRecipeIds(idNum);
            goToNextRecipe(); 
        } catch (error) {
            console.error("InspireMe: Error al alternar favorito:", error);
        }
    };

    const handleSkip = () => {
        if (currentRecipe) { 
            updateProcessedRecipeIds(currentRecipe.id);
        }
        goToNextRecipe();
    };

    const goToNextRecipe = useCallback(() => {
        if (currentRecipeIndex < displayableRecipes.length - 1) {
            setCurrentRecipeIndex(prev => prev + 1);
        } else {
            if (!fetchingMoreRecipes && !allRecipesExhausted) {
                fetchRecipes(RECIPES_BATCH_SIZE);
            } else if (allRecipesExhausted && displayableRecipes.length === 0) {
                setCurrentRecipeIndex(0);
            }
        }
    }, [currentRecipeIndex, displayableRecipes.length, allRecipesExhausted, fetchingMoreRecipes, fetchRecipes]);


    if (initialLoading || favoritesLoading || (recipes.length === 0 && fetchingMoreRecipes && !allRecipesExhausted)) {
        return (
            <div
                className="min-h-screen flex items-center justify-center flex-col"
                data-testid="loading-state"
            >
                <div
                    className="animate-pulse bg-gray-200 h-64 w-80 rounded-lg"
                    id="loading-placeholder"
                ></div>
                <p className="mt-4 text-gray-700">Cargando recetas y tus favoritos...</p>
            </div>
        );

    }

    if (displayableRecipes.length === 0 && (!initialLoading || allRecipesExhausted) && !fetchingMoreRecipes) {
        return (
            <div
                className="min-h-screen flex items-center justify-center flex-col"
                data-testid="no-recipes-message"
            >
                <p className="text-lg text-gray-800 mb-2">No hay más recetas disponibles por el momento.</p>
                <p className="text-md text-gray-600">¡Vuelve más tarde o añade más recetas para que te inspiremos!</p>
            </div>
        );
    }

    if (!currentRecipe) {
        if (displayableRecipes.length > 0) {
            setCurrentRecipeIndex(0);
            return (
                <div
                    className="min-h-screen flex items-center justify-center flex-col"
                    data-testid="loading-state"
                >
                    <div
                        className="animate-pulse bg-gray-200 h-64 w-80 rounded-lg"
                        id="loading-placeholder"
                    ></div>
                    <p className="mt-4 text-gray-700">Ajustando recetas...</p>
                </div>
            );
        } else {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <p>No se encontraron recetas para mostrar. No hay más inspiraciones disponibles.</p>
                </div>
            );
        }
    }

    return (
        <div
            className="min-h-screen py-8 px-4"
            style={{ backgroundColor: '#FDF3E8' }}
            data-testid="inspire-me-page"
            id="inspire-me-container"

        >
            <div className="max-w-md mx-auto">
                <h1
                    className="text-2xl sm:text-3xl md:text-4xl text-center mb-6 sm:mb-8 text-gray-900"
                    data-testid="page-title"
                    id="inspire-title"
                >
                    Swipe the card
                </h1>
                <SwipeCard
                    recipe={{
                        ...currentRecipe,
                        is_favorite: userFavoriteEntries.some(entry => entry.recipe_id === currentRecipe.id),
                    }}
                    onToggleFavorite={handleToggleFavorite}
                    onSkip={handleSkip}
                    data-testid="swipe-card"
                    id="swipe-card"
                />
            </div>
        </div>
    );
};

export default InspireMe;