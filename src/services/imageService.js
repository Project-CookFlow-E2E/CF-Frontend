import api from "./api";

/**
 * Servicio para gestionar la imagen de perfil del usuario autenticado.
 * Usa el endpoint: PUT /api/users/me/image/
 * @author Lorena Martínez
 */

export const imageService = {
  /**
   * Actualiza la imagen de perfil del usuario autenticado.
   * @param {File} imageFile - Archivo de imagen (File).
   * @returns {Promise<object>} - Datos de la imagen actualizada.
   */
  updateProfileImage: async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await api.put("/users/me/image/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  /**
   * Elimina la imagen de perfil del usuario autenticado.
   * @returns {Promise<object>} - Datos de la imagen eliminada.
   */
  deleteProfileImage: async () => {
    // No enviamos archivo, solo DELETE
    const response = await api.delete("/users/me/image/");
    return response.data;
  },
};
