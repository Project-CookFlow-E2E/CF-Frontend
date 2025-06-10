/**
   * Valida y procesa un archivo de imagen.
   * @param {File} file - Archivo a validar y procesar.
   *//**
 * @file AddRecipe.jsx
 * @module AddRecipe
 * @description Página para que el usuario cree una nueva receta de cocina.
 * Permite ingresar título, imagen, categoría, tiempo, ingredientes y pasos.
 * También realiza validaciones básicas de tipo y tamaño de imagen antes de subir.
 * Ahora incluye funcionalidad de drag & drop para imágenes.
 * 
 * 👉 Esta página se conecta visualmente con el resto de la app y en el futuro deberá integrarse con una API.
 * Actualmente utiliza datos simulados (mock) para categorías e ingredientes.
 * 
 * @author Nico
 */

import { useState } from "react";
import { Image, Plus } from "lucide-react";
import { categoriasMock, ingredientesMock } from "../data/mockData";
import { AutocompleteInput, Button, Input } from "../components/";

const AddRecipe = () => {
  // const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([{ text: "", image: null, imagePreview: null, isDragOver: false }]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }]);  
  // const [categoria, setCategoria] = useState("");
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tiempo, setTiempo] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  /**
   * Añade un nuevo campo de ingrediente a la lista.
   * faltaban dos campos quantity y unit
   * @author Rafael
   */
  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };
  const handleCategoriaChange = (categoria) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(categoria)
        ? prev.filter((item) => item !== categoria)
        : [...prev, categoria]
    );
  };
  /**
   * Añade un nuevo campo de paso a la lista.
   * añadi una imagen a cada paso y Drop para subirla
   * @author Rafael
   */
  const addStep = () => setSteps([...steps, { text: "", image: null, imagePreview: null, isDragOver: false }]);

  /**
   * Maneja la subida de imagen para un paso específico.
   * @param {number} stepIndex - Índice del paso.
   * @param {File} file - Archivo de imagen.
   */
  const handleStepImageUpload = (stepIndex, file) => {
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

    const newSteps = [...steps];
    newSteps[stepIndex].image = file;
    newSteps[stepIndex].imagePreview = URL.createObjectURL(file);
    setSteps(newSteps);
  };

  /**
   * Maneja el evento de drag over para un paso específico.
   * @param {DragEvent} e - Evento de drag over.
   * @param {number} stepIndex - Índice del paso.
   * @author Rafael

   */
  const handleStepDragOver = (e, stepIndex) => {
    e.preventDefault();
    e.stopPropagation();
    const newSteps = [...steps];
    newSteps[stepIndex].isDragOver = true;
    setSteps(newSteps);
  };

  /**
   * Maneja el evento de drag leave para un paso específico.
   * @param {DragEvent} e - Evento de drag leave.
   * @param {number} stepIndex - Índice del paso.
   * @author Rafael
   */
  const handleStepDragLeave = (e, stepIndex) => {
    e.preventDefault();
    e.stopPropagation();
    const newSteps = [...steps];
    newSteps[stepIndex].isDragOver = false;
    setSteps(newSteps);
  };

  /**
   * Maneja el evento de drop para un paso específico.
   * @param {DragEvent} e - Evento de drop.
   * @param {number} stepIndex - Índice del paso.
   * @author Rafael
   */
  const handleStepDrop = (e, stepIndex) => {
    e.preventDefault();
    e.stopPropagation();
    const newSteps = [...steps];
    newSteps[stepIndex].isDragOver = false;
    setSteps(newSteps);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleStepImageUpload(stepIndex, file);
    }
  };

  /**
   * Elimina la imagen de un paso específico.
   * @param {number} stepIndex - Índice del paso.
   */
  const deleteStepImage = (stepIndex) => {
    const newSteps = [...steps];
    if (newSteps[stepIndex].imagePreview) {
      URL.revokeObjectURL(newSteps[stepIndex].imagePreview);
    }
    newSteps[stepIndex].image = null;
    newSteps[stepIndex].imagePreview = null;
    setSteps(newSteps);
  };
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

    setFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  /**
   * Maneja el cambio de archivo de imagen: realiza validación de tipo y tamaño antes de aceptar.
   * @param {Event} e - Evento de cambio de input file.
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  /**
   * Maneja el evento de drag over para permitir el drop.
   * @param {DragEvent} e - Evento de drag over.
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  /**
   * Maneja el evento de drag leave para quitar el estado visual.
   * @param {DragEvent} e - Evento de drag leave.
   * @author Rafael
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  /**
   * Maneja el evento de drop para procesar la imagen arrastrada.
   * @param {DragEvent} e - Evento de drop.
   * @author Rafael
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      processImageFile(file);
    }
  };

  /**
   * Elimina la imagen actualmente seleccionada y su vista previa.
   */
  const deleteImg = () => {
    setFoto(null);
    setPreview(null);
  };

  /**
   * Maneja el envío del formulario.
   * Por ahora, muestra la receta por consola y simula subida de imagen.
   */
  const handleSubmit = async () => {
    const recipe = {
      nombre,
      // categoria,
      tiempo,
      ingredients,
      pasos: steps.map(step => ({
        texto: step.text,
        imagen: step.image ? step.image.name : null
      })),
      imagen: foto ? foto.name : null,
    };

    console.log("Receta enviada con éxito:", recipe);

    if (foto) {
      console.log("Simulando subida de imagen...");

      setTimeout(() => {
        console.log(`Imagen "${foto.name}" subida y procesada correctamente.`);
      }, 1000);
    }
  };

    // Modificación: Ahora maneja `name`, `quantity` y `unit`

  const handleIngredientChange = (index, key, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][key] = value;
    setIngredients(updatedIngredients);
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
            isDragOver ? 'border-accent border-2 bg-accent/5' : ''
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

        {/* Formulario de datos */}

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nombre-receta">
            Nombre de la receta
          </label>
          <Input
            id="nombre-receta"
            label="Nombre de la receta"
            placeholder="Ej: Huevos rancheros, fabada ..."
            onChange={(e) => setNombre(e.target.value)}
            data-testid="recipe-name-input"
          />
        {/* Descripción de la receta */}
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="descripcion-receta">
            Descripción
          </label>
          <Input
              id="descripcion-receta"
              label="Descripción de la receta"
              placeholder="Ej: Un platillo tradicional con un toque especial..."
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              data-testid="recipe-description-input"
            />


          <div className="flex gap-4">
            {/* <div className="flex-1" data-testid="category-input-wrapper">
              <AutocompleteInput
                label="Categoría"
                suggestions={categoriasMock}
                placeholder="Selecciona una categoría"
                onChange={(value) => setCategoria(value)}
                data-testid="category-input"
              />
            </div> */}
            {/* cuadro combinado */}
            {/* <div className="flex-1" data-testid="category-input-wrapper">
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <select
                multiple
                className="w-full border rounded-lg p-2"
                value={categoriasSeleccionadas}
                onChange={handleCategoriaChange}
                data-testid="category-select"
              >
                {categoriasMock.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="flex-1 relative" data-testid="category-input-wrapper">
                  <label className="block text-sm font-medium text-gray-700">Categoría</label>

                  {/* 🔹 Campo visual que simula un cuadro combinado */}
                  <div
                    className="w-full border rounded-lg p-2 bg-white cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {categoriasSeleccionadas.length > 0
                      ? categoriasSeleccionadas.join(", ")
                      : "Selecciona categorías"}
                  </div>

                  {/* 🔹 Lista desplegable con el mismo ancho que el campo */}
                  {dropdownOpen && (
                      <div className="absolute left-0 w-full rounded-lg bg-white mt-2 p-2 shadow-lg z-10">
                      {categoriasMock.map((categoria) => (
                        <div
                          key={categoria}
                          className={`p-2 hover:bg-gray-200 cursor-pointer ${
                            categoriasSeleccionadas.includes(categoria) ? "bg-gray-300" : ""
                          }`}
                          onClick={() => handleCategoriaChange(categoria)}
                        >
                          {categoria}
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
              <div className="relative">
                <Input
                  id="tiempo-preparacion"
                  label="Time"
                  type="number"
                  placeholder="15"
                  className="pr-10"
                  onChange={(e) => setTiempo(e.target.value)}
                  data-testid="time-input"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  min
                </span>
              </div>
            </div>
          </div>

          
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes</label>
  <div className="flex flex-col gap-3 items-center">
    {ingredients.map((ingredient, index) => (
      <div key={index} className="flex flex-col w-full gap-2">
        {/* 🔹 Ingrediente en una sola línea */}
        <AutocompleteInput
          placeholder={`Ingrediente ${index + 1}`}
          suggestions={ingredientesMock}
          value={ingredient.name}
          onChange={(val) => handleIngredientChange(index, "name", val)}
        />

        {/* 🔹 Cantidad y unidad alineadas debajo del ingrediente */}
        <div className="flex gap-4">
          <Input
            type="number"
            placeholder="Cantidad"
            value={ingredient.quantity}
            onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
            className="w-24"
          />

          <Input
            placeholder="Unidad (ej. g, ml, taza)"
            value={ingredient.unit}
            onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
            className="w-28"
          />
        </div>
      </div>
    ))}
    
    <button onClick={addIngredient} className="border px-6 py-3 rounded-xl h-10 flex justify-center items-center">
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
              {steps.map((step, index) => (
                <div key={index} className="w-full space-y-3">
                  <Input
                    placeholder={`Paso número ${index + 1}`}
                    value={step.text}
                    onChange={(e) => {
                      const nuevos = [...steps];
                      nuevos[index].text = e.target.value;
                      setSteps(nuevos);
                    }}
                    data-testid={`step-input-${index}`}
                  />
                  
                  {/* Área de imagen del paso - igual al diseño principal */}
                  <div
                    className={`bg-white border border-gray-300 rounded-xl h-48 flex flex-col justify-center items-center overflow-hidden relative transition-all duration-200 ${
                      step.isDragOver ? 'border-accent border-2 bg-accent/5' : ''
                    }`}
                    data-testid={`step-image-upload-area-${index}`}
                    onDragOver={(e) => handleStepDragOver(e, index)}
                    onDragLeave={(e) => handleStepDragLeave(e, index)}
                    onDrop={(e) => handleStepDrop(e, index)}
                  >
                    {step.imagePreview ? (
                      <>
                        <img
                          src={step.imagePreview}
                          alt={`Imagen paso ${index + 1}`}
                          className="object-contain w-full h-full"
                          data-testid={`step-image-preview-${index}`}
                        />
                        <button
                          onClick={() => deleteStepImage(index)}
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
                            onChange={(e) => handleStepImageUpload(index, e.target.files[0])}
                            data-testid={`step-image-input-${index}`}
                          />
                        </label>
                        {step.isDragOver && (
                          <p className="text-accent text-sm mt-2">Suelta la imagen aquí</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={addStep}
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
            onClick={handleSubmit}
            className="w-full border border-accent text-accent rounded-full py-2 mt-6"
            data-testid="submit-recipe-button"
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;