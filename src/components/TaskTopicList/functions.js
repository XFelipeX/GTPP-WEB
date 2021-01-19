import api from "../../services/api";
import { store } from "react-notifications-component";

export const changeItemChecked = async (taskId, itemId, check, auth) => {
  const AUTH = auth;
  try {
    const { data } = await api.put(
      "GTPP/TaskItem.php?AUTH=" + AUTH + "&app_id=3",
      { task_id: taskId, id: itemId, check: check }
    );

    // console.log(data);

    if (data.error === true) {
      showNotification("Erro", String(data.message), "danger");
      return null;
    }
    return data.data;
  } catch (error) {
    // console.log('error')

    if(error.response){
      let msg = error.response.data.message;

      if (msg.includes("Task with this state cannot be modified")) {
        showNotification(
          "Aviso",
          "Tarefa neste estado não pode ser modificada",
          "warning"
        );
      }else if(msg.includes("Only the task creator, administrator or attached user can do this")){
        showNotification(
          "Aviso",
          "Somente o criador da tarefa ou administrador pode fazer isto",
          "warning"
        );
      }
      
      else {
        showNotification(
          "Erro",
          msg,
          "danger"
        );
      }
    }else{
      showNotification(
        "Erro",
        String(error.message),
        "danger"
      );
    }

  
    return null;
  }
};

export const deleteItem = async (taskId, itemId, auth) => {
  const AUTH = auth;
  try {
    const { data } = await api.delete("GTPP/TaskItem.php", {
      params: { AUTH: AUTH, app_id: 3, id: itemId, task_id: taskId },
    });
    if (data.error === true) {
      showNotification("Erro", String(data.message), "danger");
      return null;
    }

    showNotification("Sucesso", "O item foi removido da tarefa", "success");
    return data.data;
  } catch (error) {
    if(error.response){
      let msg = error.response.data.message;

      if (msg.includes("Task with this state cannot be modified")) {
        showNotification(
          "Aviso",
          "Tarefa neste estado não pode ser modificada",
          "warning"
        );
      }
    }else{
      showNotification(
        "Erro",
        String(error.message),
        "danger"
      );
    }

   
    return null;
  }
};

export const addItem = async (taskId, description, auth) => {
  const AUTH = auth;

  try {
    const { data } = await api.post(
      "GTPP/TaskItem.php?AUTH=" + AUTH + "&app_id=3",
      { task_id: taskId, description: description }
    );
    if (data.error === true) {
      showNotification("Erro", String(data.message), "danger");
      return null;
    }
    showNotification(
      "Sucesso",
      "Um novo item foi adicionado a tarefa",
      "success"
    );
    return data.data;
  } catch (error) {
    if(error.response){
      let msg = error.response.data.message;

      if (msg.includes("Task with this state cannot be modified")) {
        showNotification(
          "Aviso",
          "Tarefa neste estado não pode ser modificada",
          "warning"
        );
      }
    }else{
      showNotification(
        "Aviso",
        String(error.message),
        "warning"
      );
    }

   
    return null;
  }
};

export const updateTopicDescription = async (
  itemId,
  description,
  taskId,
  auth
) => {
  const AUTH = auth;
  try {
    const { data } = await api.put(
      "GTPP/TaskItem.php?AUTH=" + AUTH + "&app_id=3",
      { task_id: taskId, id: itemId, description: description }
    );

    if (data.error === true) {
      if (data.message.includes("No data to Update")) {
        showNotification(
          "Aviso",
          "Sem dados para atualizar, modifique a descrição do item",
          "warning"
        );
      } else {
        showNotification("Erro", String(data.message), "danger");
      }
      return null;
    }

    showNotification(
      "Sucesso",
      "A descrição do item foi modificada",
      "success"
    );
    // console.log(data);
    return data;
  } catch (error) {
    let msg = error.response.data.message;

    if (msg.includes("Task with this state cannot be modified")) {
      showNotification(
        "Aviso",
        "Tarefa neste estado não pode ser modificada",
        "warning"
      );
    } else if (
      msg.includes("Only the task creator or administrator can do this")
    ) {
      showNotification(
        "Aviso",
        "Somente o criador da tarefa ou administrador poder fazer isto",
        "warning"
      );
    }

    return null;
  }
};

export const takeHistoricTask = async (taskId, auth) => {
  const AUTH = auth;
  try {
    const { data } = await api.get(
      "GTPP/TaskHistoric.php?AUTH=" + AUTH + "&app_id=3&task_id=" + taskId
    );
    // console.log(data);
    if (data.error === true) {
      showNotification("Erro", String(data.message), "danger");
    }
    return data;
  } catch (error) {
    showNotification("Erro", String(error), "danger");
    return [{}];
  }
};

export const nextOrPreviousTopic = async (
  taskId,
  auth,
  nextOrPrevious,
  itemId
) => {
  const AUTH = auth;
  try {
    const { data } = await api.put(
      "GTPP/TaskItem.php?AUTH=" + AUTH + "&app_id=3",
      {
        task_id: taskId,
        id: itemId,
        next_or_previous: nextOrPrevious,
      }
    );
    // console.log(data);
    if (data.error === true) {
      showNotification("Erro", String(data.message), "danger");
    }

    return data;
  } catch (error) {
    showNotification("Erro", String(error), "danger");
    return [{}];
  }
};

export const changeYesNoTopic = async (taskId, yesOrNo, itemId, auth) => {
  const AUTH = auth;
  try {
    const { data } = await api.put(
      "GTPP/TaskItem.php?AUTH=" + AUTH + "&app_id=3",
      {
        task_id: taskId,
        id: itemId,
        yes_no: yesOrNo,
      }
    );

    if (data.error === true) {
      showNotification("Erro", String(data.message), "danger");
      return null;
    }

    // console.log(data);
    return data.data;
  } catch (error) {
    if (error.response) {
      let msg = error.response.data.message;

      if (msg.includes("Task with this state cannot be modified")) {
        showNotification(
          "Aviso",
          "Tarefa neste estado não pode ser modificada",
          "warning"
        );
      }
    } else {
      showNotification("Erro", error.message, "danger");
    }

    return null;
  }
};

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
