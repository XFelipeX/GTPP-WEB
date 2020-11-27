import api from "../../services/api";

export const changeItemChecked = async (taskId, itemId, check) => {
    const AUTH = sessionStorage.getItem("token");
    try {
      const { data } = await api.put(
        "GTPP/TaskItem.php?AUTH=" + AUTH + "&app_id=3",
        { task_id: taskId, id: itemId, check: check }
      );
      // console.log(data);
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