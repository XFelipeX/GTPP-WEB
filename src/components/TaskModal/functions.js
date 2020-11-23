import api from "../../services/api";

export const loadTaskItems = async (taskId) => {
  const AUTH = sessionStorage.getItem("token");
  try {
    const { data } = await api.get("GTPP/TaskItem.php", {
      params: { AUTH: AUTH, app_id: 3, task_id: taskId },
    });
    // console.log(data)
    return data;
  } catch (error) {
    return [{}];
  }
};

export const deleteItem = async (taskId,itemId) => {
  const AUTH = sessionStorage.getItem("token");
  try {
    const {data} = await api.delete("GTPP/TaskItem.php",{params:{AUTH:AUTH, app_id:3 , id:itemId,task_id:taskId}})
    console.log(data);
  } catch (error) {
    alert("error ao excluir item");
  }
}

export const addItem = async (taskId,description) => {
  const AUTH = sessionStorage.getItem("token");

  try{
    const {data} = await api.post("GTPP/TaskItem.php?AUTH="+AUTH+"&app_id=3",{task_id:taskId,description:description});
    console.log(data);
  }catch(error){
    alert("erro ao inserir item");
  }
}

export const updateDescription = async (taskId,description) => {
  const AUTH = sessionStorage.getItem("token");

  try{
       const data = await api.put(`GTPP/Task.php?AUTH=${AUTH}&app_id=3`, {
        "id":taskId,
        "full_description":description,
      }).then((response) => {   
        return response;
      })

      console.log(data);
     }catch(error){
       console.log(error.message);
     } 

  }

export const changeItemChecked = async (taskId, itemId, check) => {
  const AUTH = sessionStorage.getItem("token");
  try {
    const { data } = await api.put(
      "GTPP/TaskItem.php?AUTH=" + AUTH + "&app_id=3",
      { task_id: taskId, id: itemId, check: check }
    );
    console.log(data);
    return data;
  } catch (error) {
    return [{}];
  }
};

export const loadTask = async (params, order) => {
  const AUTH = sessionStorage.getItem("token");

  try {
    const { data } = await api.get("GTPP/Task.php", {
      params: { AUTH: AUTH, col: 1, order: "asc", app_id: 3 },
    });
    // console.log(data)
    return data;
  } catch (error) {
    return [{}];
  }
};
