export const validateImageFile = (file) => {
  if (!file) {
    return false;
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    console.error('Tipo de archivo no permitido:', file.type);
    return false;
  }

  // Check file size (e.g., max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
  if (file.size > maxSize) {
    console.error('Tamaño de archivo excedido:', file.size / (1024 * 1024), 'MB');
    return false;
  }

  return true;
};