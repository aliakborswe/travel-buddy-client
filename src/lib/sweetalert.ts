import Swal from "sweetalert2";

/**
 * Show a success alert
 */
export const showSuccessAlert = (title: string, message?: string) => {
  return Swal.fire({
    icon: "success",
    title,
    text: message,
    confirmButtonColor: "#3b82f6",
    timer: 3000,
    timerProgressBar: true,
  });
};

/**
 * Show an error alert
 */
export const showErrorAlert = (title: string, message?: string) => {
  return Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonColor: "#3b82f6",
  });
};

/**
 * Show an info alert
 */
export const showInfoAlert = (title: string, message?: string) => {
  return Swal.fire({
    icon: "info",
    title,
    text: message,
    confirmButtonColor: "#3b82f6",
  });
};

/**
 * Show a warning alert
 */
export const showWarningAlert = (title: string, message?: string) => {
  return Swal.fire({
    icon: "warning",
    title,
    text: message,
    confirmButtonColor: "#3b82f6",
  });
};

/**
 * Show a confirmation dialog
 */
export const showConfirmDialog = async (
  title: string,
  message?: string,
  confirmText: string = "Yes, proceed",
  cancelText: string = "Cancel"
): Promise<boolean> => {
  const result = await Swal.fire({
    icon: "question",
    title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#ef4444",
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });

  return result.isConfirmed;
};

/**
 * Show a delete confirmation dialog
 */
export const showDeleteConfirm = async (
  itemName: string = "this item"
): Promise<boolean> => {
  const result = await Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: `You won't be able to revert this! This will permanently delete ${itemName}.`,
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  return result.isConfirmed;
};

/**
 * Show a toast notification (small notification)
 */
export const showToast = (
  icon: "success" | "error" | "warning" | "info",
  title: string
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  return Toast.fire({
    icon,
    title,
  });
};
