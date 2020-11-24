import api from "../../services/api";

export const updateDescription = async (taskId, description) => {
  const AUTH = sessionStorage.getItem("token");

  try {
    const data = await api
      .put(`GTPP/Task.php?AUTH=${AUTH}&app_id=3`, {
        id: taskId,
        full_description: description,
      })
      .then((response) => {
        return response;
      });

    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
};
