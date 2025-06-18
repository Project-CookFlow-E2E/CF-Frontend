/**
 * Componente AddRecipe
 * Permite crear una nueva receta con imagen, ingredientes, pasos y categorías.
 * Utiliza React Hook Form para la gestión del formulario.
 * created by Nico
 * @modify Rafael Fernández
 */
import { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Image, Plus } from "lucide-react";
import { Button, Input } from "../components/";
import { recipeService } from "../services/recipeService";
import { categoryService } from "../services/categoryService";
import { ingredientService } from "../services/ingredientService";
import { unitService } from "../services/unitService";
import { unitTypeService } from "../services/unitTypeService";

const AddRecipe = () => {
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [allIngredients, setAllIngredients] = useState([]);
  const [unitsByType, setUnitsByType] = useState({});
  const [unitTypeCache, setUnitTypeCache] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [recipeId, setRecipeId] = useState(null);
  const dropdownRef = useRef(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      tiempo: "",
      comensales: "",
      categoriasSeleccionadas: [],
      foto: null,
      ingredients: [{ name: "", quantity: "", unit: "" }], // `unit` aquí es el ID
      steps: [{ text: "", image: null, imagePreview: null, isDragOver: false }],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const {
    fields: stepFields,
    append: appendStep,
  } = useFieldArray({
    control,
    name: "steps",
  });

  useEffect(() => {
    categoryService.getAllParentCategories()
      .then((data) => setParentCategories(Array.isArray(data) ? data : []))
      .catch(() => setParentCategories([]));
  }, []);

  useEffect(() => {
    if (selectedParent) {
      categoryService.getChildCategoriesOfSpecificParent(selectedParent)
        .then((data) => setChildCategories(Array.isArray(data) ? data : []))
        .catch(() => setChildCategories([]));
    } else {
      setChildCategories([]);
    }
  }, [selectedParent]);

  useEffect(() => {
    ingredientService.getAllIngredients()
      .then((data) => setAllIngredients(Array.isArray(data) ? data : []))
      .catch(() => setAllIngredients([]));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const foto = watch("foto");

  useEffect(() => {
    if (foto && foto instanceof File) {
      const url = URL.createObjectURL(foto);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [foto]);

  const validateImageFile = (file) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024;
    if (!tiposPermitidos.includes(file.type)) {
      setMensaje("Tipo de archivo no permitido. Solo JPEG, PNG, WEBP.");
      return false;
    }
    if (file.size > maxSize) {
      setMensaje("El archivo es demasiado grande. Máximo 2MB.");
      return false;
    }
    return true;
  };

  const processImageFile = (file) => {
    if (!file) return;
    if (!validateImageFile(file)) return;
    setValue("foto", file);
    setMensaje(""); // Limpiar mensaje si la validación es exitosa
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const deleteImg = () => {
    setValue("foto", null);
    setPreview(null);
    setMensaje(""); // Limpiar mensaje al eliminar imagen
  };

  const categoriasSeleccionadas = watch("categoriasSeleccionadas") || [];

  const handleCategoriaChange = (categoria) => {
    let seleccionadas = categoriasSeleccionadas || [];
    if (seleccionadas.includes(categoria.id)) {
      seleccionadas = seleccionadas.filter((id) => id !== categoria.id);
    } else {
      seleccionadas = [...seleccionadas, categoria.id];
    }
    // Garantiza unicidad
    setValue("categoriasSeleccionadas", Array.from(new Set(seleccionadas)));
  };

  const handleIngredientChange = async (e, index) => {
    const value = e.target.value;
    setValue(`ingredients.${index}.name`, value);
    const found = allIngredients.find(i => i.name === value);
    if (found && found.unit_type_id) {
      setValue(`ingredients.${index}.id`, found.id); // Guardar el ID del ingrediente encontrado
      if (!unitsByType[found.unit_type_id]) {
        try {
          const units = await unitService.getUnitByUnitTypeId(found.unit_type_id);
          setUnitsByType(prev => ({ ...prev, [found.unit_type_id]: units }));
          // Si hay unidades, establecer el ID de la primera unidad por defecto
          if (units && units.length > 0) {
            setValue(`ingredients.${index}.unit`, units[0].id); // ¡MODIFICADO: Guardar el ID de la unidad!
          } else {
            // Fallback si no hay unidades, intentar obtener el nombre del tipo de unidad
            let unitTypeName = "";
            if (unitTypeCache[found.unit_type_id]) {
              unitTypeName = unitTypeCache[found.unit_type_id].name;
            } else {
              try {
                const unitType = await unitTypeService.getUnitTypeById(found.unit_type_id);
                setUnitTypeCache(prev => ({ ...prev, [found.unit_type_id]: unitType }));
                unitTypeName = unitType.name;
              } catch {
                unitTypeName = "";
              }
            }
            // Aquí podrías dejar el campo de unidad vacío o con un mensaje de error si no hay unidades válidas
            setValue(`ingredients.${index}.unit`, "");
          }
        } catch {
          setValue(`ingredients.${index}.unit`, "");
        }
      } else {
        const units = unitsByType[found.unit_type_id];
        // Si hay unidades, establecer el ID de la primera unidad por defecto
        if (units && units.length > 0) {
          setValue(`ingredients.${index}.unit`, units[0].id); // ¡MODIFICADO: Guardar el ID de la unidad!
        } else {
          let unitTypeName = "";
          if (unitTypeCache[found.unit_type_id]) {
            unitTypeName = unitTypeCache[found.unit_type_id].name;
          } else {
            try {
              const unitType = await unitTypeService.getUnitTypeById(found.unit_type_id);
              setUnitTypeCache(prev => ({ ...prev, [found.unit_type_id]: unitType }));
              unitTypeName = unitType.name;
            } catch {
              unitTypeName = "";
            }
          }
          setValue(`ingredients.${index}.unit`, "");
        }
      }
    } else {
      // Limpiar ID y unidad si el ingrediente no se encuentra o no tiene tipo de unidad
      setValue(`ingredients.${index}.id`, null);
      setValue(`ingredients.${index}.unit`, "");
    }
  };


  // Validación de campos numéricos (no negativos ni cero)
  const validatePositive = (value) => {
    if (value === "" || value === null || value === undefined) return "Campo obligatorio";
    if (isNaN(value)) return "Debe ser un número";
    if (parseFloat(value) <= 0) return "Debe ser mayor que 0";
    return true;
  };

  // Validación de cantidad de ingredientes
  const validateIngredientQuantity = (value) => {
    if (value === "" || value === null || value === undefined) return "Campo obligatorio";
    if (isNaN(value)) return "Debe ser un número";
    if (parseFloat(value) <= 0) return "Debe ser mayor que 0";
    return true;
  };

  const onSubmit = async (data) => {
    // Validación manual extra para ingredientes
    for (const ing of data.ingredients) {
      if (!ing.name || !ing.quantity || !ing.unit) { // Asegúrate de que ing.unit ahora sea un ID
        setMensaje("Todos los ingredientes deben tener nombre, cantidad y unidad.");
        return;
      }
      if (isNaN(ing.quantity) || parseFloat(ing.quantity) <= 0) {
        setMensaje("La cantidad de cada ingrediente debe ser mayor que 0.");
        return;
      }
    }

    // Validación manual para tiempo y comensales
    if (isNaN(data.tiempo) || parseInt(data.tiempo, 10) <= 0) {
      setMensaje("El tiempo debe ser mayor que 0.");
      return;
    }
    if (isNaN(data.comensales) || parseInt(data.comensales, 10) <= 0) {
      setMensaje("El número de comensales debe ser mayor que 0.");
      return;
    }

    // Validación para asegurarse de que haya al menos un paso
    if (!data.steps || data.steps.length === 0) {
        setMensaje("La receta debe tener al menos un paso.");
        return;
    }
    // Validación de texto de los pasos
    for (const step of data.steps) {
        if (!step.text || step.text.trim() === "") {
            setMensaje("Cada paso debe tener una descripción.");
            return;
        }
    }

    try {
      // Matriz única de categorías
      const categoriasUnicas = Array.from(new Set(data.categoriasSeleccionadas));

      const recipePayload = new FormData();

      // 1. Añadir campos directos de la receta
      recipePayload.append("name", data.nombre);
      recipePayload.append("description", data.descripcion);
      recipePayload.append("duration_minutes", parseInt(data.tiempo, 10));
      recipePayload.append("commensals", parseInt(data.comensales, 10));

      // 2. Añadir las categorías (una por una con la clave 'categories[]')
      // Esta forma es la estándar para FormData con arrays y DRF lo maneja bien.
      categoriasUnicas.forEach((categoryId) => {
        recipePayload.append("categories", parseInt(categoryId, 10)); // Se cambió a 'categories' sin [] para DRF si es JSON Array, pero 'categories[]' también funciona con DRF
      });


      // 3. Añadir los ingredientes como una CADENA JSON
      const formattedIngredients = data.ingredients.map(ing => ({
        ingredient: parseInt(ing.id, 10), // ¡Usar ing.id para el ID del ingrediente base!
        quantity: parseFloat(ing.quantity),
        unit: parseInt(ing.unit, 10)     // ¡Usar ing.unit para el ID de la unidad!
      }));
      // MODIFICADO: Cambiado de "ingredients" a "ingredients_data" para coincidir con el serializador
      recipePayload.append("ingredients_data", JSON.stringify(formattedIngredients));

      // 4. Añadir la imagen principal de la receta
      if (data.foto) {
        recipePayload.append("photo", data.foto); // La clave es "photo"
      }

      // 5. Añadir los pasos como una CADENA JSON
      const formattedSteps = data.steps.map((step, idx) => ({
        description: step.text,
        order: idx + 1
      }));
      // MODIFICADO: Cambiado de "steps" a "steps_data" para coincidir con el serializador
      recipePayload.append("steps_data", JSON.stringify(formattedSteps));

      // 6. Añadir las imágenes de cada paso
      data.steps.forEach((step, idx) => {
        if (step.image) { // `step.image` es el objeto File real
          // La clave es "step_image_0", "step_image_1", etc.
          recipePayload.append(`step_image_${idx}`, step.image);
        }
      });

      // --- Verificación del contenido de FormData (para depuración) ---
      console.log("Contenido de recipePayload para envío:");
      for (const [key, value] of recipePayload.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File (${value.name}, ${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      console.log("--- FIN de recipePayload para envío ---");
      // --- Fin de verificación ---


      const recetaGuardada = await recipeService.createRecipe(recipePayload);
      const recetaId = recetaGuardada.id;

      console.log("Receta guardada con ID:", recetaId);

      setRecipeId(recetaId);
      setMensaje("Receta guardada correctamente. ID: " + recetaId);
      reset();
      setValue("categoriasSeleccionadas", []);
      setPreview(null); // Limpiar la vista previa de la imagen principal
      // Para limpiar las vistas previas de los pasos, necesitarías iterar sobre ellos y revocar las URLs
      // y establecer imagePreview a null para cada uno. Un reset() global lo hará.

    } catch (error) {
      let errorMsg = "Error al guardar la receta.";
      if (error.response && error.response.data) {
        errorMsg += "\nDetalles del error del servidor: " + JSON.stringify(error.response.data, null, 2);
      } else if (error.message) {
        errorMsg += "\nDetalles del error: " + error.message;
      }
      setMensaje(errorMsg);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-background p-4" data-testid="add-recipe-page">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Add_recipes</h2>
        <button className="mb-4" data-testid="back-button">
          <span className="text-2xl">←</span>
        </button>
        <h1 className="text-2xl font-semibold text-center mb-6" data-testid="add-recipe-title">
          Añadir receta
        </h1>

        {mensaje && (
          <div
            className="mb-4 px-3 py-4 rounded-lg text-sm font-mono text-white bg-footer text-left transition-all duration-300"
            data-testid="console-message"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
          >
            {mensaje}
          </div>
        )}
        {recipeId && (
          <div className="mb-4 px-3 py-2 rounded-lg text-sm font-mono bg-green-100 text-green-800">
            <strong>recipe_id generado:</strong> {recipeId}
          </div>
        )}

        {/* Imagen de la receta */}
        <div
          className={`bg-white border border-gray-300 rounded-xl h-48 flex flex-col justify-center items-center mb-6 overflow-hidden relative transition-all duration-200 ${
            isDragOver ? "border-accent border-2 bg-accent/5" : ""
          }`}
          data-testid="image-upload-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt="Vista previa"
                className="object-contain w-full h-full"
                data-testid="image-preview"
              />
              <button
                onClick={deleteImg}
                className="absolute top-2 right-2 bg-white/80 text-red-600 border border-red-300 rounded-full px-2 py-1 text-xs hover:bg-white"
                data-testid="delete-image-button"
              >
                Eliminar
              </button>
            </>
          ) : (
            <>
              <Image className="w-8 h-8 text-accent" data-testid="upload-icon" />
              <label
                className="mt-2 px-4 py-1 border-2 border-accent rounded-xl text-accent cursor-pointer"
                data-testid="upload-label"
              >
                Añadir Foto
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  data-testid="file-input"
                />
              </label>
              {isDragOver && (
                <p className="text-accent text-sm mt-2">Suelta la imagen aquí</p>
              )}
            </>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Nombre y descripción */}
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nombre-receta">
              Nombre de la receta
            </label>
            <Controller
              control={control}
              name="nombre"
              rules={{ required: "El nombre es obligatorio" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="nombre-receta"
                  label="Nombre de la receta"
                  placeholder="Ej: Huevos rancheros, fabada ..."
                  data-testid="recipe-name-input"
                  className="focus:outline-none"
                  required
                />
              )}
            />

            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="descripcion-receta">
              Descripción
            </label>
            <Controller
              control={control}
              name="descripcion"
              rules={{ required: "La descripción es obligatoria" }}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="descripcion-receta"
                  placeholder="Ej: Un platillo tradicional con un toque especial..."
                  data-testid="recipe-description-input"
                  className="w-full border border-gray-300 rounded-lg p-2 resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                  required
                />
              )}
            />

            {/* Selector de categorías padre e hijas */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría padre</label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none bg-white"
                value={selectedParent || ""}
                onChange={e => setSelectedParent(Number(e.target.value))}
              >
                <option value="" className="text-gray-400">
                  Selecciona una categoría padre
                </option>
                {parentCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {childCategories.length > 0 && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Categorías hijas</label>
                  <div className="flex flex-wrap gap-2">
                    {childCategories.map((categoria) => (
                      <button
                        type="button"
                        key={categoria.id}
                        className={`px-3 py-1 rounded-lg border ${
                          (categoriasSeleccionadas || []).includes(categoria.id)
                            ? "bg-accent text-white"
                            : "bg-white text-gray-700"
                        }`}
                        onClick={() => handleCategoriaChange(categoria)}
                      >
                        {categoria.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="tiempo-preparacion"
                >
                  Tiempo (minutos)
                </label>
                <Controller
                  control={control}
                  name="tiempo"
                  rules={{ validate: validatePositive }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="tiempo-preparacion"
                      type="number"
                      placeholder="Ej: 30"
                      min={1}
                      required
                    />
                  )}
                />
                <small className="text-gray-500">Introduce el tiempo total en minutos.</small>
              </div>
              <div className="flex-1">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="comensales"
                >
                  Comensales
                </label>
                <Controller
                  control={control}
                  name="comensales"
                  rules={{ validate: validatePositive }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="comensales"
                      type="number"
                      placeholder="Ej: 4"
                      min={1}
                      required
                    />
                  )}
                />
              </div>
            </div>

            {/* Ingredientes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes</label>
              <div className="flex flex-col gap-3 items-center">
                {ingredientFields.map((ingredient, index) => (
                  <div key={ingredient.id || index} className="w-full">
                    {/* Input de ingrediente en una sola línea */}
                    <Controller
                      control={control}
                      name={`ingredients.${index}.name`}
                      rules={{ required: "El nombre del ingrediente es obligatorio" }}
                      render={({ field }) => (
                        <>
                          <Input
                            {...field}
                            id={`ingredient-name-${index}`}
                            list={`ingredientes-list-${index}`}
                            placeholder="Ej: Harina, Leche..."
                            className="w-full focus:outline-none"
                            onChange={e => handleIngredientChange(e, index)}
                            required
                          />
                          <datalist id={`ingredientes-list-${index}`}>
                            {allIngredients.map(i => (
                              <option key={i.id} value={i.name} />
                            ))}
                          </datalist>
                        </>
                      )}
                    />
                    {/* Cantidad y unidad en la línea siguiente */}
                    <div className="flex gap-4 mt-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor={`ingredient-quantity-${index}`}>
                          Cantidad
                        </label>
                        <Controller
                          control={control}
                          name={`ingredients.${index}.quantity`}
                          rules={{ validate: validateIngredientQuantity }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id={`ingredient-quantity-${index}`}
                              type="number"
                              placeholder="Cantidad"
                              min={1}
                              step="any"
                              className="w-full focus:outline-none"
                              required
                            />
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor={`ingredient-unit-${index}`}>
                          Unidad
                        </label>
                        <Controller
                          control={control}
                          name={`ingredients.${index}.unit`}
                          rules={{ required: "La unidad es obligatoria" }}
                          render={({ field }) => {
                            const ingName = watch(`ingredients.${index}.name`);
                            const found = allIngredients.find(i => i.name === ingName);
                            // Las unidades ahora deben ser los objetos completos con 'id', 'name', 'abbreviation'
                            const units = found && found.unit_type_id ? (unitsByType[found.unit_type_id] || []) : [];

                            return units.length > 0 ? (
                              <select
                                {...field}
                                id={`ingredient-unit-${index}`}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none bg-white"
                                required
                                onChange={(e) => field.onChange(parseInt(e.target.value, 10))} // Asegurarse de que el valor sea un número (ID)
                                value={field.value || ""} // Asegura que el valor coincida con el option.value
                              >
                                <option value="">Selecciona unidad</option>
                                {units.map(u => (
                                  <option key={u.id} value={u.id}> {/* ¡El valor es el ID de la unidad! */}
                                    {u.name} {u.abbreviation && `(${u.abbreviation})`}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <Input
                                {...field}
                                id={`ingredient-unit-${index}`}
                                placeholder="Unidad"
                                className="w-full focus:outline-none"
                                readOnly // Si no hay unidades disponibles, el campo es solo de lectura
                                required
                              />
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendIngredient({ name: "", quantity: "", unit: "" })}
                  className="border px-6 py-3 rounded-xl h-10 flex justify-center items-center mt-2"
                >
                  Añadir ingrediente <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Pasos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="steps-label">
                Pasos de la preparación
              </label>
              <div className="flex flex-col gap-6 items-center" data-testid="steps-list">
                {stepFields.map((step, index) => (
                  <div key={step.id || index} className="w-full space-y-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`step-textarea-${index}`}>
                      Paso número {index + 1}
                    </label>
                    <Controller
                      control={control}
                      name={`steps.${index}.text`}
                      rules={{ required: "El texto del paso es obligatorio" }}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          id={`step-textarea-${index}`}
                          placeholder={`Describe el paso ${index + 1}`}
                          data-testid={`step-input-${index}`}
                          className="w-full border border-gray-300 rounded-lg p-2 resize-y min-h-[60px] focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                          required
                        />
                      )}
                    />
                    {/* Área de imagen del paso */}
                    <Controller
                      control={control}
                      name={`steps.${index}.image`} // ¡Controlamos directamente el campo 'image' del paso!
                      render={({ field: imageField }) => ( // Renombramos 'field' a 'imageField' para evitar conflictos
                        <div
                          className={`bg-white border border-gray-300 rounded-xl h-48 flex flex-col justify-center items-center overflow-hidden relative transition-all duration-200 ${
                            watch(`steps.${index}.isDragOver`) ? "border-accent border-2 bg-accent/5" : "" // Usar watch para isDragOver
                          }`}
                          data-testid={`step-image-upload-area-${index}`}
                          onDragOver={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            setValue(`steps.${index}.isDragOver`, true); // Actualizar isDragOver
                          }}
                          onDragLeave={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            setValue(`steps.${index}.isDragOver`, false); // Actualizar isDragOver
                          }}
                          onDrop={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            const files = e.dataTransfer.files;
                            setValue(`steps.${index}.isDragOver`, false); // Resetear isDragOver

                            if (files.length > 0) {
                              const file = files[0];
                              if (!validateImageFile(file)) {
                                return; // Salir si la validación falla
                              }
                              // Revocar URL anterior si existe
                              if (watch(`steps.${index}.imagePreview`)) {
                                URL.revokeObjectURL(watch(`steps.${index}.imagePreview`));
                              }
                              const url = URL.createObjectURL(file);
                              // Actualizar el objeto del paso directamente con la imagen y su vista previa
                              setValue(`steps.${index}.image`, file);
                              setValue(`steps.${index}.imagePreview`, url);
                            }
                          }}
                        >
                          {watch(`steps.${index}.imagePreview`) ? ( // Usar watch para imagePreview
                            <>
                              <img
                                src={watch(`steps.${index}.imagePreview`)}
                                alt={`Imagen paso ${index + 1}`}
                                className="object-contain w-full h-full"
                                data-testid={`step-image-preview-${index}`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  // Revocar la URL al eliminar
                                  if (watch(`steps.${index}.imagePreview`)) {
                                    URL.revokeObjectURL(watch(`steps.${index}.imagePreview`));
                                  }
                                  // Eliminar imagen y vista previa
                                  setValue(`steps.${index}.image`, null);
                                  setValue(`steps.${index}.imagePreview`, null);
                                }}
                                className="absolute top-2 right-2 bg-white/80 text-red-600 border border-red-300 rounded-full px-2 py-1 text-xs hover:bg-white"
                                data-testid={`delete-step-image-${index}`}
                              >
                                Eliminar
                              </button>
                            </>
                          ) : (
                            <>
                              <Image className="w-8 h-8 text-accent" data-testid={`step-upload-icon-${index}`} />
                              <label
                                className="mt-2 px-4 py-1 border-2 border-accent rounded-xl text-accent cursor-pointer"
                                data-testid={`step-upload-label-${index}`}
                              >
                                Añadir Foto
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    if (!validateImageFile(file)) return;
                                    // Revocar URL anterior si existe
                                    if (watch(`steps.${index}.imagePreview`)) {
                                        URL.revokeObjectURL(watch(`steps.${index}.imagePreview`));
                                    }
                                    const url = URL.createObjectURL(file);
                                    // Actualizar el objeto del paso directamente con la imagen y su vista previa
                                    setValue(`steps.${index}.image`, file);
                                    setValue(`steps.${index}.imagePreview`, url);
                                  }}
                                  data-testid={`step-image-input-${index}`}
                                />
                              </label>
                              {watch(`steps.${index}.isDragOver`) && ( // Usar watch para isDragOver
                                <p className="text-accent text-sm mt-2">Suelta la imagen aquí</p>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendStep({ text: "", image: null, imagePreview: null, isDragOver: false })
                  }
                  className="border rounded-xl px-6 py-3 h-10 flex justify-center items-center"
                  data-testid="add-step-button"
                >
                  Añadir paso
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Guardar */}
            <Button
              type="submit"
              className="w-full border border-accent text-accent rounded-full py-2 mt-6"
              data-testid="submit-recipe-button"
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;