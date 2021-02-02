import api from "../../services/api";
import { store } from "react-notifications-component";

function showNotification(title, message, type) {
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

export async function getMessage(auth, taskId) {
  const AUTH = auth;

  try {
    const { data } = await api.get(
      `GTPP/Message.php?AUTH=${AUTH}&app_id=3&task_id=${taskId}`
    );

    if (data.error === true) {
      showNotification("Erro", data.message, "danger");
    }

    // console.log(data);
  } catch (error) {
    showNotification("Erro", error.message, "danger");
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

export async function createMessageWithImage(msg,image, taskId, auth) {

  const img = image.split(',');
  // console.log(image);
  try {
    const { data } = await api.post(`GTPP/Message.php?AUTH=${auth}&app_id=3`, {
      description: msg,
      task_id: taskId,
      image:img[1],
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
