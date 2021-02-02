import api from "../../services/api";
import { store } from "react-notifications-component";

export function showNotification(title, message, type) {
  store.addNotification({
    title: title,
    message: message,
    type: type,
    container: "top-center",
    insert: "top",
    animationIn: ["animate__animated animate__fadeIn"],
    animationOut: ["animate__animated animate__fadeOut"],
    dismiss: {
      duration: 2000,
    },
    width: 400,
  });
}

export const loadShopsCompany = async (idCompany, auth) => {
  const AUTH = auth;

  try {
    const { data } = await api.get(
      "CCPP/Shop.php?AUTH=" + AUTH + "&app_id=3&company_id=" + idCompany
    );

    if (data.error === true) {
      let msg = data.message;

      if (msg.includes("No data")) {
        // showNotification('Aviso','Você ainda não possui tarefas','warning');
      } else if (msg.includes("Authorization denied")) {
        showNotification("Erro", "Autorização negada", "danger");
      } else {
        showNotification("Erro", msg, "danger");
      }
    }
    return data;
  } catch (error) {
    showNotification("Erro", error.message, "danger");
    return [{}];
  }
};

export const loadDeptsCompany = async (idCompany, idShop, auth) => {
  const AUTH = auth;

  try {
    const { data } = await api.get(
      "CCPP/Department.php?AUTH=" +
        AUTH +
        "&app_id=3&company_id=" +
        idCompany +
        "&shop_id=" +
        idShop
    );

    if (data.error === true) {
      let msg = data.message;

      if (msg.includes("No data")) {
        // showNotification('Aviso','Você ainda não possui tarefas','warning');
      } else if (msg.includes("Authorization denied")) {
        showNotification("Erro", "Autorização negada", "danger");
      } else {
        showNotification("Erro", msg, "danger");
      }
    }
    return data.data;
  } catch (error) {
    showNotification("Erro", error.message, "danger");
    return [{}];
  }
};
