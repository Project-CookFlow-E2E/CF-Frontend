export const validatePositive = (value) => {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    return 'El valor debe ser un número positivo.';
  }
  return true;
};