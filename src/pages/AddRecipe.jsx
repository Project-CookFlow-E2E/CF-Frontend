import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import your custom Button component
import Button from '../components/Button'; // Adjust this path as necessary
import * as authService from '../services/authService';

const AddRecipe = () => {
    const [recipeName, setRecipeName] = useState('');
    const [recipeDescription, setRecipeDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [commensals, setCommensals] = useState('');

    const [selectedGeneralCategories, setSelectedGeneralCategories] = useState([]);
    const [selectedCuisineTypes, setSelectedCuisineTypes] = useState([]);
    const [selectedOrigins, setSelectedOrigins] = useState([]);

    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [recipeSteps, setRecipeSteps] = useState([]);
    const [recipeImage, setRecipeImage] = useState(null);
    const [stepImages, setStepImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [allCategoriesList, setAllCategoriesList] = useState([]); // All categories, including parents
    const [ingredientsList, setIngredientsList] = useState([]);
    const [unitsList, setUnitsList] = useState([]);

    const navigate = useNavigate();

    // Use useMemo to filter categories once, when allCategoriesList changes
    // This assumes your backend returns parent categories (e.g., "Categoría", "Tipo de Cocina", "Origen")
    // and their children have a `parent` field pointing to the parent's ID.
    // If your backend identifies parent categories differently (e.g., with a 'type' field),
    // you'll need to adjust the find/filter logic here.
    const generalCategories = useMemo(() => {
        const parentCategory = allCategoriesList.find(cat => cat.name === 'Categoría' && !cat.parent);
        return parentCategory ? allCategoriesList.filter(cat => cat.parent === parentCategory.id) : [];
    }, [allCategoriesList]);

    const cuisineTypes = useMemo(() => {
        const parentCuisine = allCategoriesList.find(cat => cat.name === 'Tipo de Cocina' && !cat.parent);
        return parentCuisine ? allCategoriesList.filter(cat => cat.parent === parentCuisine.id) : [];
    }, [allCategoriesList]);

    const origins = useMemo(() => {
        const parentOrigin = allCategoriesList.find(cat => cat.name === 'Origen' && !cat.parent);
        return parentOrigin ? allCategoriesList.filter(cat => cat.parent === parentOrigin.id) : [];
    }, [allCategoriesList]);


    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const token = authService.getToken();

                if (!token) {
                    console.warn('No authentication token found. Redirecting to login.');
                    navigate('/login');
                    return;
                }

                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const [categoriesRes, ingredientsRes, unitsRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/recipes/categories/', config),
                    axios.get('http://127.0.0.1:8000/api/recipes/ingredients/', config),
                    axios.get('http://127.0.0.1:8000/api/measurements/units/', config)
                ]);

                setAllCategoriesList(categoriesRes.data);
                setIngredientsList(ingredientsRes.data);
                setUnitsList(unitsRes.data);

            } catch (error) {
                console.error('Error fetching form data:', error);
                if (error.response && error.response.status === 401) {
                    alert('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
                    authService.logout();
                    navigate('/login');
                } else {
                    alert('Error al cargar datos necesarios. Por favor, recarga la página.');
                }
            }
        };
        fetchFormData();
    }, [navigate]);

    const handleCategoryToggle = (categoryId, setSelectedState) => {
        setSelectedState(prevSelected => {
            if (prevSelected.includes(categoryId)) {
                return prevSelected.filter(id => id !== categoryId);
            } else {
                return [...prevSelected, categoryId];
            }
        });
    };

    const handleAddIngredient = () => {
        setRecipeIngredients([...recipeIngredients, { ingredient: '', quantity: '', unit: '' }]);
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...recipeIngredients];
        newIngredients[index][field] = value;
        setRecipeIngredients(newIngredients);
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = recipeIngredients.filter((_, i) => i !== index);
        setRecipeIngredients(newIngredients);
    };

    const handleAddStep = () => {
        setRecipeSteps([...recipeSteps, { order: recipeSteps.length + 1, description: '' }]);
        setStepImages([...stepImages, null]);
    };

    const handleStepChange = (index, field, value) => {
        const newSteps = [...recipeSteps];
        newSteps[index][field] = value;
        newSteps[index].order = index + 1; // Ensure order is correct
        setRecipeSteps(newSteps);
    };

    const handleRemoveStep = (index) => {
        const newSteps = recipeSteps.filter((_, i) => i !== index);
        setRecipeSteps(newSteps.map((step, i) => ({ ...step, order: i + 1 })));
        const newStepImages = stepImages.filter((_, i) => i !== index);
        setStepImages(newStepImages);
    };

    const handleStepImageChange = (index, file) => {
        const newStepImages = [...stepImages];
        newStepImages[index] = file;
        setStepImages(newStepImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();

        formData.append('name', recipeName);
        formData.append('description', recipeDescription);
        formData.append('duration_minutes', duration);
        formData.append('commensals', commensals);

        const allSelectedCategoryIds = [
            ...selectedGeneralCategories,
            ...selectedCuisineTypes,
            ...selectedOrigins
        ];
        allSelectedCategoryIds.forEach(categoryId => {
            formData.append('categories', categoryId);
        });

        formData.append('ingredients_data', JSON.stringify(recipeIngredients.map(ing => ({
            ingredient: ing.ingredient,
            quantity: ing.quantity,
            unit: ing.unit
        }))));
        formData.append('steps_data', JSON.stringify(recipeSteps.map(step => ({
            order: step.order,
            description: step.description
        }))));

        if (recipeImage) {
            formData.append('recipe_image', recipeImage);
        }

        stepImages.forEach((imageFile, index) => {
            if (imageFile) {
                formData.append(`step_image_${index + 1}`, imageFile);
            }
        });

        try {
            const token = authService.getToken();
            if (!token) {
                alert('No authentication token found. Please log in.');
                navigate('/login');
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.post('http://127.0.0.1:8000/api/recipes/recipes/', formData, config);

            console.log('Recipe created successfully:', response.data);
            alert('Receta creada exitosamente!');
            navigate(`/recipes/${response.data.id}`);
        } catch (error) {
            console.error('Error creating recipe:', error);
            let errorMessage = 'Error al crear la receta.';
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                if (error.response.status === 401) {
                    errorMessage = 'No autorizado. Por favor, inicia sesión de nuevo.';
                    authService.logout();
                    navigate('/login');
                } else if (error.response.data) {
                    try {
                        errorMessage += '\nDetalles: ' + JSON.stringify(error.response.data, null, 2);
                    } catch (e) {
                        errorMessage += '\nDetalles: ' + error.response.data;
                    }
                }
            } else if (error.request) {
                console.error('No se recibió respuesta del servidor:', error.request);
                errorMessage = 'No se recibió respuesta del servidor. Inténtalo de nuevo más tarde.';
            } else {
                console.error('Error message:', error.message);
                errorMessage = 'Ocurrió un error inesperado. ' + error.message;
            }
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Tailwind CSS Utility Classes
    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    const labelClasses = "block text-sm font-medium text-gray-700";
    const sectionTitleClasses = "text-xl font-semibold text-gray-800 mb-4 mt-6 border-b pb-2";
    const removeButtonClasses = "px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out text-sm mt-2";
    const itemContainerClasses = "p-4 border border-gray-200 rounded-md shadow-sm bg-white mb-4";
    const fileInputClasses = "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100";

    // Reusable component for category selection (now using your Button component for badges)
    const CategorySelectionBlock = ({ title, categories, selectedCategories, setSelectedCategories }) => (
        <div>
            <label className={labelClasses}>{title}:</label>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-gray-50 min-h-[40px]">
                {categories.length > 0 ? (
                    categories.map(category => {
                        const isSelected = selectedCategories.includes(category.id);
                        return (
                            <Button
                                key={category.id}
                                onClick={() => handleCategoryToggle(category.id, setSelectedCategories)}
                                // Override default Button classes to achieve badge look
                                className={`px-3 py-1 rounded-full text-xs font-medium transition duration-150 ease-in-out
                                    ${isSelected
                                        ? 'bg-blue-600 text-white' // Selected badge color
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Unselected badge color
                                    }`}
                                textColor="" // Clear default text-white from your Button component
                                hoverColor="" // Clear default hover background from your Button component
                                ariaLabel={`Seleccionar ${category.name}`}
                            >
                                {category.name}
                            </Button>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-500">Cargando {title.toLowerCase()}...</p>
                )}
            </div>
            {selectedCategories.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                    Seleccionadas:
                    <div className="flex flex-wrap gap-1 mt-1">
                        {selectedCategories.map(catId => {
                            const category = allCategoriesList.find(c => c.id === catId);
                            return (
                                <span key={`selected-display-${catId}`} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {category ? category.name : ''}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Añadir Nueva Receta</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="recipeName" className={labelClasses}>Nombre de la Receta:</label>
                        <input
                            type="text"
                            id="recipeName"
                            value={recipeName}
                            onChange={(e) => setRecipeName(e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="recipeDescription" className={labelClasses}>Descripción:</label>
                        <textarea
                            id="recipeDescription"
                            value={recipeDescription}
                            onChange={(e) => setRecipeDescription(e.target.value)}
                            className={`${inputClasses} h-24`}
                        ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="duration" className={labelClasses}>Duración (minutos):</label>
                            <input
                                type="number"
                                id="duration"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="commensals" className={labelClasses}>Comensales:</label>
                            <input
                                type="number"
                                id="commensals"
                                value={commensals}
                                onChange={(e) => setCommensals(e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </div>
                    </div>

                    {/* Separate Category Selection Blocks for General, Cuisine, Origin */}
                    <CategorySelectionBlock
                        title="Categoría General"
                        categories={generalCategories}
                        selectedCategories={selectedGeneralCategories}
                        setSelectedCategories={setSelectedGeneralCategories}
                    />
                    <CategorySelectionBlock
                        title="Tipo de Cocina"
                        categories={cuisineTypes}
                        selectedCategories={selectedCuisineTypes}
                        setSelectedCategories={setSelectedCuisineTypes}
                    />
                    <CategorySelectionBlock
                        title="Origen"
                        categories={origins}
                        selectedCategories={selectedOrigins}
                        setSelectedCategories={setSelectedOrigins}
                    />


                    <h2 className={sectionTitleClasses}>Ingredientes</h2>
                    {recipeIngredients.map((ing, index) => (
                        <div key={index} className={itemContainerClasses}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <div>
                                    <label className={labelClasses}>Ingrediente:</label>
                                    <select
                                        value={ing.ingredient}
                                        onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                                        className={inputClasses}
                                        required
                                    >
                                        <option value="">Selecciona un ingrediente</option>
                                        {ingredientsList.map(ingredient => (
                                            <option key={ingredient.id} value={ingredient.id}>
                                                {ingredient.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClasses}>Cantidad:</label>
                                    <input
                                        type="number"
                                        value={ing.quantity}
                                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                        className={inputClasses}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelClasses}>Unidad:</label>
                                    <select
                                        value={ing.unit}
                                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                        className={inputClasses}
                                        required
                                    >
                                        <option value="">Selecciona una unidad</option>
                                        {unitsList.map(unit => (
                                            <option key={unit.id} value={unit.id}>
                                                {unit.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveIngredient(index)}
                                className={removeButtonClasses}
                            >
                                Eliminar Ingrediente
                            </button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        onClick={handleAddIngredient}
                        className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700" // Custom classes for add button
                        textColor="text-white"
                        ariaLabel="Añadir Ingrediente"
                    >
                        Añadir Ingrediente
                    </Button>

                    <h2 className={sectionTitleClasses}>Pasos</h2>
                    {recipeSteps.map((step, index) => (
                        <div key={index} className={itemContainerClasses}>
                            <div className="flex justify-between items-center mb-3">
                                <label className={labelClasses}>Orden: <span className="font-bold text-gray-900">{step.order}</span></label>
                            </div>
                            <div className="mb-3">
                                <label className={labelClasses}>Descripción:</label>
                                <textarea
                                    value={step.description}
                                    onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                                    className={`${inputClasses} h-24`}
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label className={labelClasses}>Imagen del Paso (Opcional):</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleStepImageChange(index, e.target.files[0])}
                                    className={fileInputClasses}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveStep(index)}
                                className={removeButtonClasses}
                            >
                                Eliminar Paso
                            </button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        onClick={handleAddStep}
                        className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700" // Custom classes for add button
                        textColor="text-white"
                        ariaLabel="Añadir Paso"
                    >
                        Añadir Paso
                    </Button>

                    <h2 className={sectionTitleClasses}>Imagen Principal de la Receta</h2>
                    <div>
                        <label htmlFor="recipeImage" className={labelClasses}>Subir Imagen:</label>
                        <input
                            type="file"
                            id="recipeImage"
                            onChange={(e) => setRecipeImage(e.target.files[0])}
                            className={fileInputClasses}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full mt-8 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        textColor="text-white"
                        ariaLabel={isLoading ? 'Creando Receta...' : 'Crear Receta'}
                    >
                        {isLoading ? 'Creando Receta...' : 'Crear Receta'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AddRecipe;