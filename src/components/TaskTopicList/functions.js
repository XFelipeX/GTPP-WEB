import api from "../../services/api";

export const changeItemChecked = async (taskId, itemId, check, auth) => {
  const AUTH = auth;
  try {
    const { data } = await api.put(
      "GTPP/TaskItem.php?AUTH=" + AUTH + "&app_id=3",
      { task_id: taskId, id: itemId, check: check }
    );
    // console.log(data);
    return data.data;
  } catch (error) {
    let msg = error.response.data.message;

    if (msg.includes("Task with this state cannot be modified")) {
      alert("Tarefa neste estado não pode ser modificada!");
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
    // console.log(data);
    return data.data;
  } catch (error) {
    let msg = error.response.data.message;

    if (msg.includes("Task with this state cannot be modified")) {
      alert("Tarefa neste estado não pode ser modificada!");
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
    // console.log(data);
    return data.data;
  } catch (error) {
    let msg = error.response.data.message;

    if (msg.includes("Task with this state cannot be modified")) {
      alert("Tarefa neste estado não pode ser modificada!");
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
    // console.log(data);
    return data;
  } catch (error) {
    let msg = error.response.data.message;

    if (msg.includes("Task with this state cannot be modified")) {
      alert("Tarefa neste estado não pode ser modificada!");
    } else if (
      msg.includes("Only the task creator or administrator can do this")
    ) {
      alert("Somente o criador da tarefa ou administrador poder fazer isto!");
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
    return data;
  } catch (error) {
    return [{}];
  }
};

export const nextOrPreviousTopic = async (taskId,auth,nextOrPrevious,itemId) => {
  const AUTH = auth;
  try {
    const { data } = await api.put(
      "GTPP/TaskItem.php?AUTH=" + AUTH + "&app_id=3",{
         task_id: taskId, id: itemId, next_or_previous: nextOrPrevious 
      }
    );
    // console.log(data);
    return data;
  } catch (error) {
    return [{}];
  }
}

export const changeYesNoTopic = async (taskId,yesOrNo,itemId,auth) => {
  const AUTH = auth;
  try {
    const { data } = await api.put(
      "GTPP/TaskItem.php?AUTH=" + AUTH + "&app_id=3",{
         task_id: taskId, id: itemId, yes_no: yesOrNo
      }
    );
    // console.log(data);
    return data.data;
  } catch (error) {
    return [{}];
  }
}
