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
      ingredients: [{ name: "", quantity: "", unit: "" }],
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
      return false;
    }
    if (file.size > maxSize) {
      return false;
    }
    return true;
  };

  const processImageFile = (file) => {
    if (!file) return;
    if (!validateImageFile(file)) return;
    setValue("foto", file);
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
  };

  const categoriasSeleccionadas = watch("categoriasSeleccionadas") || [];

  const handleCategoriaChange = (categoria) => {
    let seleccionadas = categoriasSeleccionadas || [];
    if (seleccionadas.includes(categoria.id)) {
      seleccionadas = seleccionadas.filter((id) => id !== categoria.id);
    } else {
      seleccionadas = [...seleccionadas, categoria.id];
    }
    setValue("categoriasSeleccionadas", seleccionadas);
  };

  const handleIngredientChange = async (e, index) => {
    const value = e.target.value;
    setValue(`ingredients.${index}.name`, value);
    const found = allIngredients.find(i => i.name === value);
    if (found && found.unit_type_id) {
      if (!unitsByType[found.unit_type_id]) {
        try {
          const units = await unitService.getUnitByUnitTypeId(found.unit_type_id);
          setUnitsByType(prev => ({ ...prev, [found.unit_type_id]: units }));
          if (units && units.length > 0) {
            setValue(`ingredients.${index}.unit`, units[0].abbreviation || units[0].name || "");
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
            setValue(`ingredients.${index}.unit`, unitTypeName);
          }
        } catch {
          setValue(`ingredients.${index}.unit`, "");
        }
      } else {
        const units = unitsByType[found.unit_type_id];
        if (units && units.length > 0) {
          setValue(`ingredients.${index}.unit`, units[0].abbreviation || units[0].name || "");
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
          setValue(`ingredients.${index}.unit`, unitTypeName);
        }
      }
    } else {
      setValue(`ingredients.${index}.unit`, "");
    }
  };

  // Mostrar todos los datos recopilados para todas las tablas
  const mostrarDatosAGuardar = (data) => {
    const receta = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      tiempo: data.tiempo,
      comensales: data.comensales,
      foto: data.foto ? data.foto.name : null,
    };

    const categorias = data.categoriasSeleccionadas.map(id => {
      const todas = [...parentCategories, ...childCategories];
      const cat = todas.find(c => c.id === id);
      return cat ? `${cat.name} (ID: ${cat.id})` : `ID: ${id}`;
    });

    const ingredientes = data.ingredients.map(ing => ({
      nombre: ing.name,
      cantidad: ing.quantity,
      unidad: ing.unit,
    }));

    const pasos = data.steps.map((step, i) => ({
      paso: i + 1,
      texto: step.text,
      imagen: step.image ? step.image.name : null,
    }));

    return `
Tabla recetas
${JSON.stringify(receta, null, 2)}

Tabla recetas_categorias
${JSON.stringify(categorias, null, 2)}

Tabla recetas_ingredientes
${JSON.stringify(ingredientes, null, 2)}

Tabla recetas_pasos
${JSON.stringify(pasos, null, 2)}
    `;
  };

  const onSubmit = async (data) => {
    // Mostrar todos los datos recopilados antes de grabar
    setMensaje("Datos a guardar:\n" + mostrarDatosAGuardar(data));
    await new Promise(resolve => setTimeout(resolve, 10000)); // Espera 10 segundos

    try {
      // Guardar la receta principal en el backend
      const recipePayload = new FormData();
      recipePayload.append("name", data.nombre);
      recipePayload.append("description", data.descripcion);
      recipePayload.append("duration_minutes", parseInt(data.tiempo, 10));
      recipePayload.append("commensals", parseInt(data.comensales, 10));
      if (data.foto) {
        recipePayload.append("photo", data.foto);
      }

      const recetaGuardada = await recipeService.createRecipe(recipePayload);

      setMensaje(
        "Datos a guardar:\n" +
        mostrarDatosAGuardar(data) +
        `\n\nReceta guardada correctamente. ID de la receta creada: ${recetaGuardada.id || "(no disponible)"}`
      );
      reset();
    } catch (error) {
      let errorMsg = "Error al guardar la receta.";
      if (error.response && error.response.data) {
        errorMsg += "\nDetalles: " + JSON.stringify(error.response.data, null, 2);
      } else if (error.message) {
        errorMsg += "\nDetalles: " + error.message;
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

        {/* Mensaje */}
        {mensaje && (
          <div
            className="mb-4 px-3 py-4 rounded-lg text-sm font-mono text-white bg-footer text-left transition-all duration-300"
            data-testid="console-message"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
          >
            {mensaje}
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
              render={({ field }) => (
                <Input
                  {...field}
                  id="nombre-receta"
                  label="Nombre de la receta"
                  placeholder="Ej: Huevos rancheros, fabada ..."
                  data-testid="recipe-name-input"
                  className="focus:outline-none"
                />
              )}
            />

            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="descripcion-receta">
              Descripción
            </label>
            <Controller
              control={control}
              name="descripcion"
              render={({ field }) => (
                <textarea
                  {...field}
                  id="descripcion-receta"
                  placeholder="Ej: Un platillo tradicional con un toque especial..."
                  data-testid="recipe-description-input"
                  className="w-full border border-gray-300 rounded-lg p-2 resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-accent bg-white"
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
                  Tiempo
                </label>
                <Controller
                  control={control}
                  name="tiempo"
                  render={({ field }) => (
                    <div className="relative">
                      <Input
                        {...field}
                        id="tiempo-preparacion"
                        label="Time"
                        type="number"
                        placeholder="15"
                        className="pr-10 focus:outline-none"
                        data-testid="time-input"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                        min
                      </span>
                    </div>
                  )}
                />
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
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="comensales"
                      type="number"
                      placeholder="Ej: 4"
                      className="w-full focus:outline-none"
                      data-testid="commensals-input"
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
                      render={({ field }) => (
                        <>
                          <Input
                            {...field}
                            id={`ingredient-name-${index}`}
                            list={`ingredientes-list-${index}`}
                            placeholder="Ej: Harina, Leche..."
                            className="w-full focus:outline-none"
                            onChange={e => handleIngredientChange(e, index)}
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
                          render={({ field }) => (
                            <Input
                              {...field}
                              id={`ingredient-quantity-${index}`}
                              type="number"
                              placeholder="Cantidad"
                              className="w-full focus:outline-none"
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
                          render={({ field }) => {
                            const ingName = watch(`ingredients.${index}.name`);
                            const found = allIngredients.find(i => i.name === ingName);
                            const units = found && found.unit_type_id ? (unitsByType[found.unit_type_id] || []) : [];

                            return units.length > 0 ? (
                              <select
                                {...field}
                                id={`ingredient-unit-${index}`}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none bg-white"
                              >
                                <option value="">Selecciona unidad</option>
                                {units.map(u => (
                                  <option key={u.id} value={u.abbreviation || u.name}>
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
                                readOnly
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
                      render={({ field }) => (
                        <textarea
                          {...field}
                          id={`step-textarea-${index}`}
                          placeholder={`Describe el paso ${index + 1}`}
                          data-testid={`step-input-${index}`}
                          className="w-full border border-gray-300 rounded-lg p-2 resize-y min-h-[60px] focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                        />
                      )}
                    />
                    {/* Área de imagen del paso */}
                    <Controller
                      control={control}
                      name={`steps.${index}`}
                      render={({ field }) => (
                        <div
                          className={`bg-white border border-gray-300 rounded-xl h-48 flex flex-col justify-center items-center overflow-hidden relative transition-all duration-200 ${
                            field.value?.isDragOver ? "border-accent border-2 bg-accent/5" : ""
                          }`}
                          data-testid={`step-image-upload-area-${index}`}
                          onDragOver={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            field.onChange({ ...field.value, isDragOver: true });
                          }}
                          onDragLeave={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            field.onChange({ ...field.value, isDragOver: false });
                          }}
                          onDrop={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            const files = e.dataTransfer.files;
                            let imagePreview = field.value?.imagePreview;
                            if (files.length > 0) {
                              const file = files[0];
                              if (!validateImageFile(file)) {
                                field.onChange({ ...field.value, isDragOver: false });
                                return;
                              }
                              if (imagePreview) URL.revokeObjectURL(imagePreview);
                              const url = URL.createObjectURL(file);
                              field.onChange({ ...field.value, image: file, imagePreview: url, isDragOver: false });
                            } else {
                              field.onChange({ ...field.value, isDragOver: false });
                            }
                          }}
                        >
                          {field.value?.imagePreview ? (
                            <>
                              <img
                                src={field.value.imagePreview}
                                alt={`Imagen paso ${index + 1}`}
                                className="object-contain w-full h-full"
                                data-testid={`step-image-preview-${index}`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (field.value?.imagePreview) URL.revokeObjectURL(field.value.imagePreview);
                                  field.onChange({ ...field.value, image: null, imagePreview: null });
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
                                    if (field.value?.imagePreview) URL.revokeObjectURL(field.value.imagePreview);
                                    const url = URL.createObjectURL(file);
                                    field.onChange({ ...field.value, image: file, imagePreview: url });
                                  }}
                                  data-testid={`step-image-input-${index}`}
                                />
                              </label>
                              {field.value?.isDragOver && (
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