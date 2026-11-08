
import Swal from "sweetalert2";

const popup = Swal.mixin({
  confirmButtonColor: "#789477",
  cancelButtonColor: "#d88f91",
  reverseButtons: true,
  customClass: {
    popup: "pawhaven-swal-popup",
    title: "pawhaven-swal-title",
    confirmButton: "pawhaven-swal-confirm",
    cancelButton: "pawhaven-swal-cancel"
  }
});

export const showSuccess = (title, text = "") => {
  return popup.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "Okay"
  });
};

export const showError = (title, text = "") => {
  return popup.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "Okay"
  });
};

export const showWarning = (title, text = "") => {
  return popup.fire({
    icon: "warning",
    title,
    text,
    confirmButtonText: "Okay"
  });
};

export const showInfo = (title, text = "") => {
  return popup.fire({
    icon: "info",
    title,
    text,
    confirmButtonText: "Okay"
  });
};

export const showConfirm = (title, text = "") => {
  return popup.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel"
  });
};

export default popup;
