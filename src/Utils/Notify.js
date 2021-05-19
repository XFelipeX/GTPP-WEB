import { store } from "react-notifications-component";

export function showNotification(title, message, type) {
  store.addNotification({
    title: title,
    message: message,
    type: type,
    container: "bottom-left",
    insert: "top",
    animationIn: ["animate__animated animate__zoomIn"],
    animationOut: ["animate__animated animate__flipOutX"],
    dismiss: {
      duration: 4000,
      onScreen:true
    },
    width: 400,
  });
}
