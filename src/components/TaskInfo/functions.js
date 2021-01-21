import api from "../../services/api";
import { store } from "react-notifications-component";

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
  // console.log(taskId,deptId,shopId,companyId);
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

    // console.log(data);
    return data;
  } catch (error) {
    let msg = String(error.response.data.message);
    // console.log(error.response.data.message);
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

    // console.log(data);
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
      // showNotification('Erro',data.message,'danger');
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
        // console.log(response)
        return response;
      });

    if (data.error === true) {
      showNotification("Erro", data.message, "danger");
    }
    return data.data;
  } catch (error) {
    let msg = String(error.response.data.message);
    // console.log(error.response.data.message);
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
        // console.log(response)

        return response;
      });

    if (data.error === true) {
      showNotification("Erro", data.message, "danger");
    }
    return data.data[0];
  } catch (error) {
    if (error.response) {
      let msg = String(error.response.data.message);
      // console.log(error.response.data.message);
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
    const date = new Date(props);
    var day = data[2];
    var month = data[1];
    var year = data[0];
    return day + "/" + month + "/" + year;
  }
}

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

// export function formatDate(props) {
//   const date = new Date(props);
//   var day = date.getDate();
//   var month = date.getMonth();
//   day++;
//   if (day < 10) {
//     day = "0" + day;
//   }else if(day==32){
//     day = "0"+1;
//     if(month<12){
//     month++;}else{
//       month = 0;
//     }
//   }

//   if(month<12){
//     month++;}
//   if (month < 10) {
//     month = "0" + month;
//   }
//   var year = date.getFullYear();
//   return day + "/" + month + "/" + year;
// }
