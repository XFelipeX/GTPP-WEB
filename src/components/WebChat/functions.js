import api from '../../services/api';
import { showNotification } from '../../Utils/Notify';

export async function getMessage(auth, taskId) {
  const AUTH = auth;

  try {
    const { data } = await api.get(
      `GTPP/Message.php?AUTH=${AUTH}&app_id=3&task_id=${taskId}`,
    );

    if (data.error === true) {
      showNotification('Erro', data.message, 'danger');
    }
  } catch (error) {
    showNotification('Erro', error.message, 'danger');
  }
}

export async function createMessage(msg, taskId, auth) {
  try {
    const { data } = await api.post(`GTPP/Message.php?AUTH=${auth}&app_id=3`, {
      description: msg,
      task_id: taskId,
    });

    if (data.error === true) {
      console.log(data.message);
    } else {
      return data.data;
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response);
    }

    console.log(error);
  }
}

export async function createMessageWithImage(msg, image, taskId, auth) {
  const img = image.split(',');
  try {
    const { data } = await api.post(`GTPP/Message.php?AUTH=${auth}&app_id=3`, {
      description: msg,
      task_id: taskId,
      image: img[1],
    });

    if (data.error === true) {
      console.log(data.message);
    } else {
      return data.data;
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response);
    }

    console.log(error);
  }
}
