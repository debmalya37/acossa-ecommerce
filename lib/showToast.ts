import { Bounce, toast, ToastOptions, Theme } from "react-toastify";

// Allowed toast types
export type ToastType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "default";

// Toast function
export const showToast = (type: ToastType, message: string): void => {
  const options: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light" as Theme,
    transition: Bounce,
  };

  switch (type) {
    case "info":
      toast.info(message, options);
      break;
    case "success":
      toast.success(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    default:
      toast(message, options);
      break;
  }
};
