import { toast } from "react-toastify";

const toastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: "colored",
};

export const toastMessage = (content, type = "info") => {
  return toast(content, { type, ...toastOptions });
};
