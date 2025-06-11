import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Image, Plus } from "lucide-react";
import { ingredientesMock } from "../data/mockData";
import { Button, Input } from "../components/";

const AddRecipe = () => {
  // Estado para categorías desde la API
  const [categorias, setCategorias] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      tiempo: "",
      categoriasSeleccionadas: [],
      foto: null,
      ingredients: [{ name: "", quantity: "", unit: "" }],
      steps: [{ text: "", image: null, imagePreview: null, isDragOver: false }],
    },
  });

  // Field arrays para ingredientes y pasos
  const {
    fields: ingredientFields,
    append: appendIngredient,
    update: updateIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const {
    fields: stepFields,
    append: appendStep,
    update: updateStep,
  } = useFieldArray({
    control,
    name: "steps",
  });

  // Cargar categorías desde la API
  useEffect(() => {
    fetch("http://localhost:8000/api/categories/")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch(() => setCategorias([]));
  }, []);

  // Si no hay categorías desde la API, usar mock y adaptar estructura
  const categoriasToShow = categorias.length > 0
    ? categorias
    : ingredientesMock.map((cat, idx) =>
        typeof cat === "string"
          ? { id: idx, name: cat }
          : { id: cat.id ?? idx, name: cat.name ?? String(cat) }
      );

  // Imagen principal
  const foto = watch("foto");

  // Vista previa de imagen principal
  useEffect(() => {
    if (foto && foto instanceof File) {
      const url = URL.createObjectURL(foto);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [foto]);

  // Manejo de imagen principal
  const processImageFile = (file) => {
    if (!file) return;
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024;
    if (!tiposPermitidos.includes(file.type)) {
      alert("Solo se permiten imágenes JPEG, PNG o WebP");
      return;
    }
    if (file.size > maxSize) {
      alert("La imagen no puede superar los 2MB");
      return;
    }
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

  // Manejo de selección de categorías
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

  // Ingredientes
  const handleIngredientChange = (index, key, value) => {
    const updated = [...getValues("ingredients")];
    updated[index][key] = value;
    setValue("ingredients", updated);
  };

  // Pasos
  const handleStepChange = (index, key, value) => {
    const updated = [...getValues("steps")];
    updated[index][key] = value;
    setValue("steps", updated);
  };

  // Envío del formulario
  const onSubmit = (data) => {
    const recipe = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      categorias: data.categoriasSeleccionadas,
      tiempo: data.tiempo,
      ingredients: data.ingredients,
      pasos: data.steps.map((step) => ({
        texto: step.text,
        imagen: step.image ? step.image.name : null,
      })),
      imagen: data.foto ? data.foto.name : null,
    };
    console.log("Receta enviada con éxito:", recipe);

    if (data.foto) {
      console.log("Simulando subida de imagen...");
      setTimeout(() => {
        console.log(`Imagen "${data.foto.name}" subida y procesada correctamente.`);
      }, 1000);
    }
    reset(); // limpiar el formulario tras enviar
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

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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

            <div className="flex gap-4">
              <div className="flex-1 relative" data-testid="category-input-wrapper">
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <div
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white cursor-pointer"
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
                  <div className="absolute left-0 w-full border border-gray-300 rounded-lg bg-white mt-2 p-2 shadow-lg z-10">
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

              <div className="flex-[0.6]">
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
                  onClick={() => appendIngredient({ name: "", quantity: "", unit: "" })}
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
                              if (imagePreview) URL.revokeObjectURL(imagePreview);
                              const file = files[0];
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
                                    if (file) {
                                      if (field.value?.imagePreview) URL.revokeObjectURL(field.value.imagePreview);
                                      const url = URL.createObjectURL(file);
                                      field.onChange({ ...field.value, image: file, imagePreview: url });
                                    }
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