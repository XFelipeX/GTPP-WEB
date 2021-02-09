import api from "../../services/api";
import {showNotification} from '../../Utils/Notify';

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
