/**
 * Componente AddRecipe
 * Permite crear una nueva receta con imagen, ingredientes, pasos y categorías.
 * Utiliza React Hook Form para la gestión del formulario.
 * @modify Rafael Fernández
 */
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Image, Plus } from "lucide-react";
import { Button, Input } from "../components/";
import { recipeService } from "../services/recipeService";
import {categoryService} from "../services/categoryService";


const AddRecipe = () => {
  const [categorias, setCategorias] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [mensaje, setMensaje] = useState("");

  /**
   * @typedef {Object} Ingredient
   * @property {string} name           Nombre del ingrediente.
   * @property {string} quantity       Cantidad del ingrediente.
   * @property {string} type           Tipo de unidad (ej. sólido, líquido).
   * @property {string} unit           Unidad de medida (ej. g, ml, taza).
   *
   * @typedef {Object} Step
   * @property {string}       text          Descripción del paso.
   * @property {File|null}    image         Archivo de imagen asociado al paso o null.
   * @property {string|null}  imagePreview  URL de vista previa de la imagen o null.
   * @property {boolean}      isDragOver    Flag que indica si el área está en estado drag-over.
   *
   * @typedef {Object} FormValues
   * @property {string}            nombre                    Nombre de la receta.
   * @property {string}            descripcion               Descripción de la receta.
   * @property {string}            tiempo                    Tiempo de preparación (minutos).
   * @property {number[]}          categoriasSeleccionadas   IDs de las categorías seleccionadas.
   * @property {number}            comensales                Número de comensales.
   * @property {File|null}         foto                      Archivo de la foto principal o null.
   * @property {Ingredient[]}      ingredients               Array de ingredientes.
   * @property {Step[]}            steps                     Array de pasos de preparación.
   */

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
      ingredients: [{ name: "", quantity: "", type: "", unit: "" }],
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
  categoryService.getAllCategories()
    .then((data) => {
      console.log("Respuesta de categorías:", data);
      // Si la respuesta es { results: [...] }
      const categoriasArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];
      // Agrupa por nombre único de categoría
      const uniqueMap = new Map();
      categoriasArray.forEach(cat => {
        const key = (cat.name || "").trim().toLowerCase();
        if (key && !uniqueMap.has(key)) {
          uniqueMap.set(key, cat);
        }
      });
      setCategorias(Array.from(uniqueMap.values()));
    })
    .catch(() => setCategorias([]));
}, []);

const categoriasToShow = categorias.length > 0
  ? categorias.map(cat => ({
      id: cat.id,
      name: cat.name
    }))
  : [];

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

  // Validación de imágenes (receta y pasos)
  const validateImageFile = (file) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024;
    if (!tiposPermitidos.includes(file.type)) {
      setMensaje("Solo se permiten imágenes JPEG, PNG o WebP");
      setTimeout(() => setMensaje(""), 3000);
      return false;
    }
    if (file.size > maxSize) {
      setMensaje("La imagen no puede superar los 2MB");
      setTimeout(() => setMensaje(""), 3000);
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

  const categoriasSeleccionadas = watch("categoriasSeleccionadas");
  const handleCategoriaChange = (categoria) => {
    const seleccionadas = categoriasSeleccionadas || [];
    if (seleccionadas.includes(categoria.id)) {
      setValue(
        "categoriasSeleccionadas",
        seleccionadas.filter((id) => id !== categoria.id)
      );
    } else {
      setValue("categoriasSeleccionadas", [...seleccionadas, categoria.id]);
    }
  };

  const onSubmit = async (data) => {
    try {
      const recipePayload = {
        name: data.nombre,
        description: data.descripcion,
        duration_minutes: parseInt(data.tiempo, 10),
        commensals: parseInt(data.comensales, 10),
        categories: data.categoriasSeleccionadas,
        ingredients: data.ingredients.map(i => ({
          name: i.name,
          quantity: i.quantity,
          type: i.type,
          unit: i.unit,
        })),
      };
      await recipeService.createRecipe(recipePayload);
      setMensaje("Receta guardada correctamente");
      setTimeout(() => setMensaje(""), 2000);
      reset();
    } catch (error) {
      setMensaje("Error al guardar la receta");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-background p-4" data-testid="add-recipe-page">
      <div className="max-w-md mx-auto">
        <button className="mb-4" data-testid="back-button">
          <span className="text-2xl">←</span>
        </button>
        <h1 className="text-2xl font-semibold text-center mb-6" data-testid="add-recipe-title">
          Añadir receta
        </h1>

        {mensaje && (
          <div
            className="mb-4 px-3 py-4 rounded-lg text-lg font-semibold text-white bg-footer text-center transition-all duration-300"
            data-testid="console-message"
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

            <div className="relative" data-testid="category-input-wrapper">
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <div
                className="w-full border border-gray-300 rounded-lg px-3 pr-10 bg-white cursor-pointer h-10 flex items-center"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {categoriasSeleccionadas && categoriasSeleccionadas.length > 0
                  ? categoriasToShow
                      .filter((cat) => categoriasSeleccionadas.includes(cat.id))
                      .map((cat) => cat.name)
                      .join(", ")
                  : (
                    <span className="text-gray-700">Selecciona categorías</span>
                  )
                }
              </div>
              {dropdownOpen && (
                <div
                  className="absolute left-0 w-full border border-gray-300 rounded-lg bg-white mt-2 p-2 shadow-lg z-10"
                  style={{ maxHeight: "12rem", overflowY: "auto" }} // 5 items aprox (5 x 2.4rem)
                >
                  {categoriasToShow.map((categoria) => (
                    <div
                      key={categoria.id}
                      className={`p-2 hover:bg-gray-200 cursor-pointer ${
                        categoriasSeleccionadas && categoriasSeleccionadas.includes(categoria.id)
                          ? "bg-gray-300"
                          : ""
                      }`}
                      onClick={() => handleCategoriaChange(categoria)}
                    >
                      {categoria.name}
                    </div>
                  ))}
                </div>
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
                        className="pr-10"
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
                      className="w-full"
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
                  <div key={ingredient.id} className="flex flex-col w-full gap-2">
                    <Controller
                      control={control}
                      name={`ingredients.${index}.name`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={`Ingrediente ${index + 1}`}
                          className="w-full"
                        />
                      )}
                    />
                    <div className="flex gap-4">
                      <Controller
                        control={control}
                        name={`ingredients.${index}.quantity`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            placeholder="Cantidad"
                            className="w-24"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`ingredients.${index}.type`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Tipo (ej. sólido, líquido)"
                            className="w-28"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`ingredients.${index}.unit`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Unidad (ej. g, ml, taza)"
                            className="w-28"
                          />
                        )}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendIngredient({ name: "", quantity: "", type: "", unit: "" })}
                  className="border px-6 py-3 rounded-xl h-10 flex justify-center items-center"
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
                  <div key={step.id} className="w-full space-y-3">
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