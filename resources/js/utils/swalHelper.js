// src/utils/swalHelper.js
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false,
});

export const showSuccess = (title = 'Éxito', message = '') => {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    timer: 2000,
    showConfirmButton: false,
  });
};

export const showError = (title = 'Error', message = 'Ocurrió un error inesperado') => {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
  });
};

export const showConfirm = async (
  title = '¿Estás seguro?',
  text = 'Esta acción no se puede deshacer',
  confirmButtonText = 'Sí, confirmar',
  cancelButtonText = 'Cancelar'
) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  });
};

export const showToast = (type = 'success', message = 'Listo') => {
  return Toast.fire({
    icon: type,
    title: message,
  });
};
