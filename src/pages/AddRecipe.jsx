import { useState } from "react";
import { Image, Plus } from "lucide-react";
import { Input } from "../components/";
import { categoriasMock, ingredientesMock } from "../data/mockData";
import AutocompleteInput from "../components/AutocompleteInput";

const AddRecipe = () => {
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const addStep = () => setSteps([...steps, ""]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
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
    setPreview(URL.createObjectURL(file)); // ✅ crea la vista previa temporal
  };

  const deleteImg = () => {
    setFoto(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    const recipe = {
      nombre,
      categoria,
      tiempo,
      ingredients,
      pasos: steps,
      imagen: foto ? foto.name : null,
    };

    console.log("Receta enviada con éxito:", recipe);

    if (foto) {
      console.log("Simulando subida de imagen...");

      // Simulación con setTimeout
      setTimeout(() => {
        console.log(`Imagen "${foto.name}" subida y procesada correctamente.`);
      }, 1000);
    }
  };
  return (
    <div className="min-h-screen pb-20 bg-background p-4">
      <div className="max-w-md mx-auto">
        <button className="mb-4">
          <span className="text-2xl">←</span>
        </button>
        <h1 className="text-2xl font-semibold text-center mb-6">
          Añadir receta
        </h1>

        <div className="bg-white border border-gray-300 rounded-xl h-48 flex flex-col justify-center items-center mb-6 overflow-hidden relative">
          {preview ? (
            <>
              <img
                src={preview}
                alt="Vista previa"
                className="object-cover w-full h-full"
              />
              <button
                onClick={deleteImg}
                className="absolute top-2 right-2 bg-white/80 text-red-600 border border-red-300 rounded-full px-2 py-1 text-xs hover:bg-white"
              >
                Eliminar
              </button>
            </>
          ) : (
            <>
              <Image className="w-8 h-8 text-accent" />
              <label className="mt-2 px-4 py-1 border-2 border-accent rounded-xl text-accent cursor-pointer">
                Añadir Foto
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </>
          )}
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la receta
          </label>
          <Input
            label="Nombre de la receta"
            placeholder="Ej: Huevos rancheros, fabada ..."
            onChange={(e) => {
              setNombre(e.target.value);
            }}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <AutocompleteInput
                label="Categoría"
                suggestions={categoriasMock}
                placeholder="Selecciona una categoría"
                onChange={(value) => setCategoria(value)}
              />
            </div>
            <div className="flex-[0.6]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo
              </label>
              <div className="relative">
                <Input
                  label="Time"
                  type="number"
                  placeholder="15"
                  className="pr-10"
                  onChange={(e) => {
                    setTiempo(e.target.value);
                  }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  min
                </span>
              </div>
            </div>
          </div>

          <div className="items-center">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingredientes
            </label>
            <div className="flex justify-center flex-wrap gap-3 items-center">
              {ingredients.map((value, index) => (
                <AutocompleteInput
                  key={index}
                  label=""
                  suggestions={ingredientesMock}
                  placeholder={`Ingrediente número ${index + 1}`}
                  value={value}
                  onChange={(val) => {
                    const nuevos = [...ingredients];
                    nuevos[index] = val;
                    setIngredients(nuevos);
                  }}
                />
              ))}
              <button
                onClick={addIngredient}
                className="border px-6 py-3 rounded-xl h-10 flex justify-center items-center"
              >
                Añadir ingrediente
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pasos de la preparación
            </label>
            <div className="flex flex-col gap-3 items-center">
              {steps.map((value, index) => (
                <Input
                  key={index}
                  placeholder={`Paso número ${index + 1}`}
                  className="mb-2"
                  value={value}
                  onChange={(e) => {
                    const nuevos = [...steps];
                    nuevos[index] = e.target.value;
                    setSteps(nuevos);
                  }}
                />
              ))}
              <button
                onClick={addStep}
                className="border rounded-xl px-6 py-3 h-10 flex justify-center items-center"
              >
                Añadir paso
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full border border-accent text-accent rounded-full py-2 mt-6"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
