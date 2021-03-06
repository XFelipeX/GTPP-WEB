import api from "../../services/api";
import {showNotification} from '../../Utils/Notify';

export const updateDescription = async (
  taskId,
  description,
  priority,
  auth
) => {
  const AUTH = auth;

  try {
    const data = await api
      .put(`GTPP/Task.php?AUTH=${AUTH}&app_id=3`, {
        id: taskId,
        description: description,
        priority: priority,
      })
      .then((response) => {
        return response;
      });

    if (data.error === true) {
      showNotification("Erro", String(data.message), "danger");
      return null;
    }

    showNotification(
      "Sucesso",
      "A descrição da tarefa foi atualizada",
      "success"
    );
    return data;
  } catch (error) {
    let msg = String(error.response.data.message);
    if (msg.includes("Only the task creator or administrator can do this")) {
      showNotification(
        "Aviso",
        "Somente o criador da tarefa ou administrador pode fazer isto",
        "warning"
      );
    } else if (msg.includes("The full description cannot be empty")) {
      showNotification(
        "Aviso",
        "Preencha o campo da descrição para atualizar",
        "warning"
      );
    } else if (msg.includes("Task with this state cannot be modified")) {
      showNotification(
        "Aviso",
        "Tarefa neste estado não pode ser modificada",
        "warning"
      );
    } else if (
      msg.includes(
        "(id, full_description || (description, priority)) is broken"
      )
    ) {
      showNotification(
        "Aviso",
        "Preencha o campo da descrição para atualizar",
        "warning"
      );
    }

    return null;
  }
};

export async function getMessage(auth, taskId) {
  const AUTH = auth;

  try {
    const { data } = await api.get(
      `GTPP/Message.php?AUTH=${AUTH}&app_id=3&task_id=${taskId}`
    );

    return data.data;
  } catch (error) {
    console.log(error);
    return [{}];
  }
}

