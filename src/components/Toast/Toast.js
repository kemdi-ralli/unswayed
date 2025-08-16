import Swal from 'sweetalert2';

const ToastInstance = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const Toast = (icon, title) =>
  ToastInstance.fire({
    icon,
    title,
  });
