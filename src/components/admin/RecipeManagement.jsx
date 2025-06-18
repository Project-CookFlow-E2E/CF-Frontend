/**
 * @file RecipeManagement.jsx
 * @description
 * Componente de administración de recetas para el panel de administración.
 * Permite visualizar, buscar, editar y gestionar recetas.
 *
 * Funcionalidades principales:
 * - Listar todas las recetas existentes (conectadas al backend con recipeService.getAllRecipes).
 * - Buscar recetas por nombre mediante un input de búsqueda (consulta siempre al backend con debounce).
 * - Editar todos los campos requeridos por el backend (nombre, descripción, duración, comensales, categorías) mediante un modal.
 * - Añadir nuevas recetas con todos los campos requeridos (solo administradores).
 * - Acciones de edición y borrado para cada receta (con confirmación y refresco de la tabla tras la acción).
 * - Paginación: muestra 5 recetas por página, con navegación entre páginas.
 * - Ordena las recetas de la más reciente a la más antigua según la fecha de creación.
 * - Modal de detalles para ver la información completa de una receta.
 * - Validación de IDs de categorías: solo permite IDs numéricos, mostrando mensaje claro si no se cumple.
 * - Feedback visual de errores básico (alert), pendiente de mejora.
 *
 * Estados:
 * - recipes: array de recetas obtenidas del backend.
 * - loading: booleano para mostrar el estado de carga.
 * - editModal: controla la visibilidad y datos del modal de edición.
 * - editForm: almacena los valores del formulario de edición.
 * - addModal: controla la visibilidad del modal de añadir receta.
 * - addForm: almacena los valores del formulario de añadir receta.
 * - viewModal: controla la visibilidad del modal de ver receta.
 * - page: página actual de la paginación.
 * - search: término de búsqueda para filtrar recetas por nombre.
 *
 * Servicios utilizados:
 * - recipeService.getAllRecipes(): obtiene todas las recetas del backend.
 * - recipeService.updateRecipe(id, data): actualiza una receta.
 * - recipeService.createRecipe(data): crea una nueva receta.
 * - recipeService.deleteRecipe(id): elimina una receta.
 *
 * Uso:
 * Este componente está pensado para ser usado por administradores.
 * Permite buscar y modificar los campos requeridos de cada receta,
 * navegar entre páginas y ver las recetas ordenadas por fecha de creación.
 *
 * Solo los administradores pueden añadir o editar recetas (el acceso al panel ya está restringido).
 *
 * Cambios recientes:
 * - La búsqueda de recetas consulta siempre al backend (con debounce), mostrando resultados actualizados.
 * - Validación de categorías: solo permite IDs numéricos, con feedback claro.
 * - Feedback de errores básico con alert (pendiente de mejora visual).
 * - Modal de detalles para ver receta.
 * - Corrección en recipeService.js para updateRecipe (usa recipeId).
 * - Documentación actualizada y corregida la sintaxis del bloque de comentario.
 *
 * @author
 * Lorena Martínez, Noemi Casaprima
 * @modified
 * Ahora obtiene las recetas reales del backend usando recipeService.getAllRecipes
 *  y permite añadir/editar todos los campos requeridos por la API.
 */

import { useEffect, useState, useRef } from "react";
import { recipeService } from "../../services/recipeService";
import { useAuthStore } from '../../store/useAuthStore';

const PAGE_SIZE = 5;

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModal, setEditModal] = useState({ open: false, recipe: null });
  const [editForm, setEditForm] = useState({ name: "", description: "", duration_minutes: "", commensals: "", categories: "" });

  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", description: "", duration_minutes: "", commensals: "", categories: "" });

  const [viewModal, setViewModal] = useState({ open: false, recipe: null });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { user } = useAuthStore();
  const isAdmin = user && (user.is_admin || user.is_staff || user.role === 'admin');

  const searchTimeout = useRef();

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await recipeService.getAllRecipes();
        const sorted = [...data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setRecipes(sorted);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    // Si el buscador está vacío, carga todas las recetas
    if (!search.trim()) {
      recipeService.getAllRecipes().then((data) => {
        const sorted = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRecipes(sorted);
      });
      return;
    }
    // Si hay texto, busca en el backend (debounced)
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        // Busca recetas por nombre (case-insensitive)
        const data = await recipeService.getAllRecipes();
        const filtered = data.filter((rec) =>
          rec.name.toLowerCase().includes(search.toLowerCase())
        );
        const sorted = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRecipes(sorted);
      } catch (err) {
        setRecipes([]);
      }
    }, 350);
    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  const openEditModal = (recipe) => {
    setEditForm({
      name: recipe.name || "",
      description: recipe.description || "",
      duration_minutes: recipe.duration_minutes || "",
      commensals: recipe.commensals || "",
      categories: Array.isArray(recipe.categories) ? recipe.categories.join(",") : recipe.categories || "",
    });
    setEditModal({ open: true, recipe });
  };

  const closeEditModal = () => setEditModal({ open: false, recipe: null });

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const id = editModal.recipe.id;
    const updatedData = {
      name: editForm.name,
      description: editForm.description,
      duration_minutes: Number(editForm.duration_minutes),
      commensals: Number(editForm.commensals),
      categories: editForm.categories.split(',').map((id) => id.trim()),
    };
    await recipeService.updateRecipe(id, updatedData);
    // Refresca recetas
    const data = await recipeService.getAllRecipes();
    const sorted = [...data].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    setRecipes(sorted);
    closeEditModal();
  };

  const openViewModal = (recipe) => setViewModal({ open: true, recipe });
  const closeViewModal = () => setViewModal({ open: false, recipe: null });

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres borrar esta receta?')) return;
    try {
      await recipeService.deleteRecipe(id);
      // Refresca recetas
      const data = await recipeService.getAllRecipes();
      const sorted = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setRecipes(sorted);
    } catch (err) {
      alert('Error al borrar la receta.');
    }
  };

  const totalPages = Math.ceil(recipes.length / PAGE_SIZE);
  const paginatedRecipes = recipes.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Administrador de recetas
        </h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center"
          onClick={() => setAddModal(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Añadir nueva receta
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar recetas..."
          className="border px-3 py-2 rounded w-full max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Nombre
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Autor
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Categoría
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Fecha de creación
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Fecha de actualización
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Cargando...
                </td>
              </tr>
            ) : paginatedRecipes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No se encontraron recetas.
                </td>
              </tr>
            ) : (
              paginatedRecipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {recipe.name}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {recipe.user?.username || recipe.user || "-"}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {recipe.category || "-"}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {recipe.created_at || "-"}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {recipe.updated_at || "-"}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-2" onClick={() => openViewModal(recipe)}>
                      Ver
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-900 mr-2"
                      onClick={() => openEditModal(recipe)}
                    >
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(recipe.id)}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <button
          className="px-3 py-1 border rounded-md mr-1"
          onClick={handlePrev}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded-md"
          onClick={handleNext}
          disabled={page === totalPages || totalPages === 0}
        >
          Siguiente
        </button>
      </div>

      {editModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Editar Receta</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="Nombre de la receta"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="Descripción"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duración (minutos)</label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={editForm.duration_minutes}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="Duración en minutos"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Comensales</label>
                <input
                  type="number"
                  name="commensals"
                  value={editForm.commensals}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="Número de comensales"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categorías (IDs, separadas por coma)</label>
                <input
                  type="text"
                  name="categories"
                  value={editForm.categories}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="Ej: 1,2,3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para añadir receta */}
      {addModal && (
        <>
          {/* Overlay semitransparente */}
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
            onClick={() => setAddModal(false)}
            aria-label="Cerrar modal"
          />
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Añadir Receta</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  // Validación de categorías: deben ser IDs numéricos
                  const categoryIds = addForm.categories.split(',').map((id) => id.trim());
                  if (!categoryIds.every((id) => /^\d+$/.test(id))) {
                    alert("Las categorías deben ser IDs numéricos separados por coma. Ejemplo: 1,2,3");
                    return;
                  }
                  // Validación de ingredientes
                  if (!addForm.ingredients || addForm.ingredients.length === 0 || addForm.ingredients.some(i => !i.name || !i.quantity || !i.unit)) {
                    alert("Debes añadir al menos un ingrediente con nombre, cantidad y unidad.");
                    return;
                  }
                  // Validación de pasos
                  if (!addForm.steps || addForm.steps.length === 0 || addForm.steps.some(s => !s.text)) {
                    alert("Debes añadir al menos un paso de preparación con descripción.");
                    return;
                  }
                  try {
                    // Construir payload con imagen principal y pasos
                    const payload = {
                      name: addForm.name,
                      description: addForm.description,
                      duration_minutes: Number(addForm.duration_minutes),
                      commensals: Number(addForm.commensals),
                      categories: categoryIds,
                      ingredients: addForm.ingredients,
                      steps: addForm.steps,
                    };
                    if (addForm.image) payload.image = addForm.image;
                    await recipeService.createRecipe(payload);
                    setAddModal(false);
                    setAddForm({
                      name: "",
                      description: "",
                      duration_minutes: "",
                      commensals: "",
                      categories: "",
                      image: null,
                      imagePreview: null,
                      ingredients: [{ name: "", quantity: "", type: "", unit: "" }],
                      steps: [{ text: "", image: null, imagePreview: null }],
                    });
                    // Refresca recetas
                    const data = await recipeService.getAllRecipes();
                    const sorted = [...data].sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    );
                    setRecipes(sorted);
                  } catch (err) {
                    alert("Error al crear la receta. Verifica los campos obligatorios.");
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={addForm.name}
                      onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full border p-2 rounded"
                      placeholder="Nombre de la receta"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duración (minutos)</label>
                    <input
                      type="number"
                      name="duration_minutes"
                      value={addForm.duration_minutes}
                      onChange={(e) => setAddForm((f) => ({ ...f, duration_minutes: e.target.value }))}
                      className="w-full border p-2 rounded"
                      placeholder="Duración en minutos"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Comensales</label>
                    <input
                      type="number"
                      name="commensals"
                      value={addForm.commensals}
                      onChange={(e) => setAddForm((f) => ({ ...f, commensals: e.target.value }))}
                      className="w-full border p-2 rounded"
                      placeholder="Número de comensales"
                      min="1"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Descripción</label>
                    <textarea
                      name="description"
                      value={addForm.description}
                      onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
                      className="w-full border p-2 rounded"
                      placeholder="Descripción"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Categorías (IDs, separadas por coma)</label>
                    <input
                      type="text"
                      name="categories"
                      value={addForm.categories}
                      onChange={(e) => setAddForm((f) => ({ ...f, categories: e.target.value }))}
                      className="w-full border p-2 rounded"
                      placeholder="Ej: 1,2,3"
                      required
                    />
                  </div>
                </div>
                {/* Imagen principal */}
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-1">Imagen principal</label>
                  <div className="flex items-center gap-4">
                    {addForm.imagePreview && (
                      <img src={addForm.imagePreview} alt="Vista previa" className="h-24 w-24 object-cover rounded" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!file.type.startsWith('image/')) return;
                        if (addForm.imagePreview) URL.revokeObjectURL(addForm.imagePreview);
                        const url = URL.createObjectURL(file);
                        setAddForm(f => ({ ...f, image: file, imagePreview: url }));
                      }}
                    />
                    {addForm.imagePreview && (
                      <button
                        type="button"
                        className="text-red-500 text-xs"
                        onClick={() => {
                          if (addForm.imagePreview) URL.revokeObjectURL(addForm.imagePreview);
                          setAddForm(f => ({ ...f, image: null, imagePreview: null }));
                        }}
                      >
                        Quitar imagen
                      </button>
                    )}
                  </div>
                </div>
                {/* Ingredientes dinámicos */}
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-1">Ingredientes</label>
                  {addForm.ingredients && addForm.ingredients.map((ingredient, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={ingredient.name}
                        onChange={e => {
                          const newIngredients = [...addForm.ingredients];
                          newIngredients[idx].name = e.target.value;
                          setAddForm(f => ({ ...f, ingredients: newIngredients }));
                        }}
                        className="border p-2 rounded w-1/3"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Cantidad"
                        value={ingredient.quantity}
                        onChange={e => {
                          const newIngredients = [...addForm.ingredients];
                          newIngredients[idx].quantity = e.target.value;
                          setAddForm(f => ({ ...f, ingredients: newIngredients }));
                        }}
                        className="border p-2 rounded w-1/4"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Tipo (ej. sólido, líquido)"
                        value={ingredient.type || ''}
                        onChange={e => {
                          const newIngredients = [...addForm.ingredients];
                          newIngredients[idx].type = e.target.value;
                          setAddForm(f => ({ ...f, ingredients: newIngredients }));
                        }}
                        className="border p-2 rounded w-1/4"
                      />
                      <input
                        type="text"
                        placeholder="Unidad (ej. g, ml, taza)"
                        value={ingredient.unit}
                        onChange={e => {
                          const newIngredients = [...addForm.ingredients];
                          newIngredients[idx].unit = e.target.value;
                          setAddForm(f => ({ ...f, ingredients: newIngredients }));
                        }}
                        className="border p-2 rounded w-1/4"
                        required
                      />
                      <button
                        type="button"
                        className="text-red-500 ml-2"
                        onClick={() => {
                          const newIngredients = addForm.ingredients.filter((_, i) => i !== idx);
                          setAddForm(f => ({ ...f, ingredients: newIngredients.length ? newIngredients : [{ name: '', quantity: '', type: '', unit: '' }] }));
                        }}
                        aria-label="Eliminar ingrediente"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setAddForm(f => ({ ...f, ingredients: [...(f.ingredients || []), { name: '', quantity: '', type: '', unit: '' }] }))
                    }
                  >
                    Añadir ingrediente
                  </button>
                </div>
                {/* Pasos dinámicos */}
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-1">Pasos de la preparación</label>
                  {addForm.steps && addForm.steps.map((step, idx) => (
                    <div key={idx} className="mb-2">
                      <textarea
                        placeholder={`Describe el paso ${idx + 1}`}
                        value={step.text}
                        onChange={e => {
                          const newSteps = [...addForm.steps];
                          newSteps[idx].text = e.target.value;
                          setAddForm(f => ({ ...f, steps: newSteps }));
                        }}
                        className="border p-2 rounded w-full mb-1"
                        required
                      />
                      {/* Imagen del paso */}
                      <div className="flex items-center gap-2 mb-1">
                        {step.imagePreview && (
                          <img src={step.imagePreview} alt={`Paso ${idx + 1}`} className="h-16 w-16 object-cover rounded" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files[0];
                            if (!file) return;
                            if (!file.type.startsWith('image/')) return;
                            if (step.imagePreview) URL.revokeObjectURL(step.imagePreview);
                            const url = URL.createObjectURL(file);
                            const newSteps = [...addForm.steps];
                            newSteps[idx].image = file;
                            newSteps[idx].imagePreview = url;
                            setAddForm(f => ({ ...f, steps: newSteps }));
                          }}
                        />
                        {step.imagePreview && (
                          <button
                            type="button"
                            className="text-red-500 text-xs"
                            onClick={() => {
                              if (step.imagePreview) URL.revokeObjectURL(step.imagePreview);
                              const newSteps = [...addForm.steps];
                              newSteps[idx].image = null;
                              newSteps[idx].imagePreview = null;
                              setAddForm(f => ({ ...f, steps: newSteps }));
                            }}
                          >
                            Quitar imagen
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        className="text-red-500 text-sm"
                        onClick={() => {
                          const newSteps = addForm.steps.filter((_, i) => i !== idx);
                          setAddForm(f => ({ ...f, steps: newSteps.length ? newSteps : [{ text: '', image: null, imagePreview: null }] }));
                        }}
                        aria-label="Eliminar paso"
                      >
                        Eliminar paso
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setAddForm(f => ({ ...f, steps: [...(f.steps || []), { text: '', image: null, imagePreview: null }] }))
                    }
                  >
                    Añadir paso
                  </button>
                </div>
                <div className="flex justify-end mt-6 gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setAddModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {viewModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Detalles de la Receta</h3>
            <div className="space-y-2">
              <div><span className="font-semibold">Nombre:</span> {viewModal.recipe.name}</div>
              <div><span className="font-semibold">Descripción:</span> {viewModal.recipe.description}</div>
              <div><span className="font-semibold">Duración:</span> {viewModal.recipe.duration_minutes} min</div>
              <div><span className="font-semibold">Comensales:</span> {viewModal.recipe.commensals}</div>
              <div><span className="font-semibold">Categorías:</span> {Array.isArray(viewModal.recipe.categories) ? viewModal.recipe.categories.join(', ') : viewModal.recipe.categories}</div>
              <div><span className="font-semibold">Autor:</span> {viewModal.recipe.user?.username || viewModal.recipe.user || '-'}</div>
              <div><span className="font-semibold">Creada:</span> {viewModal.recipe.created_at}</div>
              <div><span className="font-semibold">Actualizada:</span> {viewModal.recipe.updated_at}</div>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={closeViewModal} className="bg-gray-300 px-4 py-2 rounded">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeManagement;
