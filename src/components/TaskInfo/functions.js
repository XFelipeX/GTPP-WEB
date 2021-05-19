import api from "../../services/api";
import {showNotification} from '../../Utils/Notify';

export const updateFullDescription = async (taskId, description, auth) => {
  const AUTH = auth;

  try {
    const data = await api
      .put(`GTPP/Task.php?AUTH=${AUTH}&app_id=3`, {
        id: taskId,
        full_description: description,
      })
      .then((response) => {
        return response;
      });

    if (data.error === false) {
      return data.data;
    } else {
      return data.data.message;
    }
  } catch (error) {
    let msg = String(error.response.data.message);

    return msg;
  }
};

export const updateCheckDept = async (
  taskId,
  deptId,
  shopId,
  companyId,
  auth
) => {
  const AUTH = auth;
  try {
    const data = await api.post(
      "GTPP/TaskComShoDepSub.php?AUTH=" + AUTH + "&app_id=3",
      {
        task_id: taskId,
        company_id: companyId,
        shop_id: shopId,
        depart_id: deptId,
      }
    );

    if (data.error === true) {
      if (data.message === "No data") {
      } else {
        showNotification("Erro", data.message, "danger");
      }
    }

    return data;
  } catch (error) {
    let msg = String(error.response.data.message);
    if (msg.includes("Task with this state cannot be modified")) {
      showNotification(
        "Aviso",
        "Tarefa com este estado não pode ser modificada",
        "warning"
      );
    } else if (
      msg.includes("Only the task creator or administrator can do this")
    ) {
      showNotification(
        "Aviso",
        "Somente o criador da tarefa ou administrador pode fazer isto",
        "warning"
      );
    } else {
      showNotification("Erro", msg, "danger");
    }
    return null;
  }
};

export const loadShopsCompany = async (idCompany, auth) => {
  const AUTH = auth;

  try {
    const { data } = await api.get(
      "CCPP/Shop.php?AUTH=" + AUTH + "&app_id=3&company_id=" + idCompany
    );

    if (data.error === true) {
      if (data.message === "No data") {
      } else {
        showNotification("Erro", data.message, "danger");
      }
    }

    return data;
  } catch (error) {
    showNotification("Erro", String(error.message), "danger");
    return [{}];
  }
};

export const loadDeptsCompany = async (idCompany, idShop, idTask, auth) => {
  const AUTH = auth;

  try {
    const { data } = await api.get(
      "CCPP/Department.php?AUTH=" +
        AUTH +
        "&app_id=3&company_id=" +
        idCompany +
        "&shop_id=" +
        idShop +
        "&task_id=" +
        idTask
    );

    if (data.error === true) {
      if (data.message === "No data") {
      } else {
        showNotification("Erro", data.message, "danger");
      }
    }
    return data.data;
  } catch (error) {
    showNotification("Erro", String(error.message), "danger");
    return [{}];
  }
};

export const updateStateTask = async (idTask, reason, days, auth) => {
  const AUTH = auth;

  try {
    const { data } = await api
      .put(`GTPP/TaskState.php?AUTH=${AUTH}&app_id=3`, {
        task_id: idTask,
        reason: reason,
        days: days,
      })
      .then((response) => {
        return response;
      });

    if (data.error === true) {
      showNotification("Erro", data.message, "danger");
    }
    return data.data;
  } catch (error) {
    let msg = String(error.response.data.message);
    if (msg.includes("This user can not do this")) {
      showNotification(
        "Aviso",
        "Somente o criador da tarefa ou administrador pode fazer isto",
        "warning"
      );
    } else if (msg.includes("Days cannot be negative")) {
      showNotification(
        "Aviso",
        "A quantidade de dias não pode ser negativa",
        "warning"
      );
    } else {
      showNotification("Erro", String(error.message), "danger");
    }
  }
};

export const cancelStateTask = async (idTask, reason, auth) => {
  const AUTH = auth;
  try {
    const { data } = await api
      .put(`GTPP/TaskState.php?AUTH=${AUTH}&app_id=3`, {
        task_id: idTask,
        reason: reason,
        cancel: 1,
      })
      .then((response) => {
        return response;
      });

    if (data.error === true) {
      showNotification("Erro", data.message, "danger");
    }
    return data.data[0];
  } catch (error) {
    if (error.response) {
      let msg = String(error.response.data.message);

      if (msg.includes("This user can not do this")) {
        showNotification(
          "Aviso",
          "Somente o criador da tarefa ou administrador pode fazer isto",
          "warning"
        );
      } else if (msg.includes("This state can not modified")) {
        showNotification(
          "Aviso",
          "Este estado não pode ser modificado",
          "warning"
        );
      } else {
        showNotification("Erro", msg, "danger");
      }
    } else {
      showNotification("Erro", String(error.message), "danger");
    }
  }
};

export function formatDate(props) {
  if (props !== undefined) {
    let data = props.split("-");
    var day = data[2];
    var month = data[1];
    var year = data[0];
    return day + "/" + month + "/" + year;
  }
}


